import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassDto {
  @ApiProperty({
    description: 'Título da turma',
    example: 'Matemática - Turma A',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Descrição da turma',
    example: 'Turma de Matemática do 9º ano, período matutino',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}