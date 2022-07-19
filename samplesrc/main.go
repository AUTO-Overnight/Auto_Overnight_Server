package main

import (
	"auto_overnight_api/functions"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func HandleRequest(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var response events.APIGatewayProxyResponse
	var err error

	switch request.Path {
	case "/login":
		response, err = functions.Login(request)
	case "/sendstayout":
		response, err = functions.SendStayOut(request)
	case "/findstayoutlist":
		response, err = functions.FindStayOutList(request)
	case "/findpointlist":
		response, err = functions.FindPointList(request)
	default:
		response, err = events.APIGatewayProxyResponse{StatusCode: 404}, nil
	}
	return response, err
}

func main() {
	lambda.Start(HandleRequest)
}
