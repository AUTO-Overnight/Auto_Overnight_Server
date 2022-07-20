package functions

import (
	"auto_overnight_api/error_response"
	"auto_overnight_api/models"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"net/http"
	"net/http/cookiejar"
)

// SendStayOut 날짜를 입력받아 외박 신청하고 외박 신청 내역을 조회하여 return
func SendStayOut(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// 외박 신청에 필요한 것들 파싱
	var requestsModel models.SendRequestModel
	err := json.Unmarshal([]byte(request.Body), &requestsModel)

	if err != nil {
		return error_response.MakeErrorResponse(error_response.ParsingJsonBodyError, 500)
	}

	// cookie jar 생성
	jar, err := cookiejar.New(nil)
	if err != nil {
		return error_response.MakeErrorResponse(error_response.MakeCookieJarError, 500)
	}

	// client에 cookie jar 설정
	client := &http.Client{
		Jar: jar,
	}

	// 학생 이름, 학번, 년도, 학기 찾기 위한 채널 생성
	findUserNmChan := make(chan models.FindUserNmModel)
	findYYtmgbnChan := make(chan models.FindYYtmgbnModel)

	// 파싱 시작
	go models.RequestFindUserNm(client, findUserNmChan, requestsModel.Cookies)
	go models.RequestFindYYtmgbn(client, findYYtmgbnChan, requestsModel.Cookies)

	studentInfo := <-findUserNmChan
	yytmGbnInfo := <-findYYtmgbnChan

	if studentInfo.Error != nil || yytmGbnInfo.Error != nil {
		return error_response.MakeErrorResponse(err, 500)
	}

	if studentInfo.XML.Parameters.Parameter == "-600" {
		return error_response.MakeErrorResponse(error_response.WrongIdOrPasswordError, 400)
	}

	// 외박 신청 보내기
	err = models.RequestSendStayOut(
		client,
		studentInfo.XML,
		yytmGbnInfo.XML,
		requestsModel.DateList,
		requestsModel.IsWeekend,
		requestsModel.OutStayAplyDt,
		requestsModel.Cookies)
	if err != nil {
		return error_response.MakeErrorResponse(err, 500)
	}

	// 외박 신청 내역 조회
	stayOutList, _, err := models.RequestFindStayOutList(
		client,
		yytmGbnInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data,
		yytmGbnInfo.XML.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.XML.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data,
		requestsModel.Cookies)

	// 응답 위한 json body 만들기
	responseBody := make(map[string]interface{})

	// 파싱 시작
	outStayFrDt, outStayToDt, outStayStGbn := models.ParsingStayoutList(stayOutList)

	responseBody["outStayFrDt"] = outStayFrDt
	responseBody["outStayToDt"] = outStayToDt
	responseBody["outStayStGbn"] = outStayStGbn

	// 응답 json 만들기
	responseJson, err := json.Marshal(responseBody)
	if err != nil {
		return error_response.MakeErrorResponse(error_response.MakeJsonBodyError, 500)
	}
	response := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseJson),
	}
	return response, nil
}
