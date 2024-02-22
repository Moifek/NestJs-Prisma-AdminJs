import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './JWT/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

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
  async googleAuth(@Req() req) {
    return HttpStatus.OK;}
  
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req,@Res() res) : Promise<any> {
    return this.authService.OAuthLogin(req,res);
  }
  
  @Post('googleLogin')
  @UseGuards(AuthGuard('google'))
  googleAuthLogin(@Req() req,@Res() res) : Promise<any> {
    res.header('Access-Control-Allow-Origin', '*');
    return this.authService.signIn(req,res);
  }


  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("/facebook/redirect")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req,@Res() res): Promise<any> {
    return this.authService.OAuthLogin(req,res);
  }
}

