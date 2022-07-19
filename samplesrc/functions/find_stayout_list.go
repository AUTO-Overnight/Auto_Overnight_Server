package functions

import (
	"auto_overnight_api/xmls"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"net/http"
	"net/http/cookiejar"
	"sync"
)

func FindStayOutList(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var requestsModel FindRequestModel
	err := json.Unmarshal([]byte(request.Body), &requestsModel)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	jar, err := cookiejar.New(nil)
	if err != nil {
		panic(err)
	}

	client := &http.Client{
		Jar: jar,
	}

	findUserNmChan := make(chan xmls.Root)
	findYYtmgbnChan := make(chan xmls.Root)

	go xmls.RequestFindUserNm(client, findUserNmChan, requestsModel.Cookies)
	go xmls.RequestFindYYtmgbn(client, findYYtmgbnChan, requestsModel.Cookies)

	studentInfo := <-findUserNmChan
	yytmGbnInfo := <-findYYtmgbnChan

	stayOutList := xmls.RequestFindStayOutList(client, studentInfo, yytmGbnInfo, requestsModel.Cookies)

	responseBody := make(map[string]interface{})

	outStayFrDt := make([]string, len(stayOutList.Dataset[1].Rows.Row))
	outStayToDt := make([]string, len(stayOutList.Dataset[1].Rows.Row))
	outStayStGbn := make([]string, len(stayOutList.Dataset[1].Rows.Row))

	var wg sync.WaitGroup
	wg.Add(len(stayOutList.Dataset[1].Rows.Row))

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
	wg.Wait()

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
