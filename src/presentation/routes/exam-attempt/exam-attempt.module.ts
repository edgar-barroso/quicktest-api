import { Module } from '@nestjs/common';
import { ExamAttemptController } from './exam-attempt.controller';
import { DatabaseModule } from '@/presentation/globals/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ExamAttemptController],
  providers: [],
})
export class ExamAttemptModule {}