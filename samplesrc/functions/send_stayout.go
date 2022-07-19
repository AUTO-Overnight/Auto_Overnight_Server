package functions

import (
	"auto_overnight_api/xmls"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"net/http"
	"net/http/cookiejar"
)

func SendStayOut(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var requestsModel SendRequestModel
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

	err = xmls.RequestSendStayOut(
		client,
		studentInfo,
		yytmGbnInfo,
		requestsModel.DateList,
		requestsModel.IsWeekend,
		requestsModel.OutStayAplyDt,
		requestsModel.Cookies)
	if err != nil {
		panic(err)
	}
	return events.APIGatewayProxyResponse{StatusCode: 201}, nil
}
