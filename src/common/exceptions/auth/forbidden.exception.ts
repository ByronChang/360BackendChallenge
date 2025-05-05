import { HttpStatus } from '@nestjs/common';
import { ApiBaseException } from '../base/api-base.exception';

export class ForbiddenException extends ApiBaseException {
  constructor(message = 'Acceso prohibido', details?: string[]) {
    super(message, HttpStatus.FORBIDDEN, 'AUTH-002', details);
  }
}
