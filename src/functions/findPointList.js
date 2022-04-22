'use strict';

import xmls from "../xmls.js";
import requestFunc from "../requestFunc.js";
import cheerio from "cheerio";

export default async function findPointListFunction(axios, userNm, callback) {
    
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
  
  // 상벌점 내역 조회 위한 xml 만들기
  let findPointListXML = xmls.makeFindPointListXML(yy, tmGbn, persNo, userNm);

  // 상벌점 내역 조회 요청
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

  return body;

}