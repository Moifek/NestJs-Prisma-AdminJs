import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_SECRET'],
      callbackURL: 'http://localhost:3001/auth/redirect',
      scope: ['email', 'profile'],
      refreshToken: true,
      state:true,
      passReqToCallback: true
    });
  }


  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos,id } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      googleAccount:{
        googleAccessToken:accessToken,
        googleId: id,
        googleRefreshToken:refreshToken
      }
    };
    done(null, user);
  }
}
