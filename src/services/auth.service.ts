import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthImplementation } from '../repository/implementations/auth.implementation';
import { UserEntity } from '../entities/user.entity';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly authImplementation: AuthImplementation) {}

  async register(user: UserEntity): Promise<UserDocument> {
    return this.authImplementation.register(user);
  }

  async login(user: UserEntity): Promise<{ token: string }> {
    return this.authImplementation.login(user);
  }

  async verifyToken(token: string) {
    try {
      return await this.authImplementation.verifyToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async forgotPassword(email: string): Promise<{ email: string }> {
    return this.authImplementation.forgotPassword(email);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<{ message: string }> {
    try {
      return await this.authImplementation.resetPassword(resetToken, newPassword);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid or expired reset token');
      } else {
        throw new BadRequestException('An error occurred during password reset');
      }
    }
  }
}
