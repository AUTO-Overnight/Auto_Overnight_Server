# Auto_Overnight_API

전부 post 사용

login///////////////////////////

input : id, password

return {
    statusCode: 200,

    cookies: cookies( 예시 : '_SSO_Global_Logout_url=get%5Ehttps%3A%2F%2Fportal.kpu.ac.kr%3A443%2Fsso%2Flogout.jsp%24get%5Ehttps%3A%2F%2Fiis.kpu.ac.kr%3A443%2Fcom%2FSsoCtr%2Fj_logout.do%24; kalogin=WrZ4RIxYqeHryg==$server; JSESSIONID=f31FNbSitaFk0AkfuEwpUgqbkatUmmYGvvhakQT0Y97VSxEzp7ZtTOK0GCOy4FUO.amV1c19kb21haW4vanN2XzI=\r\n')

    name: userNm,
    stayoutlist: response(XML 형태)
};

sendStayOut/////////////////////

input : date, outStayAplyDt, cookies
외박 날짜, 오늘날짜, 쿠키

return {
    statusCode: 200,
    message: 정상적으로 완료됨
}

findStayOutList/////////////////

input : yy, tmGbn, schregNo, userNm, cookies
년도, 학기, 학번, 학생이름, 쿠키

return {
    statusCode: 200,
    stayoutlist: response(XML 형태)
}

findPointList///////////////////

input : yy, tmGbn, schregNo, userNm, cookies
년도, 학기, 학번, 학생이름, 쿠키

return {
    statusCode: 200,
    pointlist: response(XML 형태)
}
