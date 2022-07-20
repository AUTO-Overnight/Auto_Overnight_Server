package models

import (
	"net/http"
)

// ParsingStayoutList 외박 신청 내역 파싱하는 함수
func ParsingStayoutList(stayOutList Root) ([]string, []string, []string) {

	// 외박 신청 내역 파싱 내역 저장 위한 슬라이스 생성
	outStayFrDt := make([]string, len(stayOutList.Dataset[1].Rows.Row))
	outStayToDt := make([]string, len(stayOutList.Dataset[1].Rows.Row))
	outStayStGbn := make([]string, len(stayOutList.Dataset[1].Rows.Row))

	// 파싱 시작
	for i, v := range stayOutList.Dataset[1].Rows.Row {
		outStayFrDt[i] = v.Col[2].Data
		outStayToDt[i] = v.Col[1].Data
		outStayStGbn[i] = v.Col[5].Data
	}

	return outStayFrDt, outStayToDt, outStayStGbn
}

// ParsingCookies 쿠키 파싱하는 함수
func ParsingCookies(req *http.Request) map[string]string {
	// 쿠키 파싱 위한 슬라이스 생성
	cookies := make(map[string]string)

	// 파싱 시작
	for _, info := range req.Cookies() {
		cookies[info.Name] = info.Value
	}

	return cookies
}

// ParsingPointList 상벌점 내역 파싱하는 함수
func ParsingPointList(pointList Root) ([]string, []string, []string, []string) {

	// 상벌점 내역 파싱 위한 슬라이스 생성
	cmpScr := make([]string, len(pointList.Dataset[0].Rows.Row))
	lifSstArdGbn := make([]string, len(pointList.Dataset[0].Rows.Row))
	ardInptDt := make([]string, len(pointList.Dataset[0].Rows.Row))
	lifSstArdCtnt := make([]string, len(pointList.Dataset[0].Rows.Row))

	// 파싱 시작
	for i, v := range pointList.Dataset[0].Rows.Row {
		cmpScr[i] = v.Col[4].Data
		lifSstArdGbn[i] = v.Col[8].Data
		ardInptDt[i] = v.Col[10].Data
		lifSstArdCtnt[i] = v.Col[2].Data
	}

	return cmpScr, lifSstArdGbn, ardInptDt, lifSstArdCtnt
}
