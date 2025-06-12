import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Função do usuário no sistema',
    enum: ['STUDENT', 'TEACHER'],
    example: 'STUDENT',
  })
  @IsNotEmpty()
  @IsEnum(['STUDENT', 'TEACHER'])
  role: string;
}
