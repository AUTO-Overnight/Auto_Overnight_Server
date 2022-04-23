'use strict';

import { findUserNmXML,  makeFindLiveStuNoXML} from "../xmls.js";
import { findUserName, findStayOutList, makeErrorResponse} from "../requestFunc.js";
import cheerio from "cheerio";

export default async function findStayOutListFunction(axios, yy, tmGbn, userNm, callback) {

    /////////////////////////////////////////////////////////////////////////////////////////////////

    let outStayFrDt = [];   // 외박 신청 시작 날짜
    let outStayToDt = [];   // 외박 신청 종료 날짜
    let outStayStGbn = [];  // 외박 신청 상태 / 1 -> 미승인 2 -> 승인
  
    let persNo;             // 학번
  
    /////////////////////////////////////////////////////////////////////////////////////////////////
  
    // 학번 찾기
    await findUserName(findUserNmXML, axios)
      .then((res) => {
          let $ = cheerio.load(res.data, {
              xmlMode: true
          });
          persNo = $('Col[id="persNo"]').text();
      })
      .catch((e) => {
        console.log(e);
        makeErrorResponse("학번 찾기 실패 ", e.name, e.message, callback);
      });
    
    // 외박 신청 조회 위한 xml 만들기
    let findLiveStuNoXML = makeFindLiveStuNoXML(yy, tmGbn, persNo, userNm);
    
    // 외박 신청 조회
    await findStayOutList(findLiveStuNoXML, axios)
    .then((res) =>{ 
      parseStayOutList(res, outStayFrDt, outStayToDt, outStayStGbn);
    })
    .catch((e) => {
      console.log(e);
      makeErrorResponse("외박 신청 내역 요청 실패", e.name, e.message, callback);
    });
    
    const body  = {
      "outStayFrDt" : outStayFrDt,
      "outStayToDt" : outStayToDt,
      "outStayStGbn" : outStayStGbn
    };

    return body;

}