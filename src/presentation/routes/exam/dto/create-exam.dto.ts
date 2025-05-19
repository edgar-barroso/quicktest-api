import { IsNotEmpty, IsString, IsArray, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  questionsIds: string[];

  @IsNotEmpty()
  @IsString()
  classId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  openDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  closeDate: Date;
}