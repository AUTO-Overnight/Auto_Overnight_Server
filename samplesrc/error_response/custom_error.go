package error_response

import "errors"

var (
	ParsingJsonBodyError   = errors.New("json body 파싱 에러")
	ParsingXMLBodyError    = errors.New("XML body 파싱 에러")
	EmptyIdOrPasswordError = errors.New("id와 password를 입력해주세요")
	WrongIdOrPasswordError = errors.New("id 또는 비밀번호를 잘못 입력했습니다")
	MakeCookieJarError     = errors.New("cookiejar 생성 에러")
	MakeHttpRequestError   = errors.New("http request 생성 에러")
	SendHttpRequestError   = errors.New("http request 요청 에러")
)
