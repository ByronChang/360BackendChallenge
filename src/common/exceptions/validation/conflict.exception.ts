import { HttpStatus } from '@nestjs/common';
import { ApiBaseException } from '../base/api-base.exception';

export class ConflictException extends ApiBaseException {
  constructor(description: string, details?: string[]) {
    super(description, HttpStatus.CONFLICT, 'CONFLICT-001', details);
  }
}
