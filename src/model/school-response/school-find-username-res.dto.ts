export class SchoolFindUsernameResDto {
  username: string;
  userStudentId: string;

  private constructor(username: string, userStudentId: string) {
    this.username = username;
    this.userStudentId = userStudentId;
  }

  public static of(username: string, userStudentId: string): SchoolFindUsernameResDto {
    return new SchoolFindUsernameResDto(username, userStudentId);
  }
}