import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'usuario@empresa.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Contraseña (mínimo 8 caracteres)',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'employee',
    description: 'Rol del usuario',
    enum: ['admin', 'manager', 'employee'],
    default: 'employee',
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}
