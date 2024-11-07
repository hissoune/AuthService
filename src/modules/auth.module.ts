import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthImplementation } from '../repository/implementations/auth.implementation';
import { User, UserModelSchema } from '../schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService,ConfigModule } from '@nestjs/config';

@Module({
  imports: [
   
    MongooseModule.forFeature([{ name: User.name, schema: UserModelSchema }]),

    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1h' },
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthImplementation],
  exports: [AuthImplementation],
})
export class AuthModule {}