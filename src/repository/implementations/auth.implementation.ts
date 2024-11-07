import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { UserEntity } from '../../entities/user.entity';
import { AuthInterface } from "../interfaces/auth.interface";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

export class AuthImplementation implements AuthInterface {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) { }

    async register(userEntity: UserEntity): Promise<UserDocument> {
        const saltRounds = 10;
        userEntity.password = await bcrypt.hash(userEntity.password, saltRounds);
        const createdUser = new this.userModel(userEntity);
        return createdUser.save();
    }


    async login(userEntity: UserEntity): Promise<{  token: string }> {

         
        const user = await this.userModel.findOne({ email: userEntity.email });
    if (!user) {

        throw new Error('Invalid credentials');
      }
    const isPasswordValid = await bcrypt.compare(userEntity.password, user.password); 

    if (!isPasswordValid) {

        throw new Error('Invalid credentials');
    }
       
    const token = this.jwtService.sign({ id: user._id, email: user.email });


   return {token} ;
    }

    async verifyToken(token: string) {
        try {
          const decoded = this.jwtService.verify(token); 
          const user = await this.userModel.findById(decoded.id); 
          if (!user) throw new UnauthorizedException('User not found');
          return user;
        } catch (error) {
          throw new UnauthorizedException('Token validation failed');
        }
      }
}
