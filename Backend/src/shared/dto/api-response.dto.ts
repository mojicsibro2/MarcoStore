export class ApiResponseDto<T> {
  public message: string;
  public data: T;

  constructor(message: string = 'Successful', data: T) {
    this.message = message;
    this.data = data;
  }
}
