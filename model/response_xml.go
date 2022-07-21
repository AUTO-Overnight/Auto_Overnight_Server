package model

import (
	"encoding/xml"
	"net/http"
)

/*
<?xml version="1.0" encoding="UTF-8"?>
<Root xmlns="http://www.nexacro.com/platform/dataset" ver="5000">
	<Parameters>
		<Parameter id="ErrorCode" type="int">0</Parameter>
	</Parameters>
	<Dataset id="DS_GLIO">
		<ColumnInfo>
			<Column id="userNm" type="string" size="32"/>
			<Column id="persNo" type="string" size="32"/>
		</ColumnInfo>
		<Rows>
			<Row>
				<Col id="userNm">이름</Col>
				<Col id="persNo">학번</Col>
			</Row>
		</Rows>
	</Dataset>
</Root>
*/

// ResponseModel 응답 받을 때 사용하는 구조체
type ResponseModel struct {
	XML   Root
	Req   *http.Request
	Error error
}

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
