package main

import (
	"bytes"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"sync"
)

type Root struct {
	XMLName    xml.Name   `xml:"Root"`
	Parameters Parameters `xml:"Parameters"`
	Dataset    []Dataset  `xml:"Dataset"`
}

type Parameters struct {
	Parameter string `xml:"Parameter"`
}

type Dataset struct {
	ColumnInfo ColumnInfo `xml:"ColumnInfo"`
	Rows       Rows       `xml:"Rows"`
}

type ColumnInfo struct {
	Column []string `xml:"Column"`
}

type Rows struct {
	Row []Row `xml:"Row"`
}

type Row struct {
	Col []Col `xml:"Col"`
}

type Col struct {
	Id   string `xml:"id,attr"`
	Data string `xml:",chardata"`
}

type RequestModel struct {
	Id       string `json:"id"`
	PassWord string `json:"password"`
}

func FindYYtmgbn(client *http.Client, findYYtmgbnChan chan Root) {
	findYYtmgbnXML := []byte(`<?xml version="1.0" encoding="UTF-8"?>
<Root xmlns="http://www.nexacroplatform.com/platform/dataset">
	<Parameters>
		<Parameter id="_ga">GA1.3.1065330987.1626699518</Parameter>
		<Parameter id="requestTimeStr">1626878279321</Parameter>
	</Parameters>
	<Dataset id="DS_COND">
		<ColumnInfo>
			<Column id="mvinTermYn" type="STRING" size="256"  />
		</ColumnInfo>
		<Rows>
			<Row>
				<Col id="mvinTermYn">1</Col>
			</Row>
		</Rows>
	</Dataset>
</Root>`)

	req, err := http.NewRequest("POST", "https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findYyTmGbnList.do?menuId=MPB0022&pgmId=PPB0021", bytes.NewBuffer(findYYtmgbnXML))
	if err != nil {
		panic(err)
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

func FindUserNm(client *http.Client, findUserNmChan chan Root) {
	findUserNmXML := []byte(
		`<?xml version="1.0" encoding="UTF-8"?>
			<Root xmlns="http://www.nexacroplatform.com/platform/dataset">
				<Parameters>
					<Parameter id="columnList">persNo|userNm</Parameter>
					<Parameter id="requestTimeStr">1627027228674</Parameter>
				</Parameters>
			</Root>`)

	req, err := http.NewRequest("POST", "https://dream.tukorea.ac.kr/com/SsoCtr/findMyGLIOList.do?menuId=MPB0022&pgmId=PPB0021", bytes.NewBuffer(findUserNmXML))
	if err != nil {
		panic(err)
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

func HandleRequest(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var requestsModel RequestModel
	err := json.Unmarshal([]byte(request.Body), &requestsModel)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}
	loginInfo := url.Values{
		"internalId": {requestsModel.Id},
		"internalPw": {requestsModel.PassWord},
		"gubun":      {"inter"},
	}

	jar, err := cookiejar.New(nil)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest("POST", "https://ksc.tukorea.ac.kr/sso/login_proc.jsp?returnurl=null", bytes.NewBufferString(loginInfo.Encode()))
	if err != nil {
		panic(err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	client := &http.Client{
		Jar: jar,
	}
	res, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer res.Body.Close()

	req, err = http.NewRequest("GET", "https://dream.tukorea.ac.kr/com/SsoCtr/initPageWork.do?loginGbn=sso&loginPersNo=", nil)

	if err != nil {
		panic(err)
	}

	res, err = client.Do(req)
	if err != nil {
		panic(err)
	}
	findUserNmChan := make(chan Root)
	findYYtmgbnChan := make(chan Root)

	go FindUserNm(client, findUserNmChan)
	go FindYYtmgbn(client, findYYtmgbnChan)

	studentInfo := <-findUserNmChan
	yytmGbnInfo := <-findYYtmgbnChan

	findLiveStuNoXML := []byte(fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
    <Root xmlns="http://www.nexacroplatform.com/platform/dataset">
        <Parameters>
            <Parameter id="_ga">GA1.3.1065330987.1626699518</Parameter>
            <Parameter id="requestTimeStr">1626877490927</Parameter>
        </Parameters>
        <Dataset id="DS_COND">
            <ColumnInfo>
                <Column id="yy" type="STRING" size="256"  />
                <Column id="tmGbn" type="STRING" size="256"  />
                <Column id="schregNo" type="STRING" size="256"  />
                <Column id="stdKorNm" type="STRING" size="256"  />
                <Column id="outStayStGbn" type="STRING" size="256"  />
            </ColumnInfo>
            <Rows>
                <Row type="update">
                    <Col id="yy">%s</Col>
                    <Col id="tmGbn">%s</Col>
                    <Col id="schregNo">%s</Col>
                    <Col id="stdKorNm">%s</Col>
                    <OrgRow>
                    </OrgRow>
                </Row>
            </Rows>
        </Dataset>
    </Root>`,
		yytmGbnInfo.Dataset[0].Rows.Row[0].Col[0].Data,
		yytmGbnInfo.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.Dataset[0].Rows.Row[0].Col[1].Data,
		studentInfo.Dataset[0].Rows.Row[0].Col[0].Data))

	req, err = http.NewRequest("POST", "https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findStayAplyList.do?menuId=MPB0022&pgmId=PPB0021", bytes.NewBuffer(findLiveStuNoXML))
	if err != nil {
		panic(err)
	}

	res, err = client.Do(req)
	if err != nil {
		panic(err)
	}
	body, _ := ioutil.ReadAll(res.Body)
	var temp Root
	xml.Unmarshal(body, &temp)

	responseBody := make(map[string]interface{})
	responseBody["name"] = studentInfo.Dataset[0].Rows.Row[0].Col[0].Data
	responseBody["yy"] = yytmGbnInfo.Dataset[0].Rows.Row[0].Col[0].Data
	responseBody["tmGbn"] = yytmGbnInfo.Dataset[0].Rows.Row[0].Col[1].Data

	cookies := make(map[string]string)

	outStayFrDt := make([]string, len(temp.Dataset[1].Rows.Row))
	outStayToDt := make([]string, len(temp.Dataset[1].Rows.Row))
	outStayStGbn := make([]string, len(temp.Dataset[1].Rows.Row))

	var wg sync.WaitGroup
	wg.Add(len(temp.Dataset[1].Rows.Row) + 3)

	go func() {
		for i, v := range temp.Dataset[1].Rows.Row[:len(temp.Dataset[1].Rows.Row)/2] {
			go func(i int, v Row) {
				outStayFrDt[i] = v.Col[2].Data
				outStayToDt[i] = v.Col[1].Data
				outStayStGbn[i] = v.Col[0].Data
				wg.Done()
			}(i, v)
		}
		wg.Done()
	}()
	go func() {
		for i, v := range temp.Dataset[1].Rows.Row[len(temp.Dataset[1].Rows.Row)/2:] {
			i += len(temp.Dataset[1].Rows.Row) / 2
			go func(i int, v Row) {
				outStayFrDt[i] = v.Col[2].Data
				outStayToDt[i] = v.Col[1].Data
				outStayStGbn[i] = v.Col[0].Data
				wg.Done()
			}(i, v)
		}
		wg.Done()
	}()
	go func() {
		for _, info := range req.Cookies() {
			cookies[info.Name] = info.Value
		}
		wg.Done()
	}()
	wg.Wait()

	responseBody["cookies"] = cookies
	responseBody["outStayFrDt"] = outStayFrDt
	responseBody["outStayToDt"] = outStayToDt
	responseBody["outStayStGbn"] = outStayStGbn

	responseJson, _ := json.Marshal(responseBody)
	response := events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseJson),
	}
	return response, nil
}

func main() {
	lambda.Start(HandleRequest)
}