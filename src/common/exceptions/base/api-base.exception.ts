import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class ApiBaseException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    public code: string,
    public details?: string[],
  ) {
    super({ message, code, details }, status);
  }
}
