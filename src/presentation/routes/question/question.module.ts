import { DatabaseModule } from '@/presentation/globals/database.module';
import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/env';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [QuestionController],
  providers: [],
})
export class QuestionModule {}
