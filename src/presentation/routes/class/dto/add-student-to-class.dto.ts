import { IsNotEmpty, IsString } from 'class-validator';

export class AddStudentToClassDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;
}