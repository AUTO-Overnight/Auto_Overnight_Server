export const findUserNmXML = `<?xml version="1.0" encoding="UTF-8"?> 
<Root xmlns="http://www.nexacroplatform.com/platform/dataset">
	<Parameters>
		<Parameter id="columnList">persNo|userNm</Parameter>
		<Parameter id="requestTimeStr">1627027228674</Parameter>
	</Parameters>
</Root>`;

export const findYYtmgbnXML = `<?xml version="1.0" encoding="UTF-8"?>
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
</Root>`;

export function makeFindLiveStuNoXML(yy, tmGbn, schregNo, userNm) {
    return `<?xml version="1.0" encoding="UTF-8"?>
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
                    <Col id="yy">${yy}</Col>
                    <Col id="tmGbn">${tmGbn}</Col>
                    <Col id="schregNo">${schregNo}</Col>
                    <Col id="stdKorNm">${userNm}</Col>
                    <OrgRow>
                    </OrgRow>
                </Row>
            </Rows>
        </Dataset>
    </Root>`;
}

export function makesendStayOutXML(yy, tmGbn, livstuNo, outStayGbn, outStayFrDt, outStayToDt, outStayAplyDt) {
    // outStayStGbn [1 : 미승인 2 : 승인]
    // 승인되면 지울 수 가 없어서 리퀘스트 안보내봄
    return `<?xml version="1.0" encoding="UTF-8"?>
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
                    <Col id="yy">${yy}</Col>
                    <Col id="tmGbn">${tmGbn}</Col>
                    <Col id="livstuNo">${livstuNo}</Col>         
                    <Col id="outStayGbn">${outStayGbn}</Col>       
                    <Col id="outStayFrDt">${outStayFrDt}</Col> 
                    <Col id="outStayToDt">${outStayToDt}</Col> 
                    <Col id="outStayStGbn">1</Col>     
                    <Col id="outStayStNm">미승인</Col>
                    <Col id="outStayAplyDt">${outStayAplyDt}</Col>
                </Row>
            </Rows>
        </Dataset>
    </Root>`;
}

export function makeFindPointListXML(yy, tmGbn, schregNo, userNm) {
    return `<?xml version="1.0" encoding="UTF-8"?>
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
                    <Col id="yy">${yy}</Col>
                    <Col id="tmGbn">${tmGbn}</Col>
                    <Col id="schregNo">${schregNo}</Col>
                    <Col id="nm">${userNm}</Col>
                </Row>
            </Rows>
        </Dataset>
    </Root>`
}