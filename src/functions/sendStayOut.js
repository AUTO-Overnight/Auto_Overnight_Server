'use strict';

import { findUserNmXML, findYYtmgbnXML, makeFindLiveStuNoXML, makesendStayOutXML }  from "../xmls.js";
import { findUserName, findYYtmgbn, findLiveStuNo, sendStayOut , findStayOutList, parseStayOutList, makeErrorResponse } from "../requestFunc.js";
import cheerio from "cheerio";

export default async function sendStayOutFunction(axios, date_list, is_weekend, outStayAplyDt, callback) {

  /////////////////////////////////////////////////////////////////////////////////////////////////

  let outStayFrDt = [];  // 외박 신청 시작 날짜
  let outStayToDt = [];  // 외박 신청 종료 날짜
  let outStayStGbn = []; // 외박 신청 상태 / 1 -> 미승인 2 -> 승인
  
  /////////////////////////////////////////////////////////////////////////////////////////////////

  let yy;               //년도
  let tmGbn;            //학기 구분 [1 : 1학기 / 2 : 2학기 / 5 : 여름학기 / 6 : 겨울학기]
  let userNm;           //학생 이름
  let livstuNo;         //학생 거주 번호
  let persNo;           //학번

  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  // 학생 이름 찾기
  await findUserName(findUserNmXML, axios)
  .then((res) => {
      let $ = cheerio.load(res.data, {
          xmlMode: true
      });
      userNm = $('Col[id="userNm"]').text();
      persNo = $('Col[id="persNo"]').text();
  })
  .catch((e) => {
    console.log(e);
    makeErrorResponse("학생 이름 찾기 실패", e.name, e.message, callback);
  });

  // 년도, 학기 찾기
  await findYYtmgbn(findYYtmgbnXML, axios)
  .then((res) => {
      let $ = cheerio.load(res.data, {
          xmlMode: true
        });

      yy = $('Col[id="yy"]').text(yy);
      tmGbn = $('Col[id="tmGbn"]').text(tmGbn);
  })
  .catch((e) =>{
    console.log(e);
    makeErrorResponse("년도, 학기 찾기 실패", e.name, e.message, callback);
  });

  // 생활관 거주 학생 구분 번호 찾기 위한 xml 만들기 => 외박 신청 내역 조회 때 사용하는 xml과 같음
  let findLiveStuNoXML = makeFindLiveStuNoXML(yy, tmGbn, persNo , userNm);

  // 생활관 거주 학생 구분 번호 찾기
  await findLiveStuNo(findLiveStuNoXML, axios)
  .then((res) => {
    let $ = cheerio.load(res.data, {
      xmlMode: true
    });
    livstuNo = $('Col[id="livstuNo"]').text();
  })
  .catch((e) =>{
    console.log(e);
    makeErrorResponse("생활관 학생 구분 번호 찾기 실패", e.name, e.message, callback);
  });

  // 외박 신청 위한 xml 생성
  let sendStayOutXML;

  // 신청 횟수 만큼 외박신청 보내기
  // is_weekend -> 평일이 0, 주말이 1
  for (let x = 0 ; x < date_list.length ; x++) {

    let daycheck;

    // 평일이면
    if (is_weekend[x] == 0)  
        daycheck = "07";
    // 주말이면
    else 
        daycheck = "04";

    sendStayOutXML = makesendStayOutXML(yy, tmGbn, livstuNo, daycheck, date_list[x], date_list[x], outStayAplyDt);

    await sendStayOut(sendStayOutXML, axios)
      .then()
      .catch((e) =>{
        console.log(e);
        makeErrorResponse("외박 신청 요청 실패", e.name, e.message, callback);
    })
  }

  // 외박 신청 내역 조회하기
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