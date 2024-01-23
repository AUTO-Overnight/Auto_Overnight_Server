import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationExceptionCode } from '../exception-code';

interface IValidationException {
  statusCode: number;
  errorCode: string;
  errors: ValidationError[];
}
export class ValidationException
  extends HttpException
  implements IValidationException
{
  statusCode: number;
  errorCode: string;
  errors: ValidationError[];
  constructor(errors: ValidationError[]) {
    super('', HttpStatus.BAD_REQUEST);
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.errorCode = ValidationExceptionCode.INVALID_VALUE;
    this.errors = errors;
  }
}
