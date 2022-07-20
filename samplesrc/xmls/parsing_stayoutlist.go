package xmls

import (
	"net/http"
	"sync"
)

func ParsingStayoutList(stayOutList Root) {

	var wg sync.WaitGroup
	wg.Add(len(stayOutList.Dataset[1].Rows.Row))

	// 외박 신청 내역 파싱 내역 저장 위한 슬라이스 생성
	outStayFrDt := make([]string, len(stayOutList.Dataset[1].Rows.Row))
	outStayToDt := make([]string, len(stayOutList.Dataset[1].Rows.Row))
	outStayStGbn := make([]string, len(stayOutList.Dataset[1].Rows.Row))

	go func() {
		for i, v := range stayOutList.Dataset[1].Rows.Row {
			go func(i int, v Row) {
				outStayFrDt[i] = v.Col[2].Data
				wg.Done()
			}(i, v)
		}
	}()
	go func() {
		for i, v := range stayOutList.Dataset[1].Rows.Row {
			go func(i int, v Row) {
				outStayToDt[i] = v.Col[1].Data
				wg.Done()
			}(i, v)
		}
	}()
	go func() {
		for i, v := range stayOutList.Dataset[1].Rows.Row {
			go func(i int, v Row) {
				outStayStGbn[i] = v.Col[0].Data
				wg.Done()
			}(i, v)
		}
	}()

	//for i, v := range stayOutList.Dataset[1].Rows.Row {
	//	go func(i int, v Row) {
	//		outStayFrDt[i] = v.Col[2].Data
	//		outStayToDt[i] = v.Col[1].Data
	//		outStayStGbn[i] = v.Col[0].Data
	//		wg.Done()
	//	}(i, v)
	//}

}

func ParsingCookies(req *http.Request, cookiesChan chan map[string]string) {
	cookies := make(map[string]string)

	for _, info := range req.Cookies() {
		cookies[info.Name] = info.Value
	}

	cookiesChan <- cookies
}