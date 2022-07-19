package functions

import "github.com/aws/aws-lambda-go/events"

func SendStayOut(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{}, nil
}
