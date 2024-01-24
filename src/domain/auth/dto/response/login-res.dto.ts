export class LoginResDto {
  cookies: string;
  name: string;

  private constructor(cookies: string, name: string) {
    this.cookies = cookies;
    this.name = name;
  }
  public static of(cookies: string, name: string): LoginResDto {
    return new LoginResDto(cookies, name);
  }
}
