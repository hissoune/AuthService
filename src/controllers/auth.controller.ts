import { Body, Controller, Get, Headers, Param, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../entities/user.entity";
import { UserDocument } from "../schemas/user.schema";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      phone: number;
    }
  ): Promise<UserDocument> {
    const userEntity = new UserEntity(
      
      body.email,
      body.password,
      body.name,
      body.phone
    );

    return this.authService.register(userEntity);
  }

  @Post("login")
  async login(
    @Body() body: { email: string; password: string }
  ): Promise<{token:string}> {
    const userEntity = new UserEntity(body.email, body.password);
    return this.authService.login(userEntity)
  }

  @Get('verify')
  async verifyToken(
    @Headers('authorization') authorization: string
  ): Promise<UserDocument> {
    if (!authorization) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authorization.split(' ')[1];
    return this.authService.verifyToken(token);
  }

  @Patch('add_friend')
  async addFriends(
    @Body() body:{accepterId:string,acceptedId:string}
  ):Promise<{msg:string}>{
     return this.authService.addFriends(body);
  }

  
}
