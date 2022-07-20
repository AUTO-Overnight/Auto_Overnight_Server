package models

import (
	"auto_overnight_api/error_response"
	"bytes"
	"encoding/xml"
	"io/ioutil"
	"net/http"
)

// RequestFindYYtmgbn 해당 년도, 학기를 요청하여 가져오는 함수
func RequestFindYYtmgbn(client *http.Client, findYYtmgbnChan chan FindYYtmgbnModel, cookies map[string]string) {

	// 채널로 보낼 응답용 구조체 생성
	var response FindYYtmgbnModel

	// http request 생성
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findYyTmGbnList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(FindYYtmgbnXML))
	if err != nil {
		response.Error = error_response.MakeHttpRequestError
		findYYtmgbnChan <- response
	}

	// 입력 받은 쿠키가 존재한다면 설정하기
	if cookies != nil {
		req.AddCookie(&http.Cookie{Name: "_SSO_Global_Logout_url", Value: cookies["_SSO_Global_Logout_url"]})
		req.AddCookie(&http.Cookie{Name: "kalogin", Value: cookies["kalogin"]})
		req.AddCookie(&http.Cookie{Name: "JSVSESSIONID", Value: cookies["JSVSESSIONID"]})
	}

	// http request 보내기
	res, err := client.Do(req)
	if err != nil {
		response.Error = error_response.SendHttpRequestError
		findYYtmgbnChan <- response
	}

	// body 읽어서 구조체 저장
	body, _ := ioutil.ReadAll(res.Body)
	var yytmGbnInfo Root
	err = xml.Unmarshal(body, &yytmGbnInfo)

	if err != nil {
		response.Error = error_response.ParsingXMLBodyError
		findYYtmgbnChan <- response
	}

	response.XML = yytmGbnInfo
	findYYtmgbnChan <- response
}

// RequestFindUserNm 학생의 이름, 학번을 요청하여 가져오는 함수
func RequestFindUserNm(client *http.Client, findUserNmChan chan FindUserNmModel, cookies map[string]string) {

	// 채널로 보낼 응답용 구조체 생성
	var response FindUserNmModel

	// http request 생성
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/com/SsoCtr/findMyGLIOList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(FindUserNmXML))
	if err != nil {
		response.Error = error_response.MakeHttpRequestError
		findUserNmChan <- response
	}

	// 입력 받은 쿠키가 존재한다면 설정하기
	if cookies != nil {
		req.AddCookie(&http.Cookie{Name: "_SSO_Global_Logout_url", Value: cookies["_SSO_Global_Logout_url"]})
		req.AddCookie(&http.Cookie{Name: "kalogin", Value: cookies["kalogin"]})
		req.AddCookie(&http.Cookie{Name: "JSVSESSIONID", Value: cookies["JSVSESSIONID"]})
	}

	// http request 보내기
	res, err := client.Do(req)
	if err != nil {
		response.Error = error_response.SendHttpRequestError
		findUserNmChan <- response
	}

	// body 읽어서 구조체 저장
	body, _ := ioutil.ReadAll(res.Body)
	var studentInfo Root
	err = xml.Unmarshal(body, &studentInfo)

	if err != nil {
		response.Error = error_response.ParsingXMLBodyError
		findUserNmChan <- response
	}

	response.XML = studentInfo
	findUserNmChan <- response
}

// RequestFindStayOutList 외박 신청 내역을 요청하여 가지고 오는 함수
func RequestFindStayOutList(client *http.Client,
	yy, tmGbn, schregNo, stdKorNm string,
	cookies map[string]string) (Root, *http.Request, error) {

	// 요청 위한 XML 만들기
	findLiveStuNoXML := MakefindLiveStuNoXML(yy, tmGbn, schregNo, stdKorNm)

	// 응답 XML 저장 위한 구조체
	var temp Root

	// 외박 신청 내역 조회를 위한 http request 만들기
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findStayAplyList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(findLiveStuNoXML))
	if err != nil {
		return temp, nil, error_response.MakeHttpRequestError
	}

	// 입력 받은 쿠키가 존재한다면 설정하기
	if cookies != nil {
		req.AddCookie(&http.Cookie{Name: "_SSO_Global_Logout_url", Value: cookies["_SSO_Global_Logout_url"]})
		req.AddCookie(&http.Cookie{Name: "kalogin", Value: cookies["kalogin"]})
		req.AddCookie(&http.Cookie{Name: "JSVSESSIONID", Value: cookies["JSVSESSIONID"]})
	}

	// http request 보내기
	res, err := client.Do(req)
	if err != nil {
		return temp, nil, error_response.SendHttpRequestError
	}

	// body 읽어서 구조체에 저장
	body, _ := ioutil.ReadAll(res.Body)
	err = xml.Unmarshal(body, &temp)
	if err != nil {
		return temp, nil, error_response.ParsingXMLBodyError
	}

	// req -> 쿠키 조회를 위해 return
	return temp, req, nil
}

