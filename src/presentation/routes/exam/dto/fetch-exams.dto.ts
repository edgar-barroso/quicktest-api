import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FetchExamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageLength?: number = 10;
}