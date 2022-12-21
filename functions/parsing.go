package functions

import (
	"auto_overnight_api/config"
	"auto_overnight_api/model"
	"net/http"
	"net/http/cookiejar"
	"net/url"
)

// ParsingStayoutList 외박 신청 내역 파싱하는 함수
func ParsingStayoutList(stayOutList model.ResponseModel) model.StayOutList {
	// 모델 생성
	var m model.StayOutList
	// 외박 신청 내역 파싱 내역 저장 위한 슬라이스 생성
	m.OutStayFrDt = make([]string, len(stayOutList.XML.Dataset[1].Rows.Row))
	m.OutStayToDt = make([]string, len(stayOutList.XML.Dataset[1].Rows.Row))
	m.OutStayStGbn = make([]string, len(stayOutList.XML.Dataset[1].Rows.Row))

	// 파싱 시작
	for i, v := range stayOutList.XML.Dataset[1].Rows.Row {
		m.OutStayFrDt[i] = v.Col[2].Data
		m.OutStayToDt[i] = v.Col[1].Data
		m.OutStayStGbn[i] = v.Col[5].Data
	}

	return m
}

// ParsingCookies 쿠키 파싱하는 함수
func ParsingCookies(client *http.Client) string {
	// url 파싱
	u, _ := url.Parse(config.SchoolUrl)
	var value string

	// JSVSESSIONID 찾기
	for i := 0; i < len(client.Jar.Cookies(u)); i++ {
		if client.Jar.Cookies(u)[i].Name == "JSVSESSIONID" {
			value = client.Jar.Cookies(u)[i].Value
		}
	}
	return value
}

// ParsingPointList 상벌점 내역 파싱하는 함수
func ParsingPointList(pointList model.ResponseModel) model.PointList {
	// 모델 생성
	var m model.PointList
	// 상벌점 내역 파싱 위한 슬라이스 생성
	m.CmpScr = make([]string, len(pointList.XML.Dataset[0].Rows.Row))
	m.LifSstArdGbn = make([]string, len(pointList.XML.Dataset[0].Rows.Row))
	m.ArdInptDt = make([]string, len(pointList.XML.Dataset[0].Rows.Row))
	m.LifSstArdCtnt = make([]string, len(pointList.XML.Dataset[0].Rows.Row))

	// 파싱 시작
	for i, v := range pointList.XML.Dataset[0].Rows.Row {
		m.CmpScr[i] = v.Col[4].Data
		m.LifSstArdGbn[i] = v.Col[8].Data
		m.ArdInptDt[i] = v.Col[10].Data
		m.LifSstArdCtnt[i] = v.Col[2].Data
	}

	return m
}

// MakeCookieJar cookiejar에 쿠키를 설정해주는 함수
func MakeCookieJar(s string, jar *cookiejar.Jar) {
	// url 파싱
	u, _ := url.Parse(config.SchoolUrl)

	// JSVSESSIONID 쿠키 생성
	cookie := make([]*http.Cookie, 1)
	cookie[0] = &http.Cookie{Name: "JSVSESSIONID", Value: s}

	// 쿠키 설정
	jar.SetCookies(u, cookie)
}
