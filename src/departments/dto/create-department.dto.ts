import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Nombre del departamento',
    example: 'Desarrollo Backend',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID del usuario manager (debe tener rol manager)',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  manager: string;
}
