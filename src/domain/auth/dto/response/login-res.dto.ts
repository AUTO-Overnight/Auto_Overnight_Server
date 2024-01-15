export class LoginResDto {
  cookies: string;
  name: string;
  outStayFrDt: string[];
  outStayStGbn: string[];
  outStayToDt: string[];
  semester: string;
  year: string;

  private constructor(
    cookies: string,
    name: string,
    semester: string,
    year: string,
  ) {
    this.cookies = cookies;
    this.name = name;
    this.outStayFrDt = null;
    this.outStayStGbn = null;
    this.outStayToDt = null;
    this.semester = semester;
    this.year = year;
  }
  public static of(
    cookies: string,
    name: string,
    semester: string,
    year: string,
  ): LoginResDto {
    return new LoginResDto(cookies, name, semester, year);
  }
}
