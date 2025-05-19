import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { DatabaseModule } from '@/presentation/globals/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ExamController],
  providers: [],
})
export class ExamModule {}
