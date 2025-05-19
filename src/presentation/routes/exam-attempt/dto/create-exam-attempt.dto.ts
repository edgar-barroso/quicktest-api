import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExamAttemptDto {
  @IsNotEmpty()
  @IsString()
  examId: string;

  @IsOptional()
  startedAt?: Date;
}