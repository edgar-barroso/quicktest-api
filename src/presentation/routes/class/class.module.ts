import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { DatabaseModule } from '@/presentation/globals/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ClassController],
  providers: [],
})
export class ClassModule {}