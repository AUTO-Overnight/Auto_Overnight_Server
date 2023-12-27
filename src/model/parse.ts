// 디렉토리 구조를 위한 임시 파일입니다.
interface StayOutList {
  OutStayFrDt: string[];
  OutStayToDt: string[];
  OutStayStGbn: string[];
}

// PointList Structure to parse and store reward/punishment details
interface PointList {
  CmpScr: string[];
  LifSstArdGbn: string[];
  ArdInptDt: string[];
  LifSstArdCtnt: string[];
}

// Structure to store year, semester, student number, and student name for sending RequestInfo request
interface RequestInfo {
  YY: string;
  TmGbn: string;
  SchregNo: string;
  StdKorNm: string;
}
