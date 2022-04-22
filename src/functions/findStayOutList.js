'use strict';

import xmls from "../xmls.js";
import requestFunc from "../requestFunc.js";
import cheerio from "cheerio";

export default async function findStayOutListFunction(axios, yy, tmGbn, userNm, callback) {

    /////////////////////////////////////////////////////////////////////////////////////////////////

    let outStayFrDt = [];   // 외박 신청 시작 날짜
    let outStayToDt = [];   // 외박 신청 종료 날짜
    let outStayStGbn = [];  // 외박 신청 상태 / 1 -> 미승인 2 -> 승인
  
    let persNo;             // 학번
  
    /////////////////////////////////////////////////////////////////////////////////////////////////
  
    // 학번 찾기
    await requestFunc.findUserName(xmls.findUserNmXML, axios)
      .then((res) => {
          let $ = cheerio.load(res.data, {
              xmlMode: true
          });
          persNo = $('Col[id="persNo"]').text();
      })
      .catch((e) => {
        console.log(e);
        requestFunc.makeErrorResponse("학번 찾기 실패", callback);
      });
    
    // 외박 신청 조회 위한 xml 만들기
    let findLiveStuNoXML = xmls.makeFindLiveStuNoXML(yy, tmGbn, persNo, userNm);
    
    // 외박 신청 조회
    await requestFunc.findStayOutList(findLiveStuNoXML, axios)
    .then((res) =>{ 
      requestFunc.parseStayOutList(res, outStayFrDt, outStayToDt, outStayStGbn);
    })
    .catch((e) => {
      console.log(e);
      requestFunc.makeErrorResponse("외박 신청 내역 요청 실패", callback);
    });
  
    const body  = {
      "outStayFrDt" : outStayFrDt,
      "outStayToDt" : outStayToDt,
      "outStayStGbn" : outStayStGbn
    };

    return body;

}