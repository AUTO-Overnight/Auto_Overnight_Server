import cheerio from "cheerio";

// 학생 이름 찾기
export function findUserName(findUserNameXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/com/SsoCtr/findMyGLIOList.do?menuId=MPB0022&pgmId=PPB0021", findUserNameXML)
}

// 년도, 학기 찾기
export function findYYtmgbn(findYYtmgbnXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findYyTmGbnList.do?menuId=MPB0022&pgmId=PPB0021", findYYtmgbnXML)
}

// 생활관 거주 학생 구분 번호 찾기
export function findLiveStuNo(findLiveStuNoXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findMdstrmLeaveAplyList.do?menuId=MPB0022&pgmId=PPB0021", findLiveStuNoXML) 
}

// 외박 신청 하기
export function sendStayOut(sendStayOutXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/aff/dorm/DormCtr/saveOutAplyList.do?menuId=MPB0022&pgmId=PPB0021", sendStayOutXML)
}

// 외박 신청 내역 출력 -> findLiveStuNoXML과 xml 폼이 똑같아서 재활용
export function findStayOutList(findLiveStuNoXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findStayAplyList.do?menuId=MPB0022&pgmId=PPB0021", findLiveStuNoXML)
}

// 상벌점 내역 출력
export function findPointList(findPointListXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findFindArdListList.do?menuId=MPB0024&pgmId=PPB0023", findPointListXML)
}

// 외박 신청 내역 파싱해서 정리
export function parseStayOutList(response, outStayFrDt, outStayToDt, outStayStGbn) {
    let $ = cheerio.load(response.data, {
      xmlMode: true
    });

    $('Col[id="outStayFrDt"]').each((key , val)=> {
      outStayFrDt.push($(val).text());
    });

    $('Col[id="outStayToDt"]').each((key , val)=> {
      outStayToDt.push($(val).text());
    });

    $('Col[id="outStayStGbn"]').each((key , val)=> {
      outStayStGbn.push($(val).text());
    });

}

// 에러 메세지 출력
export function makeErrorResponse(message, errorName, errorMessage, status, callback) {
  const body = {
    message,
    "errorname": errorName,
    "errormessage": errorMessage
  };
  
  callback(null, {
    statusCode : status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export function checkStatusCode(code, callback) {
  if (code !== 200) 
    makeErrorResponse("학교 홈페이지 에러", "", "", code, callback);
}