package xmls

import "fmt"

var (
	// FindYYtmgbnXML 년도, 학기 찾기 위한 XML
	FindYYtmgbnXML = []byte(`<?xmls version="1.0" encoding="UTF-8"?>
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
	// FindUserNmXML 이름, 학번 찾기 위한 XML
	FindUserNmXML = []byte(
		`<?xmls version="1.0" encoding="UTF-8"?>
			<Root xmlns="http://www.nexacroplatform.com/platform/dataset">
				<Parameters>
					<Parameter id="columnList">persNo|userNm</Parameter>
					<Parameter id="requestTimeStr">1627027228674</Parameter>
				</Parameters>
			</Root>`)
)

// MakefindLiveStuNoXML LiveStuNo 찾기 위한 XML 만드는 함수
func MakefindLiveStuNoXML(yy, tmGbn, schregNo, stdKorNm string) []byte {
	return []byte(fmt.Sprintf(`<?xmls version="1.0" encoding="UTF-8"?>
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
		yy, tmGbn, schregNo, stdKorNm))
}

// MakeSendStayOutXML 외박 신청 위한 XML 만드는 함수
func MakeSendStayOutXML(yy, tmGbn, livstuNo, outStayGbn, outStayFrDt, outStayToDt, outStayAplyDt string) []byte {
	return []byte(fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
    <Root xmlns="http://www.nexacroplatform.com/platform/dataset">
        <Parameters>
            <Parameter id="_ga">GA1.3.1065330987.1626699518</Parameter>
            <Parameter id="requestTimeStr">1626795331154</Parameter>
        </Parameters>
        <Dataset id="DS_DORM120">
            <ColumnInfo>
                <Column id="chk" type="STRING" size="256"  />
                <Column id="yy" type="STRING" size="256"  />
                <Column id="tmGbn" type="STRING" size="256"  />
                <Column id="livstuNo" type="STRING" size="256"  />
                <Column id="outStaySeq" type="STRING" size="256"  />
                <Column id="outStayGbn" type="STRING" size="256"  />
                <Column id="outStayFrDt" type="STRING" size="256"  />
                <Column id="outStayToDt" type="STRING" size="256"  />
                <Column id="outStayStGbn" type="STRING" size="256"  />
                <Column id="outStayStNm" type="STRING" size="256"  />
                <Column id="outStayAplyDt" type="STRING" size="256"  />
                <Column id="outStayReplyCtnt" type="STRING" size="256"  />
                <Column id="schregNo" type="STRING" size="256"  />
                <Column id="hldyYn" type="STRING" size="256"  />
                <Column id="resprHldyYn" type="STRING" size="256"  />
            </ColumnInfo>
            <Rows>
                <Row type="insert">
                    <Col id="yy">%s</Col>
                    <Col id="tmGbn">%s</Col>
                    <Col id="livstuNo">%s</Col>         
                    <Col id="outStayGbn">%s</Col>       
                    <Col id="outStayFrDt">%s</Col> 
                    <Col id="outStayToDt">%s</Col> 
                    <Col id="outStayStGbn">1</Col>     
                    <Col id="outStayStNm">미승인</Col>
                    <Col id="outStayAplyDt">%s</Col>
                </Row>
            </Rows>
        </Dataset>
    </Root>`,
		yy,
		tmGbn,
		livstuNo,
		outStayGbn,
		outStayFrDt,
		outStayToDt,
		outStayAplyDt,
	))

}
