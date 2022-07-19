package functions

type LoginRequestModel struct {
	Id       string `json:"id"`
	PassWord string `json:"password"`
}

type FindRequestModel struct {
	Year    string            `json:"yy"`
	TmGbn   string            `json:"tmGbn"`
	UserNm  string            `json:"userNm"`
	Cookies map[string]string `json:"cookies"`
}
