import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  log(message: any, stack?: string, context?: string) {
    super.log(message, stack, context);
    // TODO: 부가 로직 추가
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
    // TODO: 부가 로직 추가
  }

  warn(message: any, stack?: string, context?: string) {
    super.warn(message, stack, context);
    // TODO: 부가 로직 추가
  }
}
