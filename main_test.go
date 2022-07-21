package main

import (
	"auto_overnight_api/route"
	"github.com/aws/aws-lambda-go/events"
	"testing"
)

// TestHandleRequestLogin login 테스트
func TestHandleRequestLogin(t *testing.T) {

	response, err := route.Login(events.APIGatewayProxyRequest{
		Path: "/login",
		Body: `
		{
			"id" : "",
			"password" : ""
		}`,
	})

	if response.StatusCode != 200 {
		t.Log(response, err)
		t.FailNow()
	}
	t.Log(response)
}

// TestHandleRequestFindStayOutList 외박 신청 내역 조회 테스트
func TestHandleRequestFindStayOutList(t *testing.T) {

	response, err := HandleRequest(events.APIGatewayProxyRequest{
		Path: "/findstayoutlist",
		Body: `
		{
			"yy" : "2022",
			"tmGbn" : "5",
			"userNm" : "이서윤",
			"cookies": "aralZ3uJuRk1mOpKsiFGx4iD12Yyzbv09AKa1U4Z77ciz81a75ITcP0rESgsw4F6.amV1c19kb21haW4vanN2XzE="
		}`,
	})

	if response.StatusCode != 200 {
		t.Log(response, err)
		t.FailNow()
	}
	t.Log(response)
}

// TestHandleRequestSendStayOut 외박 신청 테스트
func TestHandleRequestSendStayOut(t *testing.T) {

	response, err := HandleRequest(events.APIGatewayProxyRequest{
		Path: "/sendstayout",
		Body: `
		{
			"date_list" : ["20220902"],
			"is_weekend" : [0],
			"outStayAplyDt" : "20220721",
			"cookies": "aralZ3uJuRk1mOpKsiFGx4iD12Yyzbv09AKa1U4Z77ciz81a75ITcP0rESgsw4F6.amV1c19kb21haW4vanN2XzE="
		}`,
	})

	if response.StatusCode != 200 {
		t.Log(response, err)
		t.FailNow()
	}
	t.Log(response)
}

// TestHandleRequestFindPointList 상벌점 조회 테스트
func TestHandleRequestFindPointList(t *testing.T) {

	response, err := HandleRequest(events.APIGatewayProxyRequest{
		Path: "/findpointlist",
		Body: `
		{
			"yy" : "2022",
			"tmGbn" : "1",
			"userNm" : "이서윤",
			"cookies": "aralZ3uJuRk1mOpKsiFGx4iD12Yyzbv09AKa1U4Z77ciz81a75ITcP0rESgsw4F6.amV1c19kb21haW4vanN2XzE="
		}`,
	})

	if response.StatusCode != 200 {
		t.Error(response, err)
		t.FailNow()
	}
	t.Log(response)
}
