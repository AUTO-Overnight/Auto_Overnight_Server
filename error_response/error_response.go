package error_response

import (
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
)

// MakeErrorResponse 에러 응답을 만드는 함수
func MakeErrorResponse(err error, statusCode int) (events.APIGatewayProxyResponse, error) {
	body := make(map[string]string)
	body["error"] = err.Error()

	responseJson, _ := json.Marshal(body)
	response := events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Body:       string(responseJson),
	}
	return response, nil
}
