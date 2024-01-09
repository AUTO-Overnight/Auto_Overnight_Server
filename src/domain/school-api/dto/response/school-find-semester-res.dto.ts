export class SchoolFindSemesterResDto {
  year: string;
  semester: string;

  private constructor(year: string, semester: string) {
    this.year = year;
    this.semester = semester;
  }

  public static of(year: string, semester: string): SchoolFindSemesterResDto {
    return new SchoolFindSemesterResDto(year, semester);
  }
}