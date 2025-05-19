import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateExamAttemptDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto) 
  answers: AnswerDto[];

  @IsOptional()
  @IsBoolean()
  finished?: boolean;
}


class AnswerDto {
  @IsString()
  questionId: string;

  @IsString()
  choiceId: string;
}