package route

import (
	"auto_overnight_api/custom_err"
	"auto_overnight_api/functions"
	"auto_overnight_api/model"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"net/http"
	"net/http/cookiejar"
)

// FindStayOutList 외박 신청 내역 조회하여 return
func FindStayOutList(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// 외박 신청 내역 조회에 필요한 것들 파싱
	var requestsModel model.FindRequest
	err := json.Unmarshal([]byte(request.Body), &requestsModel)
	if err != nil {
		return custom_err.MakeErrorResponse(custom_err.ParsingJsonBodyErr, 500)
	}

	// cookie jar 생성
	jar, err := cookiejar.New(nil)
	if err != nil {
		return custom_err.MakeErrorResponse(custom_err.MakeCookieJarErr, 500)
	}

	// cookie jar에 세션 설정
	functions.MakeCookieJar(requestsModel.Cookies, jar)

	// client에 cookie jar 설정
	client := &http.Client{
		Jar: jar,
	}

	// 학생 이름, 학번 찾기 위한 채널 생성
	findUserNmChan := make(chan model.ResponseModel)

	// 파싱 시작
	go functions.RequestFindUserNm(client, findUserNmChan)

	studentInfo := <-findUserNmChan

	if err != nil {
		return custom_err.MakeErrorResponse(err, 500)
	}

	if studentInfo.XML.Parameters.Parameter == "-600" {
		return custom_err.MakeErrorResponse(custom_err.WrongCookieErr, 400)
	}

	// 외박 신청 내역 조회
	stayOutList := functions.RequestFindStayOutList(
		client,
		requestsModel.Year,
		requestsModel.TmGbn,
		studentInfo.XML.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data,
	)

	// 응답 위한 json body 만들기
	responseBody := make(map[string]interface{})

	// 파싱 시작
	sm := functions.ParsingStayoutList(stayOutList.XML)

	responseBody["outStayFrDt"] = sm.OutStayFrDt
	responseBody["outStayToDt"] = sm.OutStayToDt
	responseBody["outStayStGbn"] = sm.OutStayStGbn

	// 응답 json 만들기
	responseJson, err := json.Marshal(responseBody)
	if err != nil {
		return custom_err.MakeErrorResponse(custom_err.MakeJsonBodyErr, 500)
	}
	response := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseJson),
	}
	return response, nil
}
