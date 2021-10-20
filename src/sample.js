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

async function login() {

    const id = "kdj95061"
    const password = "kdj44974"
    const user = `internalId=${id}&internalPw=${password}&gubun=inter`;
    const cookieJar = new tough.CookieJar(); 
    axios.defaults.jar = cookieJar;
  
    /////////////////////////////////////////////////////////////////////////////////////////////////
    
    let yy;               //년도
    let tmGbn;            //학기 구분 [1 : 1학기 / 2 : 2학기 / 5 : 여름학기 / 6 : 겨울학기]
    let userNm;           //학생 이름
    let persNo;
  
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
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
  
    // 학생 이름 찾기
    await requestFunc.findUserName(xmls.findUserNmXML, axios)
    .then((res) => {
        console.log(res)
        let $ = cheerio.load(res.data, {
            xmlMode: true
        });
        userNm = $('Col[id="userNm"]').text();
        persNo = $('Col[id="persNo"]').text();
        
        console.log(persNo)
        
    
    })
    .catch((e) => {
      console.log(e);
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
  let findLiveStuNoXML = xmls.makeFindLiveStuNoXML(yy, tmGbn, id, userNm);

  // 외박 신청 내역 조회하기
  await requestFunc.findStayOutList(findLiveStuNoXML, axios)
  .then((res) =>{ 
    requestFunc.parseStayOutList(res, outStayFrDt, outStayToDt, outStayStGbn);
  })
  

}

login()