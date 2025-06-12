import { ApiProperty } from '@nestjs/swagger';

class ChoiceSchema {
  @ApiProperty({
    description: 'ID único da alternativa',
    example: '550e8400-e29b-41d4-a716-446655440010'
  })
  id: string;

  @ApiProperty({
    description: 'Texto da alternativa',
    example: 'Esta é uma alternativa da questão'
  })
  text: string;

  @ApiProperty({
    description: 'Indica se esta alternativa é a resposta correta',
    example: true
  })
  isCorrect: boolean;
}

export class QuestionSchema {
  @ApiProperty({
    description: 'ID único da questão',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'Descrição da questão',
    example: 'Qual é a capital do Brasil?'
  })
  description: string;

  @ApiProperty({
    description: 'ID do autor da questão',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  authorId: string;

  @ApiProperty({
    description: 'Alternativas da questão',
    type: [ChoiceSchema],
    example: [
      { id: '550e8400-e29b-41d4-a716-446655440002', text: 'Rio de Janeiro', isCorrect: false },
      { id: '550e8400-e29b-41d4-a716-446655440003', text: 'São Paulo', isCorrect: false },
      { id: '550e8400-e29b-41d4-a716-446655440004', text: 'Brasília', isCorrect: true },
      { id: '550e8400-e29b-41d4-a716-446655440005', text: 'Salvador', isCorrect: false }
    ]
  })
  choices: ChoiceSchema[];
}