// RequestFindPointList 상벌점 내역을 요청하여 가지고 오는 함수
func RequestFindPointList(client *http.Client,
	yy, tmGbn, schregNo, stdKorNm string, cookies map[string]string) (Root, error) {

	// 요청 위한 XML 만들기
	findPointListXML := MakefindLiveStuNoXML(yy, tmGbn, schregNo, stdKorNm)

	// 응답 XML 저장 위한 구조체
	var temp Root

	// 상벌점 내역 조회를 위한 http request 만들기
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findFindArdListList.do?menuId=MPB0024&pgmId=PPB0023",
		bytes.NewBuffer(findPointListXML))
	if err != nil {
		return temp, error_response.MakeHttpRequestError
	}

	// 입력 받은 쿠키가 존재한다면 설정하기
	if cookies != nil {
		req.AddCookie(&http.Cookie{Name: "_SSO_Global_Logout_url", Value: cookies["_SSO_Global_Logout_url"]})
		req.AddCookie(&http.Cookie{Name: "kalogin", Value: cookies["kalogin"]})
		req.AddCookie(&http.Cookie{Name: "JSVSESSIONID", Value: cookies["JSVSESSIONID"]})
	}

	// http request 보내기
	res, err := client.Do(req)
	if err != nil {
		return temp, error_response.SendHttpRequestError
	}

	// body 읽어서 구조체에 저장
	body, _ := ioutil.ReadAll(res.Body)
	err = xml.Unmarshal(body, &temp)
	if err != nil {
		return temp, error_response.ParsingXMLBodyError
	}

	return temp, nil
}

// RequestSendStayOut 외박 신청하는 함수
func RequestSendStayOut(client *http.Client, studentInfo, yytmGbnInfo Root,
	DateList []string, IsWeekend []int, OutStayAplyDt string, cookies map[string]string) error {

	// LiveStuNo 찾기 위한 XML 만들기
	findLiveStuNoXML := MakefindLiveStuNoXML(
		yytmGbnInfo.Dataset[0].Rows.Row[0].Col[0].Data,
		yytmGbnInfo.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.Dataset[0].Rows.Row[0].Col[0].Data,
	)

	// LiveStuNo 찾기 위한 http request 만들기
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findMdstrmLeaveAplyList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(findLiveStuNoXML))
	if err != nil {
		return error_response.MakeHttpRequestError
	}

	// 입력 받은 쿠키가 존재한다면 설정하기
	if cookies != nil {
		req.AddCookie(&http.Cookie{Name: "_SSO_Global_Logout_url", Value: cookies["_SSO_Global_Logout_url"]})
		req.AddCookie(&http.Cookie{Name: "kalogin", Value: cookies["kalogin"]})
		req.AddCookie(&http.Cookie{Name: "JSVSESSIONID", Value: cookies["JSVSESSIONID"]})
	}

	// http request 보내기
	res, err := client.Do(req)
	if err != nil {
		return error_response.SendHttpRequestError
	}

	// body 읽어서 구조체에 저장
	body, _ := ioutil.ReadAll(res.Body)
	var liveStuNo Root
	err = xml.Unmarshal(body, &liveStuNo)
	if err != nil {
		return error_response.ParsingXMLBodyError
	}

	// 요청한 날짜만큼 외박 신청 보내기
	var outStayGbn string
	for i := 0; i < len(DateList); i++ {
		if IsWeekend[i] == 0 {
			// 평일
			outStayGbn = "07"
		} else {
			// 주말
			outStayGbn = "04"
		}

		err = send(
			MakeSendStayOutXML(
				yytmGbnInfo.Dataset[0].Rows.Row[0].Col[0].Data,
				yytmGbnInfo.Dataset[0].Rows.Row[0].Col[1].Data,
				liveStuNo.Dataset[0].Rows.Row[0].Col[12].Data,
				outStayGbn,
				DateList[i],
				DateList[i],
				OutStayAplyDt,
			),
			client,
			cookies,
		)

		if err != nil {
			return err
		}
	}

	return nil
}

// send 외박 신청 http request 함수
func send(sendStayOutXML []byte, client *http.Client, cookies map[string]string) error {
	// 외박 신청 위한 http request 만들기
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/saveOutAplyList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(sendStayOutXML))
	if err != nil {
		return error_response.MakeHttpRequestError
	}

	// 입력 받은 쿠키가 존재한다면 설정하기
	if cookies != nil {
		req.AddCookie(&http.Cookie{Name: "_SSO_Global_Logout_url", Value: cookies["_SSO_Global_Logout_url"]})
		req.AddCookie(&http.Cookie{Name: "kalogin", Value: cookies["kalogin"]})
		req.AddCookie(&http.Cookie{Name: "JSVSESSIONID", Value: cookies["JSVSESSIONID"]})
	}

	// http request 보내기
	_, err = client.Do(req)
	if err != nil {
		return error_response.SendHttpRequestError
	}

	return nil
}
