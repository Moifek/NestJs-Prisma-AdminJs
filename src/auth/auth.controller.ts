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
  @Post('verifyGoogleUser')
  googleVerifyUser(@Req() req) {
    const token = req.body.idtoken;
    async function verify() {
      const client = await new OAuth2Client('1045820923007-flcvaen3bif5mb04cnof7nf5mmnot8i2.apps.googleusercontent.com','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','http://localhost:9000/#/signin');
      const tokenData = await client.getToken(token);
      console.log(tokenData)
      const ticket = await client.verifyIdToken({
          idToken: tokenData.tokens.id_token,
          audience: process.env['GOOGLE_CLIENT_ID'], // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      //console.log('payload:',payload);
      //console.log('userid:',userid);
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
    }
    verify().catch(console.error);
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

