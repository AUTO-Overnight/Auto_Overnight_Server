package functions

import (
	"auto_overnight_api/xmls"
	"bytes"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"sync"
)

type RequestModel struct {
	Id       string `json:"id"`
	PassWord string `json:"password"`
}

func Login(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var requestsModel RequestModel
	err := json.Unmarshal([]byte(request.Body), &requestsModel)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}
	loginInfo := url.Values{
		"internalId": {requestsModel.Id},
		"internalPw": {requestsModel.PassWord},
		"gubun":      {"inter"},
	}

	jar, err := cookiejar.New(nil)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest("POST", "https://ksc.tukorea.ac.kr/sso/login_proc.jsp?returnurl=null", bytes.NewBufferString(loginInfo.Encode()))
	if err != nil {
		panic(err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	client := &http.Client{
		Jar: jar,
	}
	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer res.Body.Close()

	req, err = http.NewRequest("GET", "https://dream.tukorea.ac.kr/com/SsoCtr/initPageWork.do?loginGbn=sso&loginPersNo=", nil)

	if err != nil {
		panic(err)
	}

	res, err = client.Do(req)
	if err != nil {
		panic(err)
	}
	findUserNmChan := make(chan xmls.Root)
	findYYtmgbnChan := make(chan xmls.Root)

	go xmls.FindUserNm(client, findUserNmChan)
	go xmls.FindYYtmgbn(client, findYYtmgbnChan)

	studentInfo := <-findUserNmChan
	yytmGbnInfo := <-findYYtmgbnChan

	stayOutList := xmls.FindStayOut(client, studentInfo, yytmGbnInfo)

	responseBody := make(map[string]interface{})
	responseBody["name"] = studentInfo.Dataset[0].Rows.Row[0].Col[0].Data
	responseBody["yy"] = yytmGbnInfo.Dataset[0].Rows.Row[0].Col[0].Data
	responseBody["tmGbn"] = yytmGbnInfo.Dataset[0].Rows.Row[0].Col[1].Data

	cookies := make(map[string]string)

	outStayFrDt := make([]string, len(stayOutList.Dataset[1].Rows.Row))
	outStayToDt := make([]string, len(stayOutList.Dataset[1].Rows.Row))
	outStayStGbn := make([]string, len(stayOutList.Dataset[1].Rows.Row))

	var wg sync.WaitGroup
	wg.Add(len(stayOutList.Dataset[1].Rows.Row) + 3)

	go func() {
		for i, v := range stayOutList.Dataset[1].Rows.Row[:len(stayOutList.Dataset[1].Rows.Row)/2] {
			go func(i int, v xmls.Row) {
				outStayFrDt[i] = v.Col[2].Data
				outStayToDt[i] = v.Col[1].Data
				outStayStGbn[i] = v.Col[0].Data
				wg.Done()
			}(i, v)
		}
		wg.Done()
	}()
	go func() {
		for i, v := range stayOutList.Dataset[1].Rows.Row[len(stayOutList.Dataset[1].Rows.Row)/2:] {
			i += len(stayOutList.Dataset[1].Rows.Row) / 2
			go func(i int, v xmls.Row) {
				outStayFrDt[i] = v.Col[2].Data
				outStayToDt[i] = v.Col[1].Data
				outStayStGbn[i] = v.Col[0].Data
				wg.Done()
			}(i, v)
		}
		wg.Done()
	}()
	go func() {
		for _, info := range req.Cookies() {
			cookies[info.Name] = info.Value
		}
		wg.Done()
	}()
	wg.Wait()

	responseBody["cookies"] = cookies
	responseBody["outStayFrDt"] = outStayFrDt
	responseBody["outStayToDt"] = outStayToDt
	responseBody["outStayStGbn"] = outStayStGbn

	responseJson, _ := json.Marshal(responseBody)
	response := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseJson),
	}
	return response, nil
}
