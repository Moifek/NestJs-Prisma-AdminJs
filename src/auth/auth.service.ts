import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../Models/user.model.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) {};
    async signIn(username: string, pass: string): Promise<any> {
        try {
            const user : User = await this.userService.findOne(username);
            if (user.password !== pass) {
              throw new UnauthorizedException();
            }
            const { password, ...result } = user;
            const payload = { sub: user.id, username: user.userName };
            const token = await this.jwtService.signAsync(payload, { expiresIn: '1h', secret:process.env['JWT_SECRET'] });
            return {
              access_token: token,
            };
        } catch (error) {
            console.log(error)
           throw new HttpException(error, HttpStatus.FORBIDDEN, { cause: error, description:'' }); 
        }
    }
    async googleLogin(req) {
      if (!req.user) {
        return 'No user from google'
      }

      const user : User = {
        id: req.user.id === undefined ? 0 : req.user.id,
        firstName : req.user.firstName,
        lastName : req.user.lastName,
        email : req.user.email,
        password: 'googlePassword',
      }
      const dbUser = await this.userService.findOne(user.firstName);
      console.log(dbUser);
        if(dbUser === null)
          this.userService.create(user);
        else
          console.log('---: USER EXISTS ALREADY :---')
      const Token = await this.signIn(user.firstName, user.password);
      const response = {
        sessionId: req.sessionID,
        token:Token,
        message: 'User information from google',
        user: req.user
      };
      console.log(response);
      return response;
    }
}