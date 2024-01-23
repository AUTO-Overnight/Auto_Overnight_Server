// GlobalException
export class GlobalExceptionCode {
  static UNCATCHED = 'G0000';
}

export class AuthExceptionCode {
  static AUTH_FAILED = 'A0000';
  static PROVIDED_USERNAME_AND_COOKIE_DO_NOT_MATCH = 'A0001';
}

export class UserExceptionCode {
  static FIND_USER_INFO_FAILED = 'U0000';
}

export class PointExceptionCode {
  static FIND_POINT_LIST_FAILED = 'P0000';
}
