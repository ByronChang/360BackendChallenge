import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
//import { Type } from 'class-transformer';

class CompetencyDto {
  @ApiProperty({
    example: 'comunicación',
    description: 'Nombre de la competencia',
  })
  @IsString()
  @IsNotEmpty()
  competency: string;

  @ApiProperty({
    example: ['Se comunica claramente', 'Escucha activamente'],
    description: 'Preguntas para la competencia',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  questions: string[];
}

export class CreateEvaluationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  department: string;

  @IsArray()
  @ValidateNested({ each: true })
  competencies: CompetencyDto[];

  @IsOptional()
  dueDate?: Date;

  @IsString()
  @IsNotEmpty()
  evaluationType: string;
}
