import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './native_auth.guard';
import { JwtStrategy } from './JWT/jwt.strategy';
import { JwtAuthGuard } from './JWT/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

//native autguard that validates jwt token with secret normally
//jwt strategy that validates jwt token with secret using passport strategy & library

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  //providers: [AuthService,JwtService,AuthGuard],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    JwtAuthGuard,
    GoogleStrategy,
    FacebookStrategy
  ],
  //exports: [AuthService,JwtService,AuthGuard]
  exports: [AuthService, JwtService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
