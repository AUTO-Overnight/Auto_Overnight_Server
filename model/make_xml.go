package model

import "fmt"

// MakefindLiveStuNoXML LiveStuNo 찾기 위한 XML 만드는 함수
func MakefindLiveStuNoXML(info RequestInfo) []byte {
	return []byte(
		fmt.Sprintf(FindLiveStuNoXML,
			info.YY,
			info.TmGbn,
			info.SchregNo,
			info.StdKorNm,
		))
}

// MakeSendStayOutXML 외박 신청 위한 XML 만드는 함수
func MakeSendStayOutXML(info RequestInfo, livstuNo, outStayGbn, outStayFrDt, outStayToDt, outStayAplyDt string) []byte {
	return []byte(
		fmt.Sprintf(SendStayOutXML,
			info.YY,
			info.TmGbn,
			livstuNo,
			outStayGbn,
			outStayFrDt,
			outStayToDt,
			outStayAplyDt,
		))

}
