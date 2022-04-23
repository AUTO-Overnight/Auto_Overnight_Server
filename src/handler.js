import loginFunction from "./functions/login.js";
import sendStayOutFunction from "./functions/sendStayOut.js";
import findStayOutListFunction from "./functions/findStayOutList.js";
import findPointListFunction from "./functions/findPointList.js";

import axios from "axios";
import { wrapper as axiosCookieJarSurpport } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

// 쿠키 저장소 만들기
axiosCookieJarSurpport(axios);

// 쿠키 저장 허용
axios.defaults.withCredentials = true;
// 리다이렉트 최댓값 -> 10은 되야 에러 안남 
axios.defaults.maxRedirects = 10;        
// user-agent 설정
axios.defaults.headers.post["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36";
axios.defaults.headers.get["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36";

// 로그인 함수
export const login = async (event, context, callback) => {

  // body에서 id, password 받아오기
  const {id, password} = JSON.parse(event.body);

  // 쿠키 설정
  const cookieJar = new CookieJar();
  axios.defaults.jar = cookieJar;

  const body = await loginFunction(axios, id, password, callback);

  // 200 코드, 쿠키, 학생 이름, 외박 신청 내역 return
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };

};

// 외박 신청 함수
export const sendStayOut = async (event, context, callback) => {

  // body에서 외박 신청할 날짜에 대한 정보와 쿠키 받아오기
  // 날짜 리스트, 주말/평일구분, 오늘 날짜, 쿠키
  const {date_list, is_weekend, outStayAplyDt, cookies} = JSON.parse(event.body);

  // 쿠키 설정
  const cookieJar = new CookieJar();
  axios.defaults.jar = cookieJar;
  axios.defaults.headers["Cookie"] = cookies;

  const body = await sendStayOutFunction(axios, date_list, is_weekend, outStayAplyDt, callback);
  
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}

// 외박 신청 목록 조회 함수
export const findStayOutList = async (event, context, callback) => {
  
  // body에서 외박 신청 목록 조회 위한 정보 받아오기
  // 년도, 학기, 학생 이름, 쿠키
  // 학기 구분 [1 : 1학기 / 2 : 2학기 / 5 : 여름학기 / 6 : 겨울학기]
  const {yy, tmGbn, userNm, cookies} = JSON.parse(event.body);
  
  // 쿠키 설정
  const cookieJar = new CookieJar();
  axios.defaults.jar = cookieJar;
  axios.defaults.headers["Cookie"] = cookies;

  const body = await findStayOutListFunction(axios, yy, tmGbn, userNm, callback);

  return {
    statusCode: 200,
    body : JSON.stringify(body)
  }

}

// 상벌점 조회 함수
export const findPointList = async (event, context, callback) => {

  // body에서 상벌점 조회 위한 정보 받아오기
  // 학생 이름, 쿠키
  const {userNm, cookies} = JSON.parse(event.body);

  // 쿠키 설정
  const cookieJar = new CookieJar();
  axios.defaults.jar = cookieJar;
  axios.defaults.headers["Cookie"] = cookies;

  const body = await findPointListFunction(axios, userNm, callback);

  return {
    statusCode: 200,
    body : JSON.stringify(body)
  }
  
}