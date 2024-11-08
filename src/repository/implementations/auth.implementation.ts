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

      async addFriends(body: { accepterId: string; acceptedId: string }): Promise<{ msg: string }> {
        const { accepterId, acceptedId } = body;
    
        try {
            await this.userModel.findByIdAndUpdate(
                accepterId,
                { $addToSet: { friends: acceptedId } }, 
                { new: true } 
            );
    
            await this.userModel.findByIdAndUpdate(
                acceptedId,
                { $addToSet: { friends: accepterId } },
                { new: true }
            );
    
            return { msg: 'Friends added successfully' };
        } catch (error) {
            throw new Error(`Error adding friends: ${error.message}`);
        }
    }

    async removeFriends(body: any): Promise<{ msg: string }> {
        const { blockerId, blockedId } = body;
    
        try {
            await this.userModel.findByIdAndUpdate(
                blockerId,
                { $pull: { friends: blockedId } }, 
                { new: true } 
            );
    
            await this.userModel.findByIdAndUpdate(
                blockedId,
                { $pull: { friends: blockerId } },
                { new: true }
            );
    
            return { msg: 'Friends removed successfully' };
        } catch (error) {
            throw new Error(`Error removing friends: ${error.message}`);
        }
    }
}
