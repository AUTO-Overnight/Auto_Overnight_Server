'use strict';

import xmls from "./xmls";
import requestFunc from "./requestFunc";

import loginFunction from "./functions/login";
import sendStayOutFunction from "./functions/sendStayOut";
import findStayOutListFunction from "./functions/findStayOutList";
import findPointListFunction from "./functions/findPointList";

import axios from "axios";
import cheerio from "cheerio";
import axiosCookieJarSupport from "axios-cookiejar-support";
import tough from "tough-cookie";

// 세션 유지 위한 쿠키 설정
axiosCookieJarSupport(axios);

// 쿠키 저장 허용
axios.defaults.withCredentials = true;
// 리다이렉트 최댓값 -> 10은 되야 에러 안남 
axios.defaults.maxRedirects = 10;        
// user-agent 설정
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

  const body = await loginFunction(axios, user);

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

  const body = await sendStayOutFunction(axios, date_list, is_weekend, outStayAplyDt);
  
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

  const body = await findStayOutListFunction(axios, yy, tmGbn, userNm);

  return {
    statusCode: 200,
    body : JSON.stringify(body)
  }
}

// 상벌점 조회 함수
module.exports.findPointList = async (event, context, callback) => {

  // body에서 상벌점 조회 위한 정보 받아오기
  // 학생 이름, 쿠키
  const {userNm, cookies} = event.queryStringParameters;

  // 쿠키 설정
  const cookieJar = new tough.CookieJar(); 
  axios.defaults.jar = cookieJar;
  axios.defaults.headers["Cookie"] = cookies;

  const body = await findPointListFunction(axios, userNm);

  return {
    statusCode: 200,
    body : JSON.stringify(body)
  }
  
}