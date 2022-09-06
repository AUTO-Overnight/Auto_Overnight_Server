package route

import (
	"auto_overnight_api/custom_err"
	"auto_overnight_api/functions"
	"auto_overnight_api/model"
	"bytes"
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"net/http"
	"net/http/cookiejar"
	"net/url"
)

// Login Id와 Password를 Json으로 입력 받아 로그인하고 이름, 년도, 학기, 쿠키, 외박 신청 내역을 return
func Login(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// Id, Password 파싱
	var requestsModel model.LoginRequest
	err := json.Unmarshal([]byte(request.Body), &requestsModel)

	if err != nil {
		return custom_err.MakeErrorResponse(custom_err.ParsingJsonBodyErr, 500)
	}
	if requestsModel.Id == "" || requestsModel.PassWord == "" {
		return custom_err.MakeErrorResponse(custom_err.EmptyIdOrPasswordErr, 400)
	}

	// PassWord URIDecode
	decodeValue, err := url.QueryUnescape(requestsModel.PassWord)
	if err != nil {
		return custom_err.MakeErrorResponse(custom_err.ParsingJsonBodyErr, 500)
	}

	// x-www-form-urlencoded 방식으로 로그인 하기 위해 form 생성
	loginInfo := url.Values{
		"internalId": {requestsModel.Id},
		"internalPw": {decodeValue},
		"gubun":      {"inter"},
	}

	// cookie jar 생성
	jar, err := cookiejar.New(nil)
	if err != nil {
		return custom_err.MakeErrorResponse(custom_err.MakeCookieJarErr, 500)
	}

	// 로그인 http request 생성
	req, err := http.NewRequest("POST", "https://ksc.tukorea.ac.kr/sso/login_proc.jsp?returnurl=null", bytes.NewBufferString(loginInfo.Encode()))
	if err != nil {
		return custom_err.MakeErrorResponse(custom_err.MakeHttpRequestErr, 500)
	}

	// Content-Type 헤더 설정, client에 cookie jar 설정
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	client := &http.Client{
		Jar: jar,
	}
	// 로그인 시도
	res, err := client.Do(req)
	if err != nil {
		return custom_err.MakeErrorResponse(custom_err.SendHttpRequestErr, 500)
	}

	defer res.Body.Close()

	// 통합 정보 시스템 세션 얻기 시도
	req, err = http.NewRequest("GET", "https://dream.tukorea.ac.kr/com/SsoCtr/initPageWork.do?loginGbn=sso&loginPersNo=", nil)

	if err != nil {
		return custom_err.MakeErrorResponse(custom_err.MakeHttpRequestErr, 500)
	}

	res, err = client.Do(req)
	if err != nil {
		return custom_err.MakeErrorResponse(custom_err.SendHttpRequestErr, 500)
	}

	// 학생 이름, 학번, 년도, 학기 찾기 위한 채널 생성
	findUserNmChan := make(chan model.ResponseModel)
	findYYtmgbnChan := make(chan model.ResponseModel)

	// 파싱 시작
	go functions.RequestFindUserNm(client, findUserNmChan)
	go functions.RequestFindYYtmgbn(client, findYYtmgbnChan)

	studentInfo := <-findUserNmChan
	yytmGbnInfo := <-findYYtmgbnChan

	if studentInfo.Error != nil || yytmGbnInfo.Error != nil {
		return custom_err.MakeErrorResponse(err, 500)
	}

	if studentInfo.XML.Parameters.Parameter == "-600" {
		return custom_err.MakeErrorResponse(custom_err.WrongIdOrPasswordErr, 400)
	}

	// 외박 신청 내역 조회
	stayOutList := functions.RequestFindStayOutList(
		client,
		yytmGbnInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data,
		yytmGbnInfo.XML.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.XML.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data,
	)

	if stayOutList.Error != nil {
		return custom_err.MakeErrorResponse(err, 500)
	}

	// 응답 위한 json body 선언
	responseBody := make(map[string]interface{})

	// 이름, 년도, 학기 저장
	responseBody["name"] = studentInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data
	responseBody["yy"] = yytmGbnInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data
	responseBody["tmGbn"] = yytmGbnInfo.XML.Dataset[0].Rows.Row[0].Col[1].Data

	// 파싱 시작
	sm := functions.ParsingStayoutList(stayOutList.XML)
	cookie := functions.ParsingCookies(client)

	responseBody["cookies"] = cookie
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
