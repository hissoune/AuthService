import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/AuthService'),

    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
