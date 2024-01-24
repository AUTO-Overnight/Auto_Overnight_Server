export class SchoolFindStayOutRequestsReqDto {
  yy: string; // 연도
  tmGbn: string; // 학기
  schregNo: string; // 학번
  stdKorNm: string; // 이름

  private constructor(
    yy: string,
    tmGbn: string,
    schregNo: string,
    stdKorNm: string,
  ) {
    this.yy = yy;
    this.tmGbn = tmGbn;
    this.schregNo = schregNo;
    this.stdKorNm = stdKorNm;
  }

  public static of(
    yy: string,
    tmGbn: string,
    schregNo: string,
    stdKorNm: string,
  ): SchoolFindStayOutRequestsReqDto {
    return new SchoolFindStayOutRequestsReqDto(yy, tmGbn, schregNo, stdKorNm);
  }

  public toXmlForSchoolRequest(xml: string): string {
    return xml
      .replace('{yy}', this.yy)
      .replace(`{tmGbn}`, this.tmGbn)
      .replace(`{schregNo}`, this.schregNo)
      .replace(`{stdKorNm}`, this.stdKorNm);
  }
}
