import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEvaluationDto } from './create-evaluation.dto';

export class UpdateEvaluationDto extends PartialType(CreateEvaluationDto) {
  @ApiProperty({ required: false, description: 'Estado de publicación' })
  published?: boolean;
}
