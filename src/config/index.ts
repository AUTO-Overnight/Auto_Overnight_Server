export const SCHOOL_URL = 'https://dream.tukorea.ac.kr/';

export const schoolUrl = {
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
