import { IsOptional, IsArray, ValidateNested,IsBoolean, IsString  } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChoiceDto {
  @ApiProperty({
    description: 'Texto da alternativa',
    example: 'Esta é uma alternativa da questão',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Indica se esta alternativa é a resposta correta',
    example: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  isCorrect: boolean;
}

export class UpdateQuestionDto {
  @ApiProperty({
    description: 'Descrição da questão',
    example: 'Qual é a capital do Brasil?',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Alternativas da questão',
    type: [ChoiceDto],
    required: false,
    example: [
      { text: 'Rio de Janeiro', isCorrect: false },
      { text: 'São Paulo', isCorrect: false },
      { text: 'Brasília', isCorrect: true },
      { text: 'Salvador', isCorrect: false }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices?: ChoiceDto[];
}
