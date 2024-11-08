import { Injectable, UnauthorizedException, Body } from '@nestjs/common';
import { AuthImplementation } from '../repository/implementations/auth.implementation';
import { UserEntity } from '../entities/user.entity';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly authImplementation: AuthImplementation) {}

  async register(user: UserEntity): Promise<UserDocument> {
    return this.authImplementation.register(user);
  }

 async login(user: UserEntity): Promise<{token:string}>{

  return  this.authImplementation.login(user);
 }

 async verifyToken(token: string) {
  try {
    return await this.authImplementation.verifyToken(token);
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}

async addFriends(body:{ accepterId: string; acceptedId: string;}){
  return this.authImplementation.addFriends(body)

}

async removeFriends(body:{ blockerId: string; blockedId: string;}){
  return this.authImplementation.removeFriends(body)

}
}
