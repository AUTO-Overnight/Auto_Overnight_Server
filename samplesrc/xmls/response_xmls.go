package xmls

import "encoding/xml"

type Root struct {
	XMLName    xml.Name   `xmls:"Root"`
	Parameters Parameters `xmls:"Parameters"`
	Dataset    []Dataset  `xmls:"Dataset"`
}

type Parameters struct {
	Parameter string `xmls:"Parameter"`
}

type Dataset struct {
	ColumnInfo ColumnInfo `xmls:"ColumnInfo"`
	Rows       Rows       `xmls:"Rows"`
}

type ColumnInfo struct {
	Column []string `xmls:"Column"`
}

type Rows struct {
	Row []Row `xmls:"Row"`
}

type Row struct {
	Col []Col `xmls:"Col"`
}

type Col struct {
	Id   string `xmls:"id,attr"`
	Data string `xmls:",chardata"`
}
