import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddAnswerDto {
  @ApiProperty({
    description: 'ID da questão respondida',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({
    description: 'ID da alternativa selecionada',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsString()
  @IsNotEmpty()
  choiceId: string;
}
