import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ChoiceDto {
  @ApiProperty({
    description: 'Texto da alternativa',
    example: 'Esta é uma alternativa da questão',
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Indica se esta alternativa é a resposta correta',
    example: true,
  })
  @IsNotEmpty()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Descrição da questão',
    example: 'Qual é a capital do Brasil?',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Alternativas da questão',
    type: [ChoiceDto],
    example: [
      { text: 'Rio de Janeiro', isCorrect: false },
      { text: 'São Paulo', isCorrect: false },
      { text: 'Brasília', isCorrect: true },
      { text: 'Salvador', isCorrect: false }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices: ChoiceDto[];
}