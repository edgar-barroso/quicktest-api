import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class FetchQuestionsDto {
  @Type(() => Number)
  @IsInt()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageLength?: number = 10;
}