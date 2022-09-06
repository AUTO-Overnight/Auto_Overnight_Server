package main

import (
	"auto_overnight_api/route"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"net/url"
	"testing"
)

var id = "2018150030"
var pw = ""
var cookies = ""

// TestHandleRequestLogin login 테스트
func TestHandleRequestLogin(t *testing.T) {
	url.QueryEscape(pw)

	response, err := route.Login(events.APIGatewayProxyRequest{
		Path: "/login",
		Body: fmt.Sprintf(`
		{
			"id" : "%s",
			"password" : "%s"
		}`, id, pw),
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
		Body: fmt.Sprintf(`
		{
			"yy" : "2022",
			"tmGbn" : "2",
			"userNm" : "이서윤",
			"cookies": "%s"
		}`, cookies),
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
		Body: fmt.Sprintf(`
		{
			"date_list" : ["20220801"],
			"is_weekend" : [0],
			"outStayAplyDt" : "20220730",
			"cookies": "%s"
		}`, cookies),
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
		Body: fmt.Sprintf(`
		{
			"yy" : "2022",
			"tmGbn" : "2",
			"userNm" : "이서윤",
			"cookies": "%s"
		}`, cookies),
	})

	if response.StatusCode != 200 {
		t.Error(response, err)
		t.FailNow()
	}
	t.Log(response)
}
