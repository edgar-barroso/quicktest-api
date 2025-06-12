import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AnswerDto {
  @ApiProperty({
    description: 'ID da questão respondida',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  questionId: string;

  @ApiProperty({
    description: 'ID da alternativa selecionada',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsString()
  choiceId: string;
}

export class UpdateExamAttemptDto {
  @ApiProperty({
    description: 'Lista de respostas do aluno',
    type: [AnswerDto],
    example: [
      { 
        questionId: '550e8400-e29b-41d4-a716-446655440000', 
        choiceId: '550e8400-e29b-41d4-a716-446655440001'
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto) 
  answers: AnswerDto[];

  @ApiProperty({
    description: 'Indica se o exame foi finalizado',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  finished?: boolean;
}