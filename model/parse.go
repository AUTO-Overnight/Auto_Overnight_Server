package model

// StayOutList 외박 신청 내역 파싱하여 저장할 구조체
type StayOutList struct {
	OutStayFrDt  []string
	OutStayToDt  []string
	OutStayStGbn []string
}

// PointList 상벌점 내역 파싱하여 저장할 구조체
type PointList struct {
	CmpScr        []string
	LifSstArdGbn  []string
	ArdInptDt     []string
	LifSstArdCtnt []string
}

// RequestInfo request 보내기 위한 년, 학기, 학번, 학생 이름 저장할 구조체
type RequestInfo struct {
	YY       string
	TmGbn    string
	SchregNo string
	StdKorNm string
}
