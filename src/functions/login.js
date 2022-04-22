'use strict';

const xmls = require("./xmls");
const requestFunc = require("./requestFunc");

export default async function loginFunction(axios, user) {

  let yy;               //년도
  let tmGbn;            //학기 구분 [1 : 1학기 / 2 : 2학기 / 5 : 여름학기 / 6 : 겨울학기]
  let userNm;           //학생 이름
  let persNo;           //학번

  /////////////////////////////////////////////////////////////////////////////////////////////////

  let cookies;          //세션과 쿠키 저장 위한 변수
  let base64encode;     //base64 encode

  let outStayFrDt = [];
  let outStayToDt = [];
  let outStayStGbn = [];

  /////////////////////////////////////////////////////////////////////////////////////////////////

  // 처음 로그인 하기
  await axios.post("https://ksc.tukorea.ac.kr/sso/login_proc.jsp?returnurl=null", user)
  .then()
  .catch((e) => {
    console.log(e);
    requestFunc.makeErrorResponse("첫 로그인 실패", callback);
  });

  // 로그인 하기 위한 base64 encode
  base64encode = Buffer.from(id, "utf8").toString('base64');

  // 통정시 로그인, 쿠키 저장하기
  await axios.get(`https://dream.tukorea.ac.kr/com/SsoCtr/initPageWork.do?loginGbn=sso&loginPersNo=${base64encode}`)
  .then((res)=>{
    cookies = res.config.headers.Cookie;
  })
  .catch((e) => {
    requestFunc.makeErrorResponse("통합 정보 시스템 로그인 실패", callback)
  });

  // 학생 이름, 학번 찾기
  await requestFunc.findUserName(xmls.findUserNmXML, axios)
  .then((res) => {
      let $ = cheerio.load(res.data, {
          xmlMode: true
      });
      userNm = $('Col[id="userNm"]').text();
      persNo = $('Col[id="persNo"]').text();
      
      if (userNm == "") {
        requestFunc.makeErrorResponse("비밀번호가 맞지 않습니다.", callback);
      }
  })
  .catch((e) => {
    console.log(e);
    requestFunc.makeErrorResponse("학생 이름 / 학번 찾기 실패", callback);
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

  // 생활관 거주 학생 구분 번호 찾기 위한 xml 만들기 => 외박 신청 내역 조회 때 사용하는 xml과 같음
  let findLiveStuNoXML = xmls.makeFindLiveStuNoXML(yy, tmGbn, persNo, userNm);

  // 외박 신청 내역 조회하기
  await requestFunc.findStayOutList(findLiveStuNoXML, axios)
  .then((res) =>{ 
    requestFunc.parseStayOutList(res, outStayFrDt, outStayToDt, outStayStGbn);
  })
  .catch((e) => {
    console.log(e);
    requestFunc.makeErrorResponse("외박 신청 내역 요청 실패", callback);
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