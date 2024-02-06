import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './native_auth.guard.js';
import { JwtStrategy } from './JWT/jwt.strategy.js';
import { JwtAuthGuard } from './JWT/jwt-auth.guard.js';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google/google.strategy.js';

//native autguard that validates jwt token with secret normally
//jwt strategy that validates jwt token with secret using passport strategy & library

@Module({
  imports: [UsersModule,PassportModule.register({session:true}),],
  controllers: [AuthController],
  //providers: [AuthService,JwtService,AuthGuard],
  providers: [AuthService,JwtService,JwtStrategy,JwtAuthGuard,GoogleStrategy],
  //exports: [AuthService,JwtService,AuthGuard]
  exports: [AuthService,JwtService,JwtStrategy,JwtAuthGuard]
})
export class AuthModule {}