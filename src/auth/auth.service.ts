import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../Models/user.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn({username,pass,session,userId} : {username?: string, pass?: string, session?:string, userId? : string}): Promise<any> {
    try {
      let user : User = null;
      if(session){
        const userIdInt : number = Number.parseInt(userId);
        console.log('--------------------')
        console.log(userIdInt)
        console.log('--------------------')
        user = await this.userService.findOne(userIdInt);
        
      }else{
        user = await this.userService.findOne(username);
        if (user.password !== pass) {
          throw new UnauthorizedException();
        }
      }
      const { password, ...result } = user;
      const payload = { sub: user.id, username: user.userName };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env['JWT_SECRET'],
      });
      return {
        user,
        token,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.FORBIDDEN, {
        cause: error,
        description: '',
      });
    }
  }
   async OAuthLogin(req,res,from:string) {
    if (!req.user) {
      return 'No user from google';
    }
      let {user} = req;
      if(user.user){
        user = user.user;
      }
      if(from === 'google'){
        user.password = req.user.googleAccount.googleAccessToken;        
      }else{
        user.password = 'facebookPassword';
      }
    const dbUser : User = await this.userService.findOne(user.firstName);
    if (dbUser === undefined) this.userService.create(user);
    else console.log('---: USER EXISTS ALREADY :---');
    const response = {
      sessionId: req.sessionID,
    };
    if(from === 'facebook'){
      res.redirect('http://localhost:9000/#/signin?userId=' + dbUser.id + '&Session=' + req.sessionID);
    }else{
      res.redirect('http://localhost:9000/#/signin?userId=' + dbUser.id + '&Session=' + req.sessionID);
    }
    return response;
  }
}
