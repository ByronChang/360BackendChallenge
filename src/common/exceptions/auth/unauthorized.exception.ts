import { HttpStatus } from '@nestjs/common';
import { ApiBaseException } from '../base/api-base.exception';

export class UnauthorizedException extends ApiBaseException {
  constructor(message = 'No autorizado', details?: string[]) {
    super(message, HttpStatus.UNAUTHORIZED, 'AUTH-001', details);
  }
}
