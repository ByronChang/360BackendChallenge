import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class CompetencyResponseDto {
  @ApiProperty({ description: 'Nombre de la competencia' })
  @IsString()
  @IsNotEmpty()
  competency: string;

  @ApiProperty({
    description: 'Respuestas (valores del 1 al 5)',
    type: [Number],
    minimum: 1,
    maximum: 5,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  responses: number[];
}

export class CreateEvaluationRecordDto {
  @IsMongoId()
  evaluation: string;

  @IsMongoId()
  evaluatedUser: string;

  @IsMongoId()
  evaluator: string;

  @IsArray()
  @ValidateNested({ each: true })
  responses: CompetencyResponseDto[];

  @IsString()
  @IsNotEmpty()
  comments?: string;
}
