export class SchoolFindDormitoryStudentInfoResDto {
  score: string[];
  scoreType: string[];
  date: string[];
  content: string[];

  private constructor() {
    this.score = [];
    this.scoreType = [];
    this.date = [];
    this.content = [];
  }

  public static of(): SchoolFindDormitoryStudentInfoResDto {
    return new SchoolFindDormitoryStudentInfoResDto();
  }

  public addNewOne(
    score: string,
    scoreType: string,
    date: string,
    content: string,
  ): void {
    this.score.push(score);
    this.scoreType.push(scoreType);
    this.date.push(date);
    this.content.push(content);
  }
}
