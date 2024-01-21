export class SchoolFindStayoutApplyListResDto {
  stayOutStartDate: string[];
  stayOutEndDate: string[];
  stayOutApproval: string[];

  private constructor() {
    this.stayOutStartDate = [];
    this.stayOutEndDate = [];
    this.stayOutApproval = [];
  }

  public static of(): SchoolFindStayoutApplyListResDto {
    return new SchoolFindStayoutApplyListResDto();
  }

  public addNewOne(startDate: string, endDate: string, approval: string): void {
    this.stayOutStartDate.push(startDate);
    this.stayOutEndDate.push(endDate);
    this.stayOutApproval.push(approval);
  }
}
