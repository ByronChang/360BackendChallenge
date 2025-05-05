import { HttpStatus } from '@nestjs/common';
import { ApiBaseException } from '../base/api-base.exception';

export class NotFoundException extends ApiBaseException {
  constructor(resource: string) {
    super(`${resource} no encontrado`, HttpStatus.NOT_FOUND, 'NOTFOUND-001');
  }
}
