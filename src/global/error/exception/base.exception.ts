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
    super(HttpStatus.INTERNAL_SERVER_ERROR, GlobalExceptionCode.UnCached);
  }
}
