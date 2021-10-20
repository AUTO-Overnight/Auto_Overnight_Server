'use strict';

const xmls = require("./xmls");
const requestFunc = require("./requestFunc");

const axios = require('axios');
const cheerio = require('cheerio');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

axios.defaults.withCredentials = true;      // 쿠키 저장 허용
axios.defaults.maxRedirects = 10;           // 리다이렉트 최댓값 -> 10은 되야 에러 안남             // 세션 유지 위한 쿠키 설정
axios.defaults.headers.post["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36";
axios.defaults.headers.get["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36";

module.exports.login = async (event, context, callback) => {

  const {id, password} = JSON.parse(event.body);
  const user = `internalId=${id}&internalPw=${password}&gubun=inter`;
  const cookieJar = new tough.CookieJar(); 
  axios.defaults.jar = cookieJar;

  /////////////////////////////////////////////////////////////////////////////////////////////////
  
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
  await axios.post("https://ksc.kpu.ac.kr/sso/login_proc.jsp", user)
  .then()
  .catch((e) => {
    console.log(e);
    requestFunc.makeErrorResponse("첫 로그인 실패", callback);
  });

  // 로그인 하기 위한 base64 encode
  base64encode = Buffer.from(id, "utf8").toString('base64');

  // 통정시 로그인, 쿠키 저장하기
  await axios.get(`https://iis.kpu.ac.kr/com/SsoCtr/initPageWork.do?loginGbn=sso&loginPersNo=${base64encode}`)
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

  // 200 코드, 쿠키, 학생 이름, 외박 신청 내역 return
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
};

module.exports.sendStayOut = async (event, context, callback) => {

  ///////////////////////////////////////쿠키, 응답 선언하기////////////////////////////////////////////
  const {date_list, is_weekend, outStayAplyDt, schregNo, cookies} = JSON.parse(event.body);

  //is_weekend -> 평일이 0, 주말이 1
  const cookieJar = new tough.CookieJar(); 
  axios.defaults.jar = cookieJar;
  axios.defaults.headers["Cookie"] = cookies;

  let outStayFrDt = [];
  let outStayToDt = [];
  let outStayStGbn = [];
  
  /////////////////////////////////////////////////////////////////////////////////////////////////

  let yy;               //년도
  let tmGbn;            //학기 구분 [1 : 1학기 / 2 : 2학기 / 5 : 여름학기 / 6 : 겨울학기]
  let userNm;           //학생 이름
  let livstuNo;         //학생 거주 번호
  let persNo;           //학번

  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  // 학생 이름 찾기
  await requestFunc.findUserName(xmls.findUserNmXML, axios)
  .then((res) => {
      let $ = cheerio.load(res.data, {
          xmlMode: true
      });
      userNm = $('Col[id="userNm"]').text();
      persNo = $('Col[id="persNo"]').text();
  })
  .catch((e) => {
    console.log(e);
    requestFunc.makeErrorResponse("학생 이름 찾기 실패", callback);
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
  let findLiveStuNoXML = xmls.makeFindLiveStuNoXML(yy, tmGbn, persNo , userNm);

  // 생활관 거주 학생 구분 번호 찾기
  await requestFunc.findLiveStuNo(findLiveStuNoXML, axios)
  .then((res) => {
    let $ = cheerio.load(res.data, {
      xmlMode: true
    });
    livstuNo = $('Col[id="livstuNo"]').text();
  })
  .catch((e) =>{
    console.log(e);
    requestFunc.makeErrorResponse("생활관 학생 구분 번호 찾기 실패", callback);
  });

  let sendStayOutXML;

  // 신청 횟수 만큼 외박신청 보내기
  for (let x = 0 ; x < date_list.length ; x++) {
    // 평일이면
    if (is_weekend[x] == 0) {           
      sendStayOutXML = xmls.makesendStayOutXML(yy, tmGbn, livstuNo, "07", date_list[x], date_list[x], outStayAplyDt);

      await requestFunc.sendStayOut(sendStayOutXML, axios)
      .then()
      .catch((e) =>{
        console.log(e);
        requestFunc.makeErrorResponse("외박 신청 요청 실패", callback);
      })
      
    } 
    // 주말이면
    else {
      sendStayOutXML = xmls.makesendStayOutXML(yy, tmGbn, livstuNo, "04", date_list[x], date_list[x], outStayAplyDt);

      await requestFunc.sendStayOut(sendStayOutXML, axios)
      .then()
      .catch((e) =>{
        console.log(e);
        requestFunc.makeErrorResponse("외박 신청 요청 실패", callback);
      })
    }
  }

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
    "outStayFrDt" : outStayFrDt,
    "outStayToDt" : outStayToDt,
    "outStayStGbn" : outStayStGbn
  };

  
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}

module.exports.findStayOutList = async (event, context, callback) => {

  /////////////////////////////////////////////////////////////////////////////////////////////////

  //년도 //학기 구분 [1 : 1학기 / 2 : 2학기 / 5 : 여름학기 / 6 : 겨울학기]
  //학번 //학생 이름

  const {yy, tmGbn, schregNo, userNm, cookies} = JSON.parse(event.body);
  
  const cookieJar = new tough.CookieJar(); 
  axios.defaults.jar = cookieJar;
  axios.defaults.headers["Cookie"] = cookies;

  let outStayFrDt = [];
  let outStayToDt = [];
  let outStayStGbn = [];

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

  let findLiveStuNoXML = xmls.makeFindLiveStuNoXML(yy, tmGbn, persNo, userNm);

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

  return {
    statusCode: 200,
    body : JSON.stringify(body)
  }
}

module.exports.findPointList = async (event, context, callback) => {

  ///////////////////////////////////////쿠키, 응답 선언하기////////////////////////////////////////////

  //년도 //학기 구분 [1 : 1학기 / 2 : 2학기 / 5 : 여름학기 / 6 : 겨울학기]
  //학번 //학생 이름

  const {schregNo, userNm, cookies} = JSON.parse(event.body);

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

