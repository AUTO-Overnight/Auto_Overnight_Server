package functions

import (
	"auto_overnight_api/custom_err"
	"auto_overnight_api/model"
	"bytes"
	"encoding/xml"
	"io/ioutil"
	"net/http"
)

// RequestFindYYtmgbn 해당 년도, 학기를 요청하여 가져오는 함수
func RequestFindYYtmgbn(client *http.Client) model.ResponseModel {

	// 채널로 보낼 응답용 구조체 생성
	var response model.ResponseModel

	// http request 생성
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findYyTmGbnList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(model.FindYYtmgbnXML))
	if err != nil {
		response.Error = custom_err.MakeHttpRequestErr
		return response
	}

	// http request 보내기
	res, err := client.Do(req)
	if err != nil {
		response.Error = custom_err.SendHttpRequestErr
		return response
	}

	// body 읽어서 구조체 저장
	body, _ := ioutil.ReadAll(res.Body)
	var yytmGbnInfo model.Root
	err = xml.Unmarshal(body, &yytmGbnInfo)

	if err != nil {
		response.Error = custom_err.ParsingXMLBodyErr
		return response
	}

	response.XML = yytmGbnInfo
	return response
}

// RequestFindUserNm 학생의 이름, 학번을 요청하여 가져오는 함수
func RequestFindUserNm(client *http.Client) model.ResponseModel {

	// 채널로 보낼 응답용 구조체 생성
	var response model.ResponseModel

	// http request 생성
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/com/SsoCtr/findMyGLIOList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(model.FindUserNmXML))
	if err != nil {
		response.Error = custom_err.MakeHttpRequestErr
		return response
	}

	// http request 보내기
	res, err := client.Do(req)
	if err != nil {
		response.Error = custom_err.SendHttpRequestErr
		return response
	}

	// body 읽어서 구조체 저장
	body, _ := ioutil.ReadAll(res.Body)
	var studentInfo model.Root
	err = xml.Unmarshal(body, &studentInfo)

	if err != nil {
		response.Error = custom_err.ParsingXMLBodyErr
		return response
	}

	response.XML = studentInfo
	return response
}

// RequestFindStayOutList 외박 신청 내역을 요청하여 가지고 오는 함수
func RequestFindStayOutList(client *http.Client, info model.RequestInfo) model.ResponseModel {

	// 요청 위한 XML 만들기
	findLiveStuNoXML := model.MakefindLiveStuNoXML(info.YY, info.TmGbn, info.SchregNo, info.StdKorNm)

	// 응답 저장 위한 구조체
	var temp model.ResponseModel

	// 외박 신청 내역 조회를 위한 http request 만들기
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findStayAplyList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(findLiveStuNoXML))
	if err != nil {
		temp.Error = custom_err.MakeHttpRequestErr
		return temp
	}

	// http request 보내기
	res, err := client.Do(req)
	if err != nil {
		temp.Error = custom_err.SendHttpRequestErr
		return temp
	}

	// body 읽어서 구조체에 저장
	body, _ := ioutil.ReadAll(res.Body)
	err = xml.Unmarshal(body, &temp.XML)
	if err != nil {
		temp.Error = custom_err.ParsingXMLBodyErr
		return temp
	}

	temp.Req = req
	temp.Error = nil
	return temp
}

// RequestFindPointList 상벌점 내역을 요청하여 가지고 오는 함수
func RequestFindPointList(client *http.Client, info model.RequestInfo) model.ResponseModel {

	// 요청 위한 XML 만들기
	findPointListXML := model.MakefindLiveStuNoXML(info.YY, info.TmGbn, info.SchregNo, info.StdKorNm)

	// 응답 저장 위한 구조체
	var temp model.ResponseModel

	// 상벌점 내역 조회를 위한 http request 만들기
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findFindArdListList.do?menuId=MPB0024&pgmId=PPB0023",
		bytes.NewBuffer(findPointListXML))
	if err != nil {
		temp.Error = custom_err.MakeHttpRequestErr
		return temp
	}

	// http request 보내기
	res, err := client.Do(req)
	if err != nil {
		temp.Error = custom_err.SendHttpRequestErr
		return temp
	}

	// body 읽어서 구조체에 저장
	body, _ := ioutil.ReadAll(res.Body)
	err = xml.Unmarshal(body, &temp.XML)
	if err != nil {
		temp.Error = custom_err.ParsingXMLBodyErr
		return temp
	}

	temp.Error = nil
	return temp
}

// RequestSendStayOut 외박 신청하는 함수
func RequestSendStayOut(client *http.Client, info model.RequestInfo, m model.SendRequest) error {

	// LiveStuNo 찾기 위한 XML 만들기
	findLiveStuNoXML := model.MakefindLiveStuNoXML(info.YY, info.TmGbn, info.SchregNo, info.StdKorNm)

	// LiveStuNo 찾기 위한 http request 만들기
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findMdstrmLeaveAplyList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(findLiveStuNoXML))
	if err != nil {
		return custom_err.MakeHttpRequestErr
	}

	// http request 보내기
	res, err := client.Do(req)
	if err != nil {
		return custom_err.SendHttpRequestErr
	}

	// body 읽어서 구조체에 저장
	body, _ := ioutil.ReadAll(res.Body)
	var liveStuNo model.Root
	err = xml.Unmarshal(body, &liveStuNo)
	if err != nil {
		return custom_err.ParsingXMLBodyErr
	}

	// LiveStuNo 찾기
	var LiveStuNo string

	for _, col := range liveStuNo.Dataset[0].Rows.Row[0].Col {
		if col.Id == "livstuNo" {
			LiveStuNo = col.Data
		}
	}

	// 요청한 날짜만큼 외박 신청 보내기
	var outStayGbn string
	for i := 0; i < len(m.DateList); i++ {
		if m.IsWeekend[i] == 0 {
			// 평일
			outStayGbn = "07"
		} else {
			// 주말
			outStayGbn = "04"
		}

		err = send(
			model.MakeSendStayOutXML(
				info.YY,
				info.TmGbn,
				LiveStuNo,
				outStayGbn,
				m.DateList[i],
				m.DateList[i],
				m.OutStayAplyDt,
			),
			client,
		)

		if err != nil {
			return err
		}
	}

	return nil
}

// send 외박 신청 http request 함수
func send(sendStayOutXML []byte, client *http.Client) error {

	// 외박 신청 위한 http request 만들기
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/saveOutAplyList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(sendStayOutXML))
	if err != nil {
		return custom_err.MakeHttpRequestErr
	}

	// http request 보내기
	_, err = client.Do(req)
	if err != nil {
		return custom_err.SendHttpRequestErr
	}

	return nil
}
