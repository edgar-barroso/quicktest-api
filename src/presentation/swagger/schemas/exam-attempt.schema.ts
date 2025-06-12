import { ApiProperty } from '@nestjs/swagger';

class ExamAttemptAnswerSchema {
  @ApiProperty({
    description: 'ID da questão respondida',
    example: '550e8400-e29b-41d4-a716-446655440010'
  })
  questionId: string;

  @ApiProperty({
    description: 'ID da alternativa escolhida como resposta',
    example: '550e8400-e29b-41d4-a716-446655440011'
  })
  choiceId: string;
}

export class ExamAttemptSchema {
  @ApiProperty({
    description: 'ID único da tentativa de exame',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'ID do exame associado à tentativa',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  examId: string;

  @ApiProperty({
    description: 'ID do estudante que realizou a tentativa',
    example: '550e8400-e29b-41d4-a716-446655440002'
  })
  studentId: string;

  @ApiProperty({
    description: 'Data e hora de início da tentativa',
    example: '2025-06-01T10:30:00Z'
  })
  startedAt: string;

  @ApiProperty({
    description: 'Data e hora de término da tentativa',
    example: '2025-06-01T11:15:00Z',
    required: false,
    nullable: true
  })
  finishedAt: string | null;

  @ApiProperty({
    description: 'Indica se a tentativa foi concluída',
    example: true
  })
  finished: boolean;

  @ApiProperty({
    description: 'Pontuação obtida na tentativa (de 0 a 100)',
    example: 80,
    required: false,
    nullable: true
  })
  score: number | null;

  @ApiProperty({
    description: 'Lista de respostas do estudante',
    type: [ExamAttemptAnswerSchema],
    example: [
      { questionId: '550e8400-e29b-41d4-a716-446655440003', choiceId: '550e8400-e29b-41d4-a716-446655440013' },
      { questionId: '550e8400-e29b-41d4-a716-446655440004', choiceId: '550e8400-e29b-41d4-a716-446655440014' },
      { questionId: '550e8400-e29b-41d4-a716-446655440005', choiceId: '550e8400-e29b-41d4-a716-446655440015' }
    ]
  })
  answers: ExamAttemptAnswerSchema[];
}
