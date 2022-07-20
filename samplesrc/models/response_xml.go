package models

import "encoding/xml"

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
