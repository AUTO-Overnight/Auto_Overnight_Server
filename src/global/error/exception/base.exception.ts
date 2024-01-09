import { HttpStatus } from '@nestjs/common';
import { GlobalExceptionCode } from '../exception-code';

export interface IBaseException {
  statusCode: number;
  errorCode: string;
  message: string;
}

export class BaseException implements IBaseException {
  statusCode: number;
  errorCode: string;
  message: string;

  constructor(statusCode: number, errorCode: string, message?: string) {
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    if (message) {
      this.message = message;
    }
  }
}
export class UnCatchedException extends BaseException {
  constructor() {
    super(HttpStatus.INTERNAL_SERVER_ERROR, GlobalExceptionCode.UNCATCHED);
  }
}

export class AuthFailedException extends BaseException {
  constructor(errorCode: string, message?: string) {
    super(HttpStatus.UNAUTHORIZED, errorCode, message);
  }
}

export class InternalServerException extends BaseException {
  constructor(errorCode: string, message?: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, errorCode, message);
  }
}
