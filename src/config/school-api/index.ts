export const SCHOOL_URL = 'https://dream.tukorea.ac.kr/';
export const SCHOOL_API_COOKIE_SESSION_KEY: string = 'JSVSESSIONID';

export const schoolRequestUrl = {
  LOGIN: 'https://ksc.tukorea.ac.kr/sso/login_proc.jsp?returnurl=null',
  SESSION: SCHOOL_URL + 'com/SsoCtr/initPageWork.do?loginGbn=sso&loginPersNo=',
  YEAR_SEMESTER:
    SCHOOL_URL +
    'aff/dorm/DormCtr/findYyTmGbnList.do?menuId=MPB0022&pgmId=PPB0021',
  NAME_ID:
    SCHOOL_URL + 'com/SsoCtr/findMyGLIOList.do?menuId=MPB0022&pgmId=PPB0021',
  APPLY_LIST:
    SCHOOL_URL +
    'aff/dorm/DormCtr/findStayAplyList.do?menuId=MPB0022&pgmId=PPB0021',
  REWARD_LIST:
    SCHOOL_URL +
    'aff/dorm/DormCtr/findFindArdListList.do?menuId=MPB0024&pgmId=PPB0023',
  DORM_STUDENT_ID:
    SCHOOL_URL +
    'aff/dorm/DormCtr/findMdstrmLeaveAplyList.do?menuId=MPB0022&pgmId=PPB0021',
  SEND_APPLY:
    SCHOOL_URL +
    'aff/dorm/DormCtr/saveOutAplyList.do?menuId=MPB0022&pgmId=PPB0021',
};

export const x_www_form_urlencoded_RequestHeader = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

export const xml_RequestHeader = {
  'Content-Type': 'text/xml',
};

// 1: 1학기, 2: 2학기, 5: 여름학기, 6: 겨울학기
export const semesterCode = ['1', '2', '5', '6'];

// 학교 api 에러코드에 대한 타입
export const schoolApiErrorCode = {
  NORMAL: '0',
  INVALID_COOKIE: '-600',
};
export type SchoolApiErrorCode =
  (typeof schoolApiErrorCode)[keyof typeof schoolApiErrorCode];

// 외박 승인 여부 코드 타입
export const stayOutApprovalCode = {
  APPROVED: '2',
  REJECTED: '1',
};
export type StayOutApprovalCode =
  (typeof stayOutApprovalCode)[keyof typeof stayOutApprovalCode];
