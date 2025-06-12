import { ApiProperty } from '@nestjs/swagger';

class ExamQuestionSchema {
  @ApiProperty({
    description: 'ID único da questão',
    example: '550e8400-e29b-41d4-a716-446655440010'
  })
  id: string;
}

export class ExamSchema {
  @ApiProperty({
    description: 'ID único do exame',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'Título do exame',
    example: 'Avaliação Final - Matemática Básica'
  })
  title: string;

  @ApiProperty({
    description: 'Descrição do exame',
    example: 'Avaliação final da disciplina de matemática básica'
  })
  description: string;

  @ApiProperty({
    description: 'ID do autor do exame',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  authorId: string;

  @ApiProperty({
    description: 'ID da turma associada ao exame',
    example: '550e8400-e29b-41d4-a716-446655440002'
  })
  classId: string;

  @ApiProperty({
    description: 'Data de abertura do exame',
    example: '2025-06-01T10:00:00Z'
  })
  openDate: string;

  @ApiProperty({
    description: 'Data de fechamento do exame',
    example: '2025-06-01T12:00:00Z'
  })
  closeDate: string;

  @ApiProperty({
    description: 'Lista de questões do exame',
    type: [ExamQuestionSchema],
    example: [
      { id: '550e8400-e29b-41d4-a716-446655440003' },
      { id: '550e8400-e29b-41d4-a716-446655440004' },
      { id: '550e8400-e29b-41d4-a716-446655440005' }
    ]
  })
  questions: ExamQuestionSchema[];
}
