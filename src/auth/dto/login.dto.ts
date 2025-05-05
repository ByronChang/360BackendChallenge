import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@empresa.com',
    description: 'Email registrado',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Contraseña' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
