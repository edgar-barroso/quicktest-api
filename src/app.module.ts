import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './presentation/routes/user/user.module';
import { QuestionModule } from './presentation/routes/question/question.module';
import { ExamModule } from './presentation/routes/exam/exam.module';
import { ClassModule } from './presentation/routes/class/class.module';
import { ExamAttemptModule } from './presentation/routes/exam-attempt/exam-attempt.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    QuestionModule,
    ExamModule,
    ClassModule,
    ExamAttemptModule
  ],
  controllers: [],
})
export class AppModule {}
