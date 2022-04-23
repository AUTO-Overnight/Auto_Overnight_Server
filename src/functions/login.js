'use strict';

import { findUserNmXML, findYYtmgbnXML, makeFindLiveStuNoXML } from "../xmls.js";
import { findUserName, findStayOutList, findYYtmgbn, parseStayOutList, makeErrorResponse, } from "../requestFunc.js";
import cheerio from "cheerio";

export default async function loginFunction(axios, id, password, callback) {

  /////////////////////////////////////////////////////////////////////////////////////////////////

  let yy;               //년도
  let tmGbn;            //학기 구분 [1 : 1학기 / 2 : 2학기 / 5 : 여름학기 / 6 : 겨울학기]
  let userNm;           //학생 이름
  let persNo;           //학번

  /////////////////////////////////////////////////////////////////////////////////////////////////

  let cookies;          //세션과 쿠키 저장 위한 변수
  let base64encode;     //base64 encode

  let outStayFrDt = [];  // 외박 신청 시작 날짜
  let outStayToDt = [];  // 외박 신청 종료 날짜
  let outStayStGbn = []; // 외박 신청 상태 / 1 -> 미승인 2 -> 승인

  /////////////////////////////////////////////////////////////////////////////////////////////////

  // 로그인 하기 위한 데이터 생성
  const user = `internalId=${id}&internalPw=${password}&gubun=inter`;

  // 처음 로그인 하기
  await axios.post("https://ksc.tukorea.ac.kr/sso/login_proc.jsp?returnurl=null", user)
  .then()
  .catch((e) => {
    console.log(e);
    makeErrorResponse("첫 로그인 실패", e.name, e.message, callback);
  });

  // 로그인 하기 위한 base64 encode
  base64encode = Buffer.from(id, "utf8").toString('base64');

  // 통정시 로그인, 쿠키 저장하기
  await axios.get(`https://dream.tukorea.ac.kr/com/SsoCtr/initPageWork.do?loginGbn=sso&loginPersNo=${base64encode}`)
  .then((res)=>{
    cookies = res.request._headers.cookie;
  })
  .catch((e) => {
    makeErrorResponse("통합 정보 시스템 로그인 실패", e.name, e.message, callback)
  });

  // 학생 이름, 학번 찾기
  await findUserName(findUserNmXML, axios)
  .then((res) => {
      let $ = cheerio.load(res.data, {
          xmlMode: true
      });
      userNm = $('Col[id="userNm"]').text();
      persNo = $('Col[id="persNo"]').text();
      
      if (userNm == "") {
         makeErrorResponse("비밀번호가 맞지 않습니다.", "", "", callback);
      }
  })
  .catch((e) => {
    console.log(e);
    makeErrorResponse("학생 이름 / 학번 찾기 실패", e.name, e.message, callback);
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
  let findLiveStuNoXML = makeFindLiveStuNoXML(yy, tmGbn, persNo, userNm);

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
    "cookies" : cookies,
    "name" : userNm,
    "yy" : yy,
    "tmGbn" : tmGbn,
    "outStayFrDt" : outStayFrDt,
    "outStayToDt" : outStayToDt,
    "outStayStGbn" : outStayStGbn
  };

  return body;
}