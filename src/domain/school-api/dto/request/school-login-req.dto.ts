export class SchoolLoginReqDto {
  internalId: string;
  internalPw: string;
  readonly gubun: string = 'inter';

  private constructor(id: string, password: string) {
    this.internalId = id;
    this.internalPw = password;
  }

  public static of(id: string, password: string): SchoolLoginReqDto {
    return new SchoolLoginReqDto(id, password);
  }
}