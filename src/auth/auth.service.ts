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
  async signIn(username: string, pass: string): Promise<any> {
    try {
      const user: User = await this.userService.findOne(username);
      if (user.password !== pass) {
        throw new UnauthorizedException();
      }
      const { password, ...result } = user;
      const payload = { sub: user.id, username: user.userName };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env['JWT_SECRET'],
      });
      return {
        server_jwt_token: token,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.FORBIDDEN, {
        cause: error,
        description: '',
      });
    }
  }
   async OAuthLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
      let {user} = req;
      if(user.user){
        user = user.user;
      }
      user.password = 'googlePassword';
    const dbUser : User = await this.userService.findOne(user.firstName);
    if (dbUser === undefined) this.userService.create(user);
    else console.log('---: USER EXISTS ALREADY :---');
    const Token : string = await this.signIn(user.firstName, user.password);
    const response = {
      sessionId: req.sessionID,
      Token,
      user: user,
    };
    return response;
  }
}
