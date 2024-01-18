export class SchoolFindDormitoryRewardsReqDto {
  yy: string;
  tmGbn: string;
  schregNo: string;
  stdKorNm: string;

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
  ): SchoolFindDormitoryRewardsReqDto {
    return new SchoolFindDormitoryRewardsReqDto(yy, tmGbn, schregNo, stdKorNm);
  }

  public toXmlForSchoolRequest(xml: string): string {
    return xml
      .replace('{yy}', this.yy)
      .replace(`{tmGbn}`, this.tmGbn)
      .replace(`{schregNo}`, this.schregNo)
      .replace(`{stdKorNm}`, this.stdKorNm);
  }
}
