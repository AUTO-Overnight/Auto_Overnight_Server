package functions

import (
	"auto_overnight_api/xmls"
	"bytes"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"io/ioutil"
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

	findLiveStuNoXML := []byte(fmt.Sprintf(`<?xmls version="1.0" encoding="UTF-8"?>
    <Root xmlns="http://www.nexacroplatform.com/platform/dataset">
        <Parameters>
            <Parameter id="_ga">GA1.3.1065330987.1626699518</Parameter>
            <Parameter id="requestTimeStr">1626877490927</Parameter>
        </Parameters>
        <Dataset id="DS_COND">
            <ColumnInfo>
                <Column id="yy" type="STRING" size="256"  />
                <Column id="tmGbn" type="STRING" size="256"  />
                <Column id="schregNo" type="STRING" size="256"  />
                <Column id="stdKorNm" type="STRING" size="256"  />
                <Column id="outStayStGbn" type="STRING" size="256"  />
            </ColumnInfo>
            <Rows>
                <Row type="update">
                    <Col id="yy">%s</Col>
                    <Col id="tmGbn">%s</Col>
                    <Col id="schregNo">%s</Col>
                    <Col id="stdKorNm">%s</Col>
                    <OrgRow>
                    </OrgRow>
                </Row>
            </Rows>
        </Dataset>
    </Root>`,
		yytmGbnInfo.Dataset[0].Rows.Row[0].Col[0].Data,
		yytmGbnInfo.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.Dataset[0].Rows.Row[0].Col[0].Data))

	req, err = http.NewRequest("POST", "https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findStayAplyList.do?menuId=MPB0022&pgmId=PPB0021", bytes.NewBuffer(findLiveStuNoXML))
	if err != nil {
		panic(err)
	}

	res, err = client.Do(req)
	if err != nil {
		panic(err)
	}
	body, _ := ioutil.ReadAll(res.Body)
	var temp xmls.Root
	xml.Unmarshal(body, &temp)

	responseBody := make(map[string]interface{})
	responseBody["name"] = studentInfo.Dataset[0].Rows.Row[0].Col[0].Data
	responseBody["yy"] = yytmGbnInfo.Dataset[0].Rows.Row[0].Col[0].Data
	responseBody["tmGbn"] = yytmGbnInfo.Dataset[0].Rows.Row[0].Col[1].Data

	cookies := make(map[string]string)

	outStayFrDt := make([]string, len(temp.Dataset[1].Rows.Row))
	outStayToDt := make([]string, len(temp.Dataset[1].Rows.Row))
	outStayStGbn := make([]string, len(temp.Dataset[1].Rows.Row))

	var wg sync.WaitGroup
	wg.Add(len(temp.Dataset[1].Rows.Row) + 3)

	go func() {
		for i, v := range temp.Dataset[1].Rows.Row[:len(temp.Dataset[1].Rows.Row)/2] {
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
		for i, v := range temp.Dataset[1].Rows.Row[len(temp.Dataset[1].Rows.Row)/2:] {
			i += len(temp.Dataset[1].Rows.Row) / 2
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
	fmt.Println(string(responseJson))
	return response, nil
}
