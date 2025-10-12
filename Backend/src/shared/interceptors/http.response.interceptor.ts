import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';
import { Response } from 'express';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  /**
   * Intercepts and transforms the HTTP response.
   * @param context The execution context.
   * @param next The call handler.
   * @returns An observable containing the transformed response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: ApiResponseDto<any> | any) => {
        // throw exception if response is an error
        if (
          data instanceof Error ||
          /* if its instance of ApiResponseDto, grab the data from ApiResponseDto.data*/
          data?.data instanceof Error
        ) {
          if (data instanceof ApiResponseDto) {
            throw data?.data;
          }

          throw data;
        }

        const getResponse = context.switchToHttp().getResponse<Response>();

        if (
          getResponse.statusCode === 201 &&
          context.switchToHttp().getRequest().method === 'POST'
        ) {
          getResponse.status(200); // Modify status code to 200 OK
        }

        // Construct the response object
        const response: Record<string, any> = {
          status: true,
          code: getResponse.statusCode,
          message: 'Successful',
          data: data,
        };

        // If the data is an instance of ApiResponseDto, override the message and data fields
        if (data instanceof ApiResponseDto) {
          response.message = data.message;
          response.data = data.data;
        }

        return response;
      }),
      catchError((error) => {
        // Handle error responses here
        return throwError(error);
      }),
    );
  }
}
