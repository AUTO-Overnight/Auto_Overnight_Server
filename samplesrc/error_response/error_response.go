package error_response

import (
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
)

func MakeErrorResponse(err error, statusCode int, comment string) (events.APIGatewayProxyResponse, error) {
	body := make(map[string]string)
	body["error"] = err.Error()
	body["comment"] = comment

	responseJson, _ := json.Marshal(body)
	response := events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Body:       string(responseJson),
	}
	return response, err
}
