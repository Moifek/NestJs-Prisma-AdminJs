import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignInDto } from './dto/signIn.dto.js';
import { UsersService } from '../users/users.service.js';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './JWT/jwt-auth.guard.js';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.pass);
  }
  
  @HttpCode(HttpStatus.OK)
  //@UseGuards(AuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('findUsers')
  findAll(@Req() req: Request) {
    return this.userService.findAll();
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req)
  }
}
