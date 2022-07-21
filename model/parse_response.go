package model

// StayOutList 외박 신청 내역 파싱 위한 구조체
type StayOutList struct {
	OutStayFrDt  []string
	OutStayToDt  []string
	OutStayStGbn []string
}

// PointList 상벌점 내역 파싱 위한 구조체
type PointList struct {
	CmpScr        []string
	LifSstArdGbn  []string
	ArdInptDt     []string
	LifSstArdCtnt []string
}
