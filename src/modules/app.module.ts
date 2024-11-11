import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/AuthService'),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_EMAIL_PASS,
        },
      },
      defaults: {
        from: `"${process.env.APP_EMAIL_USERNAME}" <${process.env.APP_EMAIL}>`,
      },
    }),


    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
