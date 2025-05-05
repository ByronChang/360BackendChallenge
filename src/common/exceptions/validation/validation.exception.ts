import { HttpStatus } from '@nestjs/common';
import { ApiBaseException } from '../base/api-base.exception';

export class ValidationException extends ApiBaseException {
  constructor(description: string, details?: string[]) {
    super(description, HttpStatus.BAD_REQUEST, 'VALID-001', details);
  }
}
