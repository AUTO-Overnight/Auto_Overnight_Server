package model

// LoginRequest 로그인에 필요한 json request 파싱 하기 위한 구조체
type LoginRequest struct {
	Id       string `json:"id"`
	PassWord string `json:"password"`
}

// FindRequest 상벌점 찾기, 외박 신청 내역 조회에 필요한 json request 파싱 하기 위한 구조체
type FindRequest struct {
	Year    string `json:"yy"`
	TmGbn   string `json:"tmGbn"`
	UserNm  string `json:"userNm"`
	Cookies string `json:"cookies"`
}

// SendRequest 외박 신청에 필요한 json request 파싱 하기 위한 구조체
type SendRequest struct {
	DateList      []string `json:"date_list"`
	IsWeekend     []int    `json:"is_weekend"`
	OutStayAplyDt string   `json:"outStayAplyDt"`
	Cookies       string   `json:"cookies"`
}
