package functions

import (
	"auto_overnight_api/model"
	"net/http"
	"net/http/cookiejar"
	"net/url"
)

// ParsingStayoutList 외박 신청 내역 파싱하는 함수
func ParsingStayoutList(stayOutList model.Root) model.StayOutList {
	// 모델 생성
	var m model.StayOutList
	// 외박 신청 내역 파싱 내역 저장 위한 슬라이스 생성
	m.OutStayFrDt = make([]string, len(stayOutList.Dataset[1].Rows.Row))
	m.OutStayToDt = make([]string, len(stayOutList.Dataset[1].Rows.Row))
	m.OutStayStGbn = make([]string, len(stayOutList.Dataset[1].Rows.Row))

	// 파싱 시작
	for i, v := range stayOutList.Dataset[1].Rows.Row {
		m.OutStayFrDt[i] = v.Col[2].Data
		m.OutStayToDt[i] = v.Col[1].Data
		m.OutStayStGbn[i] = v.Col[5].Data
	}

	return m
}

// ParsingCookies 쿠키 파싱하는 함수
func ParsingCookies(client *http.Client) string {
	u, _ := url.Parse("https://dream.tukorea.ac.kr/")
	var value string
	for i := 0; i < len(client.Jar.Cookies(u)); i++ {
		if client.Jar.Cookies(u)[i].Name == "JSVSESSIONID" {
			value = client.Jar.Cookies(u)[i].Value
		}
	}
	return value
}

// ParsingPointList 상벌점 내역 파싱하는 함수
func ParsingPointList(pointList model.Root) model.PointList {
	// 모델 생성
	var m model.PointList
	// 상벌점 내역 파싱 위한 슬라이스 생성
	m.CmpScr = make([]string, len(pointList.Dataset[0].Rows.Row))
	m.LifSstArdGbn = make([]string, len(pointList.Dataset[0].Rows.Row))
	m.ArdInptDt = make([]string, len(pointList.Dataset[0].Rows.Row))
	m.LifSstArdCtnt = make([]string, len(pointList.Dataset[0].Rows.Row))

	// 파싱 시작
	for i, v := range pointList.Dataset[0].Rows.Row {
		m.CmpScr[i] = v.Col[4].Data
		m.LifSstArdGbn[i] = v.Col[8].Data
		m.ArdInptDt[i] = v.Col[10].Data
		m.LifSstArdCtnt[i] = v.Col[2].Data
	}

	return m
}

func MakeCookieJar(s string, jar *cookiejar.Jar) {
	u, _ := url.Parse("https://dream.tukorea.ac.kr/")

	cookie := make([]*http.Cookie, 1)
	cookie[0].Name = "JSVSESSIONID"
	cookie[0].Path = s

	jar.SetCookies(u, cookie)
}
