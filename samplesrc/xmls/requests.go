package xmls

import (
	"bytes"
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"net/http"
)

func RequestFindYYtmgbn(client *http.Client, findYYtmgbnChan chan Root, cookies map[string]string) {
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findYyTmGbnList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(FindYYtmgbnXML))
	if err != nil {
		panic(err)
	}

	if cookies != nil {
		req.AddCookie(&http.Cookie{Name: "_SSO_Global_Logout_url", Value: cookies["_SSO_Global_Logout_url"]})
		req.AddCookie(&http.Cookie{Name: "kalogin", Value: cookies["kalogin"]})
		req.AddCookie(&http.Cookie{Name: "JSVSESSIONID", Value: cookies["JSVSESSIONID"]})
	}

	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	body, _ := ioutil.ReadAll(res.Body)
	var yytmGbnInfo Root
	xml.Unmarshal(body, &yytmGbnInfo)

	findYYtmgbnChan <- yytmGbnInfo
}

func RequestFindUserNm(client *http.Client, findUserNmChan chan Root, cookies map[string]string) {
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/com/SsoCtr/findMyGLIOList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(FindUserNmXML))
	if err != nil {
		panic(err)
	}

	if cookies != nil {
		req.AddCookie(&http.Cookie{Name: "_SSO_Global_Logout_url", Value: cookies["_SSO_Global_Logout_url"]})
		req.AddCookie(&http.Cookie{Name: "kalogin", Value: cookies["kalogin"]})
		req.AddCookie(&http.Cookie{Name: "JSVSESSIONID", Value: cookies["JSVSESSIONID"]})
	}

	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	body, _ := ioutil.ReadAll(res.Body)
	var studentInfo Root
	xml.Unmarshal(body, &studentInfo)

	findUserNmChan <- studentInfo
}

func RequestFindStayOutList(client *http.Client, studentInfo, yytmGbnInfo Root, cookies map[string]string) Root {
	findLiveStuNoXML := MakefindLiveStuNoXML(studentInfo, yytmGbnInfo)
	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findStayAplyList.do?menuId=MPB0022&pgmId=PPB0021",
		bytes.NewBuffer(findLiveStuNoXML))
	if err != nil {
		panic(err)
	}

	if cookies != nil {
		req.AddCookie(&http.Cookie{Name: "_SSO_Global_Logout_url", Value: cookies["_SSO_Global_Logout_url"]})
		req.AddCookie(&http.Cookie{Name: "kalogin", Value: cookies["kalogin"]})
		req.AddCookie(&http.Cookie{Name: "JSVSESSIONID", Value: cookies["JSVSESSIONID"]})
	}

	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	body, _ := ioutil.ReadAll(res.Body)
	var temp Root
	err = xml.Unmarshal(body, &temp)
	if err != nil {
		panic(err)
	}

	return temp
}

func RequestFindPointList(client *http.Client, studentInfo, yytmGbnInfo Root, cookies map[string]string) Root {
	findPointListXML := []byte(fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
    <Root xmlns="http://www.nexacroplatform.com/platform/dataset">
        <Parameters>
            <Parameter id="requestTimeStr">1627048919169</Parameter>
        </Parameters>
        <Dataset id="DS_COND">
            <ColumnInfo>
                <Column id="yy" type="STRING" size="256"  />
                <Column id="tmGbn" type="STRING" size="256"  />
                <Column id="schregNo" type="STRING" size="256"  />
                <Column id="nm" type="STRING" size="256"  />
                <Column id="lifSstArdGbn" type="STRING" size="256"  />
            </ColumnInfo>
            <Rows>
                <Row>
                    <Col id="yy">%s</Col>
                    <Col id="tmGbn">%s</Col>
                    <Col id="schregNo">%s</Col>
                    <Col id="nm">%s</Col>
                </Row>
            </Rows>
        </Dataset>
    </Root>`,
		yytmGbnInfo.Dataset[0].Rows.Row[0].Col[0].Data,
		yytmGbnInfo.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.Dataset[0].Rows.Row[0].Col[0].Data))

	req, err := http.NewRequest(
		"POST",
		"https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findFindArdListList.do?menuId=MPB0024&pgmId=PPB0023",
		bytes.NewBuffer(findPointListXML))
	if err != nil {
		panic(err)
	}

	if cookies != nil {
		req.AddCookie(&http.Cookie{Name: "_SSO_Global_Logout_url", Value: cookies["_SSO_Global_Logout_url"]})
		req.AddCookie(&http.Cookie{Name: "kalogin", Value: cookies["kalogin"]})
		req.AddCookie(&http.Cookie{Name: "JSVSESSIONID", Value: cookies["JSVSESSIONID"]})
	}

	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	body, _ := ioutil.ReadAll(res.Body)
	var temp Root
	err = xml.Unmarshal(body, &temp)
	if err != nil {
		panic(err)
	}

	return temp
}
