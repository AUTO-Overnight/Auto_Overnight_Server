package main

import (
	"github.com/aws/aws-lambda-go/events"
	"testing"
)

// TestHandleRequestLogin login 테스트
func TestHandleRequestLogin(t *testing.T) {

	response, err := HandleRequest(events.APIGatewayProxyRequest{
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
			"cookies": {
        "JSVSESSIONID": "Gr3tqe4HaB31DcIXFeYFoLf1NIJfPGEIQ1xNYsyMy8PK7Um4764mQdacC6L9RE0A.amV1c19kb21haW4vanN2XzI=",
        "_SSO_Global_Logout_url": "get%5Ehttps%3A%2F%2Fportal.tukorea.ac.kr%3A443%2Fsso%2Flogout.jsp%24get%5Ehttps%3A%2F%2Fdream.tukorea.ac.kr%3A443%2Fcom%2FSsoCtr%2Fj_logout.do%24",
        "kalogin": "xz+sOVeR307xJg==$server"
    }
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
			"date_list" : ["20220721"],
			"is_weekend" : [0],
			"outStayAplyDt" : "20220720",
			"cookies": {
				"JSVSESSIONID": "MjgadzJs5544V5yIo5NJtz71xSUC1ZM8Qf04RFLgt91ngXXs73JwerCo4MO0Gqt8.amV1c19kb21haW4vanN2XzI=",
				"_SSO_Global_Logout_url": "get%5Ehttps%3A%2F%2Fportal.tukorea.ac.kr%3A443%2Fsso%2Flogout.jsp%24get%5Ehttps%3A%2F%2Fdream.tukorea.ac.kr%3A443%2Fcom%2FSsoCtr%2Fj_logout.do%24",
				"kalogin": "NZ4uqEuKiTiR/A==$server"
			}
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
			"yy" : "2021",
			"tmGbn" : "2",
			"userNm" : "이서윤",
			"cookies": {
				"JSVSESSIONID": "MjgadzJs5544V5yIo5NJtz71xSUC1ZM8Qf04RFLgt91ngXXs73JwerCo4MO0Gqt8.amV1c19kb21haW4vanN2XzI=",
				"_SSO_Global_Logout_url": "get%5Ehttps%3A%2F%2Fportal.tukorea.ac.kr%3A443%2Fsso%2Flogout.jsp%24get%5Ehttps%3A%2F%2Fdream.tukorea.ac.kr%3A443%2Fcom%2FSsoCtr%2Fj_logout.do%24",
				"kalogin": "NZ4uqEuKiTiR/A==$server"
			}
		}`,
	})

	if response.StatusCode != 200 {
		t.Error(response, err)
		t.FailNow()
	}
	t.Log(response)
}
