const cheerio = require('cheerio');

// 학생 이름 찾기
function findUserName(findUserNameXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/com/SsoCtr/findMyGLIOList.do?menuId=MPB0022&pgmId=PPB0021", findUserNameXML)
}

// 년도, 학기 찾기
function findYYtmgbn(findYYtmgbnXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findYyTmGbnList.do?menuId=MPB0022&pgmId=PPB0021", findYYtmgbnXML)
}

// 생활관 거주 학생 구분 번호 찾기
function findLiveStuNo(findLiveStuNoXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findMdstrmLeaveAplyList.do?menuId=MPB0022&pgmId=PPB0021", findLiveStuNoXML) 
}

// 외박 신청 하기
function sendStayOut(sendStayOutXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/aff/dorm/DormCtr/saveOutAplyList.do?menuId=MPB0022&pgmId=PPB0021", sendStayOutXML)
}

// 외박 신청 내역 출력 -> findLiveStuNoXML과 xml 폼이 똑같아서 재활용
function findStayOutList(findLiveStuNoXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findStayAplyList.do?menuId=MPB0022&pgmId=PPB0021", findLiveStuNoXML)
}

// 상벌점 내역 출력
function findPointList(findPointListXML, axiosInstance) {
    return axiosInstance.post("https://dream.tukorea.ac.kr/aff/dorm/DormCtr/findFindArdListList.do?menuId=MPB0024&pgmId=PPB0023", findPointListXML)
}

// 외박 신청 내역 파싱해서 정리
function parseStayOutList(response, outStayFrDt, outStayToDt, outStayStGbn) {
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
function makeErrorResponse(message, callback) {
    callback(null, { statusCode: 404, body: message, headers: { 'Content-Type': 'text/plain' } });
}

exports.findUserName = findUserName;
exports.findYYtmgbn = findYYtmgbn;
exports.findLiveStuNo = findLiveStuNo;
exports.sendStayOut = sendStayOut;
exports.findStayOutList = findStayOutList;
exports.findPointList = findPointList;
exports.parseStayOutList = parseStayOutList;
exports.makeErrorResponse = makeErrorResponse;