package functions

// LoginRequestModel 로그인에 필요한 json
type LoginRequestModel struct {
	Id       string `json:"id"`
	PassWord string `json:"password"`
}

// FindRequestModel 상벌점 찾기, 외박 신청 내역 조회에 필요한 json
type FindRequestModel struct {
	Year    string            `json:"yy"`
	TmGbn   string            `json:"tmGbn"`
	UserNm  string            `json:"userNm"`
	Cookies map[string]string `json:"cookies"`
}

// SendRequestModel 외박 신청에 필요한 json
type SendRequestModel struct {
	DateList      []string          `json:"date_list"`
	IsWeekend     []int             `json:"is_weekend"`
	OutStayAplyDt string            `json:"outStayAplyDt"`
	Cookies       map[string]string `json:"cookies"`
}
