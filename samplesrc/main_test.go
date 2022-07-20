package main

import (
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"testing"
)

func TestHandleRequest(t *testing.T) {
	response, err := HandleRequest(events.APIGatewayProxyRequest{
		Path: "/sendstayout",
		Body: `
			{
    "date_list" : [20220722],
    "is_weekend" : [0],
    "outStayAplyDt" : "20220720",
    "cookies": {
        "JSVSESSIONID": "120jAshn5ZnpT52NrjLMSqbuN7CLgkpHQkHrhpS1VMtHEEaC7sOsGegjyaxTr1eT.amV1c19kb21haW4vanN2XzI=",
        "_SSO_Global_Logout_url": "get%5Ehttps%3A%2F%2Fportal.tukorea.ac.kr%3A443%2Fsso%2Flogout.jsp%24get%5Ehttps%3A%2F%2Fdream.tukorea.ac.kr%3A443%2Fcom%2FSsoCtr%2Fj_logout.do%24",
        "kalogin": "cJ8q8rvw2TIapw==$server"
    }
}`,
	})

	if err != nil {
		t.Log(err)
		t.Log(response)
		t.Failed()
	}
	val, err := json.MarshalIndent(response.Body, "", "    ")
	fmt.Println(string(val))

}
