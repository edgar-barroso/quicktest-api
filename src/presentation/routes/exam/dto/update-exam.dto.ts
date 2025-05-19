import { IsOptional, IsString, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateExamDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  questionsIds?: string[];

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  openDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  closeDate?: Date;
}