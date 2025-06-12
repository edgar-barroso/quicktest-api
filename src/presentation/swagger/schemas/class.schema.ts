import { ApiProperty } from '@nestjs/swagger';

class ClassStudentSchema {
  @ApiProperty({
    description: 'ID único do estudante',
    example: '550e8400-e29b-41d4-a716-446655440010'
  })
  id: string;

  @ApiProperty({
    description: 'Nome do estudante',
    example: 'Maria Silva'
  })
  name: string;
}

export class ClassSchema {
  @ApiProperty({
    description: 'ID único da turma',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'Título da turma',
    example: 'Matemática Básica - 2025.1'
  })
  title: string;

  @ApiProperty({
    description: 'Descrição da turma',
    example: 'Turma de matemática básica do primeiro semestre de 2025'
  })
  description: string;

  @ApiProperty({
    description: 'ID do professor da turma',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  teacherId: string;

  @ApiProperty({
    description: 'Lista de estudantes matriculados na turma',
    type: [ClassStudentSchema],
    example: [
      { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Pedro Almeida' },
      { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Ana Oliveira' },
      { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Carlos Santos' }
    ]
  })
  students: ClassStudentSchema[];
}
