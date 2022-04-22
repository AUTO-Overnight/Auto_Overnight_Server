'use strict';

import xmls from "./xmls";
import requestFunc from "./requestFunc";

import loginFunction from "./functions/login";
import sendStayOutFunction from "./functions/sendStayOut";
import findStayOutListFunction from "./functions/findStayOutList";

import axios from "axios";
import cheerio from "cheerio";
import axiosCookieJarSupport from "axios-cookiejar-support";
import tough from "tough-cookie";

// 세션 유지 위한 쿠키 설정
axiosCookieJarSupport(axios);

axios.defaults.withCredentials = true;      // 쿠키 저장 허용
axios.defaults.maxRedirects = 10;           // 리다이렉트 최댓값 -> 10은 되야 에러 안남 
axios.defaults.headers.post["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36";
axios.defaults.headers.get["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36";

// 로그인 함수
module.exports.login = async (event, context, callback) => {

  // body에서 id, password 받아오기
  const {id, password} = JSON.parse(event.body);
  // 로그인 하기 위한 데이터 생성
  const user = `internalId=${id}&internalPw=${password}&gubun=inter`;

  // 쿠키 설정
  const cookieJar = new tough.CookieJar(); 
  axios.defaults.jar = cookieJar;

  const body = loginFunction(axios, user);

  // 200 코드, 쿠키, 학생 이름, 외박 신청 내역 return
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };

};

// 외박 신청 함수
module.exports.sendStayOut = async (event, context, callback) => {

  // body에서 외박 신청할 날짜에 대한 정보와 쿠키 받아오기
  // 날짜 리스트, 주말/평일구분, 오늘 날짜, 쿠키
  const {date_list, is_weekend, outStayAplyDt, cookies} = JSON.parse(event.body);

  // 쿠키 설정
  const cookieJar = new tough.CookieJar(); 
  axios.defaults.jar = cookieJar;
  axios.defaults.headers["Cookie"] = cookies;

  const body = sendStayOutFunction(axios, date_list, is_weekend, outStayAplyDt);
  
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}

// 외박 신청 목록 조회 함수
module.exports.findStayOutList = async (event, context, callback) => {
  
  // body에서 외박 신청 목록 조회 위한 정보 받아오기
  // 년도, 학기, 학생 이름, 쿠키
  // 학기 구분 [1 : 1학기 / 2 : 2학기 / 5 : 여름학기 / 6 : 겨울학기]
  const {yy, tmGbn, userNm, cookies} = event.queryStringParameters;
  
  // 쿠키 설정
  const cookieJar = new tough.CookieJar(); 
  axios.defaults.jar = cookieJar;
  axios.defaults.headers["Cookie"] = cookies;

  const body = findStayOutListFunction(axios, yy, tmGbn, userNm);

  return {
    statusCode: 200,
    body : JSON.stringify(body)
  }
}

// 상벌점 조회 함수
module.exports.findPointList = async (event, context, callback) => {

  ///////////////////////////////////////쿠키, 응답 선언하기////////////////////////////////////////////

  //년도 //학기 구분 [1 : 1학기 / 2 : 2학기 / 5 : 여름학기 / 6 : 겨울학기]
  //학번 //학생 이름

  const {userNm, cookies} = event.queryStringParameters;

  const cookieJar = new tough.CookieJar(); 
  axios.defaults.jar = cookieJar;
  axios.defaults.headers["Cookie"] = cookies;

  /////////////////////////////////////////////////////////////////////////////////////////////////

  let yy;                       // 년도
  let tmGbn;                    // 학기
  let persNo;                   // 학번

  /////////////////////////////////////////////////////////////////////////////////////////////////

  let cmpScr = [];              // 상벌점
  let lifSstArdGbn = [];        // 상벌구분 (1 : 상점 2 : 벌점)
  let ardInptDt = [];           // 상벌일자
  let lifSstArdCtnt = [];       // 상벌내용

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

    // 년도, 학기 찾기
  await requestFunc.findYYtmgbn(xmls.findYYtmgbnXML, axios)
  .then((res) => {
      let $ = cheerio.load(res.data, {
          xmlMode: true
        });

      yy = $('Col[id="yy"]').text(yy);
      tmGbn = $('Col[id="tmGbn"]').text(tmGbn);
  })
  .catch((e) =>{
    console.log(e);
    requestFunc.makeErrorResponse("년도, 학기 찾기 실패", callback);
  });

  let findPointListXML = xmls.makeFindPointListXML(yy, tmGbn, persNo, userNm);

  await requestFunc.findPointList(findPointListXML, axios)
  .then((res) =>{

    let $ = cheerio.load(res.data, {
      xmlMode: true
    });

    $('Col[id="cmpScr"]').each((key , val)=> {
      cmpScr.push($(val).text());
    });

    $('Col[id="lifSstArdGbn"]').each((key , val)=> {
      lifSstArdGbn.push($(val).text());
    });

    $('Col[id="ardInptDt"]').each((key , val)=> {
      ardInptDt.push($(val).text());
    });

    $('Col[id="lifSstArdCtnt"]').each((key , val)=> {
      lifSstArdCtnt.push($(val).text());
    });

  })
  .catch((e) =>{
    console.log(e);
    requestFunc.makeErrorResponse("상벌점 내역 요청 실패", callback);
  })

  const body  = {
    "cmpScr" : cmpScr,
    "lifSstArdGbn" : lifSstArdGbn,
    "ardInptDt" : ardInptDt,
    "lifSstArdCtnt" : lifSstArdCtnt
  };

  return {
    statusCode: 200,
    body : JSON.stringify(body)
  }
  
}