import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamAttemptDto {
  @ApiProperty({
    description: 'ID do exame que será realizado',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsString()
  examId: string;

  @ApiProperty({
    description: 'Data e hora em que a tentativa foi iniciada',
    example: '2025-06-15T10:30:00Z',
    required: false
  })
  @IsOptional()
  startedAt?: Date;
}