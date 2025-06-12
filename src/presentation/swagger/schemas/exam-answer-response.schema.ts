import { ApiProperty } from '@nestjs/swagger';

export class ExamAnswerResponseSchema {
  @ApiProperty({
    description: 'ID único da tentativa de exame',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'ID do exame',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  examId: string;

  @ApiProperty({
    description: 'ID do estudante',
    example: '550e8400-e29b-41d4-a716-446655440002'
  })
  studentId: string;

  @ApiProperty({
    description: 'ID da questão respondida',
    example: '550e8400-e29b-41d4-a716-446655440003'
  })
  questionId: string;

  @ApiProperty({
    description: 'ID da alternativa selecionada',
    example: '550e8400-e29b-41d4-a716-446655440004'
  })
  choiceId: string;

  @ApiProperty({
    description: 'Mensagem de confirmação',
    example: 'Resposta adicionada com sucesso'
  })
  message: string;
}
