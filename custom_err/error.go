package custom_err

import (
	"encoding/json"
	"errors"
	"github.com/aws/aws-lambda-go/events"
)

var (
	ParsingJsonBodyErr   = errors.New("json body 파싱 에러")
	MakeJsonBodyErr      = errors.New("json body 생성 에러")
	ParsingXMLBodyErr    = errors.New("XML body 파싱 에러")
	EmptyIdOrPasswordErr = errors.New("id와 password를 입력해주세요")
	WrongIdOrPasswordErr = errors.New("id 또는 비밀번호를 잘못 입력했습니다")
	WrongCookieErr       = errors.New("쿠키/세션이 만료되거나 잘못됐습니다.")
	MakeCookieJarErr     = errors.New("cookiejar 생성 에러")
	MakeHttpRequestErr   = errors.New("http request 생성 에러")
	SendHttpRequestErr   = errors.New("http request 요청 에러")
)

// MakeErrorResponse 에러 응답을 만드는 함수
func MakeErrorResponse(err error, statusCode int) (events.APIGatewayProxyResponse, error) {
	body := make(map[string]string)
	body["err"] = err.Error()

	responseJson, _ := json.Marshal(body)
	response := events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Body:       string(responseJson),
	}
	return response, nil
}
