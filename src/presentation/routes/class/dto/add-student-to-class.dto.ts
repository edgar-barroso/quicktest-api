import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddStudentToClassDto {
  @ApiProperty({
    description: 'ID do aluno a ser adicionado à turma',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsString()
  studentId: string;
}