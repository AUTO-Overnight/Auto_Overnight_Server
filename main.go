package main

import (
	"auto_overnight_api/functions"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// HandleRequest Path에 맞는 함수를 실행함
func HandleRequest(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var response events.APIGatewayProxyResponse
	var err error

	switch request.Path {
	// 로그인
	case "/login":
		response, err = functions.Login(request)
	// 외박 신청 보내기
	case "/sendstayout":
		response, err = functions.SendStayOut(request)
	// 외박 신청 내역 조회
	case "/findstayoutlist":
		response, err = functions.FindStayOutList(request)
	// 상벌점 조회
	case "/findpointlist":
		response, err = functions.FindPointList(request)
	// 잘못된 Path
	default:
		response, err = events.APIGatewayProxyResponse{StatusCode: 404}, nil
	}

	return response, err
}

func main() {
	lambda.Start(HandleRequest)
}
