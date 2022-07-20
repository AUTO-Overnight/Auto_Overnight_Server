package functions

import (
	"auto_overnight_api/error_response"
	"auto_overnight_api/model"
	"auto_overnight_api/xmls"
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
	var requestsModel model.LoginRequestModel
	err := json.Unmarshal([]byte(request.Body), &requestsModel)

	if err != nil {
		return error_response.MakeErrorResponse(error_response.ParsingJsonBodyError, 500)
	}
	if requestsModel.Id == "" || requestsModel.PassWord == "" {
		return error_response.MakeErrorResponse(error_response.EmptyIdOrPasswordError, 400)
	}

	// x-www-form-urlencoded 방식으로 로그인 하기 위해 form 생성
	loginInfo := url.Values{
		"internalId": {requestsModel.Id},
		"internalPw": {requestsModel.PassWord},
		"gubun":      {"inter"},
	}

	// cookie jar 생성
	jar, err := cookiejar.New(nil)
	if err != nil {
		return error_response.MakeErrorResponse(error_response.MakeCookieJarError, 500)
	}

	// 로그인 http request 생성
	req, err := http.NewRequest("POST", "https://ksc.tukorea.ac.kr/sso/login_proc.jsp?returnurl=null", bytes.NewBufferString(loginInfo.Encode()))
	if err != nil {
		return error_response.MakeErrorResponse(error_response.MakeHttpRequestError, 500)
	}

	// Content-Type 헤더 설정, client에 cookie jar 설정
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	client := &http.Client{
		Jar: jar,
	}
	// 로그인 시도
	res, err := client.Do(req)
	if err != nil {
		return error_response.MakeErrorResponse(error_response.SendHttpRequestError, 500)
	}

	defer res.Body.Close()

	// 통합 정보 시스템 세션 얻기 시도
	req, err = http.NewRequest("GET", "https://dream.tukorea.ac.kr/com/SsoCtr/initPageWork.do?loginGbn=sso&loginPersNo=", nil)

	if err != nil {
		return error_response.MakeErrorResponse(error_response.MakeHttpRequestError, 500)
	}

	res, err = client.Do(req)
	if err != nil {
		return error_response.MakeErrorResponse(error_response.SendHttpRequestError, 500)
	}

	// 학생 이름, 학번, 년도, 학기 찾기 위한 채널 생성
	findUserNmChan := make(chan model.FindUserNmModel)
	findYYtmgbnChan := make(chan model.FindYYtmgbnModel)

	// 파싱 시작
	go xmls.RequestFindUserNm(client, findUserNmChan, nil)
	go xmls.RequestFindYYtmgbn(client, findYYtmgbnChan, nil)

	studentInfo := <-findUserNmChan
	yytmGbnInfo := <-findYYtmgbnChan

	if studentInfo.Error != nil || yytmGbnInfo.Error != nil {
		return error_response.MakeErrorResponse(err, 500)
	}

	if studentInfo.XML.Parameters.Parameter == "-600" {
		return error_response.MakeErrorResponse(error_response.WrongIdOrPasswordError, 400)
	}

	// 외박 신청 내역 조회
	stayOutList, req, err := xmls.RequestFindStayOutList(
		client,
		yytmGbnInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data,
		yytmGbnInfo.XML.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.XML.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data,
		nil)

	if err != nil {
		return error_response.MakeErrorResponse(err, 500)
	}

	// 응답 위한 json body 만들기
	responseBody := make(map[string]interface{})

	// 이름, 년도, 학기 저장
	responseBody["name"] = studentInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data
	responseBody["yy"] = yytmGbnInfo.XML.Dataset[0].Rows.Row[0].Col[0].Data
	responseBody["tmGbn"] = yytmGbnInfo.XML.Dataset[0].Rows.Row[0].Col[1].Data

	// 쿠키, 외박 신청 내역 파싱 내역 전달받기 위한 채널 생성
	cookiesChan := make(chan map[string]string)
	outStayFrDtChan := make(chan []string)
	outStayToDtChan := make(chan []string)
	outStayStGbnChan := make(chan []string)

	// 파싱 시작
	go xmls.ParsingStayoutList(stayOutList, outStayFrDtChan, outStayToDtChan, outStayStGbnChan)
	go xmls.ParsingCookies(req, cookiesChan)

	responseBody["cookies"] = <-cookiesChan
	responseBody["outStayFrDt"] = <-outStayFrDtChan
	responseBody["outStayToDt"] = <-outStayToDtChan
	responseBody["outStayStGbn"] = <-outStayStGbnChan

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
