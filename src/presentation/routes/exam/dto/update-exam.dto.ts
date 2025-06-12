import { IsOptional, IsString, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExamDto {
  @ApiProperty({
    description: 'Título do exame',
    example: 'Prova de Matemática - Funções',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Descrição do exame',
    example: 'Avaliação sobre funções de primeiro e segundo grau',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Lista de IDs das questões incluídas no exame',
    example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'],
    required: false
  })
  @IsOptional()
  @IsArray()
  questionsIds?: string[];

  @ApiProperty({
    description: 'Data de abertura do exame',
    example: '2025-06-15T10:00:00Z',
    required: false
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  openDate?: Date;

  @ApiProperty({
    description: 'Data de fechamento do exame',
    example: '2025-06-15T12:00:00Z',
    required: false
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  closeDate?: Date;
}