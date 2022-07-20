package functions

import (
	"auto_overnight_api/error_response"
	"auto_overnight_api/models"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"net/http"
	"net/http/cookiejar"
)

// FindPointList 상벌점 내역 조회하여 return
func FindPointList(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// 상벌점 내역 조회에 필요한 것들 파싱
	var requestsModel models.FindRequestModel
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

	// 학생 이름, 학번 찾기 위한 채널 생성
	findUserNmChan := make(chan models.FindUserNmModel)

	// 파싱 시작
	go models.RequestFindUserNm(client, findUserNmChan, requestsModel.Cookies)

	studentInfo := <-findUserNmChan

	if studentInfo.Error != nil {
		return error_response.MakeErrorResponse(err, 500)
	}

	if studentInfo.XML.Parameters.Parameter == "-600" {
		return error_response.MakeErrorResponse(error_response.WrongCookieError, 400)
	}

	// 상벌점 내역 조회
	pointList, err := models.RequestFindPointList(
		client,
		requestsModel.Year,
		requestsModel.TmGbn,
		studentInfo.XML.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data,
		requestsModel.Cookies)
	if err != nil {
		return error_response.MakeErrorResponse(err, 500)
	}

	// 응답 위한 json body 만들기
	responseBody := make(map[string]interface{})

	// 외박 신청 내역 파싱 내역 전달받기 위한 채널 생성
	cmpScrChan := make(chan []string)
	lifSstArdGbnChan := make(chan []string)
	ardInptDtChan := make(chan []string)
	lifSstArdCtntChan := make(chan []string)

	// 파싱 시작
	go models.ParsingPointList(pointList, cmpScrChan, lifSstArdGbnChan, ardInptDtChan, lifSstArdCtntChan)

	responseBody["cmpScr"] = <-cmpScrChan
	responseBody["lifSstArdGbn"] = <-lifSstArdGbnChan
	responseBody["ardInptDt"] = <-ardInptDtChan
	responseBody["lifSstArdCtnt"] = <-lifSstArdCtntChan

	// 응답 json 만들기
	responseJson, _ := json.Marshal(responseBody)
	response := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseJson),
	}

	return response, nil
}
