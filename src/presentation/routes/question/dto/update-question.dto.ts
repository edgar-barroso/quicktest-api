// ChoiceDto
import { IsOptional, IsArray, ValidateNested,IsBoolean, IsString  } from 'class-validator';
import { Type } from 'class-transformer';

export class ChoiceDto {
  @IsString()
  text: string;

  @Type(() => Boolean)
  @IsBoolean()
  isCorrect: boolean;
}

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices?: ChoiceDto[];
}
