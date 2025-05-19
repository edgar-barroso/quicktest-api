import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './presentation/routes/user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule],
  controllers: [],
})
export class AppModule {}
