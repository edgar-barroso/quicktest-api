import { IsNotEmpty, IsString, IsArray, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({
    description: 'Título do exame',
    example: 'Prova de Matemática - Funções'
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descrição do exame',
    example: 'Avaliação sobre funções de primeiro e segundo grau'
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Lista de IDs das questões incluídas no exame',
    example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001']
  })
  @IsNotEmpty()
  @IsArray()
  questionsIds: string[];

  @ApiProperty({
    description: 'ID da turma associada ao exame',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({
    description: 'Data de abertura do exame',
    example: '2025-06-15T10:00:00Z'
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  openDate: Date;

  @ApiProperty({
    description: 'Data de fechamento do exame',
    example: '2025-06-15T12:00:00Z'
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  closeDate: Date;
}