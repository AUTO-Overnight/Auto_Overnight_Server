package model

type Cookies struct {
	Data map[string]string
}

type StayOutList struct {
	OutStayFrDt  []string
	OutStayToDt  []string
	OutStayStGbn []string
}

type PointList struct {
	CmpScr        []string
	LifSstArdGbn  []string
	ArdInptDt     []string
	LifSstArdCtnt []string
}
