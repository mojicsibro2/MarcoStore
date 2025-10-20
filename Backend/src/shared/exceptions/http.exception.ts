// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { isString } from 'class-validator';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  private readonly logger = new Logger('HttpException');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exceptionResponse.message;

    // Display Internal Server Error as error message if err is 500
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      // Log Exception
      this.logger.error(exception);

      message = 'Internal Server Error';
    }

    const errorResponse: Record<string, unknown> = {
      success: false,
      code: statusCode,
      message,
    };

    // Add errors property if exception is validation exception
    if (statusCode == HttpStatus.BAD_REQUEST && !isString(message)) {
      errorResponse.errors = message;
      errorResponse.message = exceptionResponse.error;
    }

    response.status(statusCode).json(errorResponse);
  }
}
