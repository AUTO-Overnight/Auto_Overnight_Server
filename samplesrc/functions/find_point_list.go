package functions

import (
	"auto_overnight_api/xmls"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"net/http"
	"net/http/cookiejar"
)

func FindPointList(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
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

	go xmls.RequestFindUserNm(client, findUserNmChan, requestsModel.Cookies)

	studentInfo := <-findUserNmChan

	pointList := xmls.RequestFindPointList(
		client,
		requestsModel.Year,
		requestsModel.TmGbn,
		studentInfo.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.Dataset[0].Rows.Row[0].Col[0].Data,
		requestsModel.Cookies)

	responseBody := make(map[string]interface{})

	cmpScr := make([]string, len(pointList.Dataset[0].Rows.Row))
	lifSstArdGbn := make([]string, len(pointList.Dataset[0].Rows.Row))
	ardInptDt := make([]string, len(pointList.Dataset[0].Rows.Row))
	lifSstArdCtnt := make([]string, len(pointList.Dataset[0].Rows.Row))

	for i, v := range pointList.Dataset[0].Rows.Row {
		cmpScr[i] = v.Col[4].Data
		lifSstArdGbn[i] = v.Col[8].Data
		ardInptDt[i] = v.Col[10].Data
		lifSstArdCtnt[i] = v.Col[2].Data
	}

	responseBody["cmpScr"] = cmpScr
	responseBody["lifSstArdGbn"] = lifSstArdGbn
	responseBody["ardInptDt"] = ardInptDt
	responseBody["lifSstArdCtnt"] = lifSstArdCtnt

	responseJson, _ := json.Marshal(responseBody)
	response := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseJson),
	}

	return response, nil
}
