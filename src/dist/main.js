import { REQUEST, INQUIRER, ModuleRef, NestFactory } from '@nestjs/core';
import { Injectable, Scope, Inject, HttpException, HttpStatus, UnauthorizedException, HttpCode, Post, Body, UseGuards, Get, Req, Controller, Param, Patch, Delete, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { IsString } from 'class-validator';
import { AuthGuard, PassportStrategy, PassportModule } from '@nestjs/passport';
import { PartialType } from '@nestjs/mapped-types';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Strategy as Strategy$1 } from 'passport-google-oauth20';
import { config } from 'dotenv';
import AdminJS from 'adminjs';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { AdminModule } from '@adminjs/nestjs';
import 'express-session';

function _ts_decorate$d(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
class LoggerMiddleware {
    use(req, res, next) {
        /*console.log("session :",req.session)
    console.log("session ID :",req.sessionID)
    console.log("session Store :",req.sessionStore)*/ next();
    }
}
LoggerMiddleware = _ts_decorate$d([
    Injectable()
], LoggerMiddleware);

function _ts_decorate$c(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
class PrismaService extends PrismaClient {
    //The onModuleInit is optional — if you leave it out, Prisma will connect lazily on its first call to the database.
    async onModuleInit() {
        await this.$connect();
    }
}
PrismaService = _ts_decorate$c([
    Injectable()
], PrismaService);

function _define_property$5(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_decorate$b(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$7(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param$2(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
class UsersService {
    async create(createUserDto) {
        try {
            console.log('createUserDto:', createUserDto);
            await this.prisma.user.create({
                data: {
                    password: createUserDto.password,
                    username: createUserDto.firstName,
                    admin: true,
                    blocked: false,
                    confirmationToken: '',
                    email: createUserDto.email,
                    confirmed: true,
                    roleId: createUserDto.roleId
                }
            });
            return true;
        } catch (error) {
            throw new HttpException(error, HttpStatus.CONFLICT, {
                cause: error,
                description: ''
            });
        }
    }
    async findAll() {
        try {
            /*this.request ? console.log('it exists') : console.log('it doesn\'t')
      this.request ? console.log('inquirer:',this.inquirer) : console.log('inquirer doesn\'t exist')
      this.request ? console.log('inquirer class:',this.inquirer.constructor.name) : console.log('inquirer doesn\'t exist')
      //fetching provider that has been injected into an other module (see app.module.ts) by passing strict : false
      this.catS = this.moduleRef.get(CatsService, { strict: false });
      can use resolve() to get a unique instance of a scoped service/provider
      console.log('catS:',this.catS.getHello())
      console.log('catS:',this.catS.constructor.name);*/ const users = await this.prisma.user.findMany();
            return users;
        } catch (error) {
            console.log('error:', error);
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN, {
                cause: error,
                description: ''
            });
        }
    }
    async findOne(identifier) {
        try {
            if (typeof identifier === 'string') {
                const user = await this.prisma.user.findFirst({
                    where: {
                        username: identifier
                    }
                });
                return user;
            } else {
                const user = await this.prisma.user.findUnique({
                    where: {
                        id: identifier
                    }
                });
                return user;
            }
        } catch (error) {
            throw new HttpException('could not find user', HttpStatus.BAD_REQUEST, {
                cause: error,
                description: ''
            });
        }
    }
    async update(id, updateUserDto) {
        try {
            const user = this.findOne(id);
            if (typeof user === 'object') {
                await this.prisma.user.update({
                    where: {
                        id: id
                    },
                    data: {
                        firstname: updateUserDto.firstName,
                        lastname: updateUserDto.lastName
                    }
                });
                return HttpStatus.OK;
            }
        } catch (error) {
            console.log('error at update:', error);
            return HttpStatus.BAD_REQUEST;
        }
    }
    async remove(id) {
        try {
            const user = await this.prisma.user.delete({
                where: {
                    id: id
                }
            });
            return HttpStatus.OK;
        } catch (error) {
            console.log('error:', error);
            return HttpStatus.BAD_REQUEST;
        }
    }
    constructor(request, prisma, inquirer, moduleRef){
        _define_property$5(this, "request", void 0);
        _define_property$5(this, "prisma", void 0);
        _define_property$5(this, "inquirer", void 0);
        _define_property$5(this, "moduleRef", void 0);
        _define_property$5(this, "catS", void 0);
        this.request = request;
        this.prisma = prisma;
        this.inquirer = inquirer;
        this.moduleRef = moduleRef;
    }
}
UsersService = _ts_decorate$b([
    Injectable({
        scope: Scope.TRANSIENT
    }),
    _ts_param$2(0, Inject(REQUEST)),
    _ts_param$2(2, Inject(INQUIRER)),
    _ts_metadata$7("design:type", Function),
    _ts_metadata$7("design:paramtypes", [
        typeof Request === "undefined" ? Object : Request,
        typeof PrismaService === "undefined" ? Object : PrismaService,
        Object,
        typeof ModuleRef === "undefined" ? Object : ModuleRef
    ])
], UsersService);

function _define_property$4(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_decorate$a(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$6(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
class AuthService {
    async signIn(username, pass) {
        try {
            const user = await this.userService.findOne(username);
            if (user.password !== pass) {
                throw new UnauthorizedException();
            }
            const { password, ...result } = user;
            const payload = {
                sub: user.id,
                username: user.userName
            };
            const token = await this.jwtService.signAsync(payload, {
                expiresIn: '1h',
                secret: process.env['JWT_SECRET']
            });
            return {
                access_token: token
            };
        } catch (error) {
            console.log(error);
            throw new HttpException(error, HttpStatus.FORBIDDEN, {
                cause: error,
                description: ''
            });
        }
    }
    async googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }
        const user = {
            id: req.user.id === undefined ? 0 : req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            password: 'googlePassword'
        };
        const dbUser = await this.userService.findOne(user.firstName);
        console.log(dbUser);
        if (dbUser === null) this.userService.create(user);
        else console.log('---: USER EXISTS ALREADY :---');
        const Token = await this.signIn(user.firstName, user.password);
        const response = {
            sessionId: req.sessionID,
            token: Token,
            message: 'User information from google',
            user: req.user
        };
        console.log(response);
        return response;
    }
    constructor(userService, jwtService){
        _define_property$4(this, "userService", void 0);
        _define_property$4(this, "jwtService", void 0);
        this.userService = userService;
        this.jwtService = jwtService;
    }
}
AuthService = _ts_decorate$a([
    Injectable(),
    _ts_metadata$6("design:type", Function),
    _ts_metadata$6("design:paramtypes", [
        typeof UsersService === "undefined" ? Object : UsersService,
        typeof JwtService === "undefined" ? Object : JwtService
    ])
], AuthService);

function _define_property$3(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_decorate$9(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$5(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
class SignInDto {
    constructor(){
        _define_property$3(this, "username", void 0);
        _define_property$3(this, "pass", void 0);
    }
}
_ts_decorate$9([
    IsString(),
    _ts_metadata$5("design:type", String)
], SignInDto.prototype, "username", void 0);
_ts_decorate$9([
    IsString(),
    _ts_metadata$5("design:type", String)
], SignInDto.prototype, "pass", void 0);

function _ts_decorate$8(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context) {
        //supposedly creates a session
        const request = context.switchToHttp().getRequest();
        console.log(request);
        const reqAuthenticated = super.canActivate(context);
        return reqAuthenticated;
    }
    handleRequest(err, user, info) {
        console.log('custom JWT guard handling request', err, user, info);
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw new UnauthorizedException(err);
        }
        return user;
    }
}
JwtAuthGuard = _ts_decorate$8([
    Injectable()
], JwtAuthGuard);

function _define_property$2(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_decorate$7(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$4(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param$1(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
class AuthController {
    signIn(signInDto) {
        return this.authService.signIn(signInDto.username, signInDto.pass);
    }
    findAll(req) {
        return this.userService.findAll();
    }
    async googleAuth() {}
    googleAuthRedirect(req) {
        return this.authService.googleLogin(req);
    }
    constructor(authService, userService){
        _define_property$2(this, "authService", void 0);
        _define_property$2(this, "userService", void 0);
        this.authService = authService;
        this.userService = userService;
    }
}
_ts_decorate$7([
    HttpCode(HttpStatus.OK),
    Post('login'),
    _ts_param$1(0, Body()),
    _ts_metadata$4("design:type", Function),
    _ts_metadata$4("design:paramtypes", [
        typeof SignInDto === "undefined" ? Object : SignInDto
    ]),
    _ts_metadata$4("design:returntype", void 0)
], AuthController.prototype, "signIn", null);
_ts_decorate$7([
    HttpCode(HttpStatus.OK),
    UseGuards(JwtAuthGuard),
    Get('findUsers'),
    _ts_param$1(0, Req()),
    _ts_metadata$4("design:type", Function),
    _ts_metadata$4("design:paramtypes", [
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata$4("design:returntype", void 0)
], AuthController.prototype, "findAll", null);
_ts_decorate$7([
    Get('google'),
    UseGuards(AuthGuard('google')),
    _ts_metadata$4("design:type", Function),
    _ts_metadata$4("design:paramtypes", []),
    _ts_metadata$4("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
_ts_decorate$7([
    Get('redirect'),
    UseGuards(AuthGuard('google')),
    _ts_param$1(0, Req()),
    _ts_metadata$4("design:type", Function),
    _ts_metadata$4("design:paramtypes", [
        void 0
    ]),
    _ts_metadata$4("design:returntype", void 0)
], AuthController.prototype, "googleAuthRedirect", null);
AuthController = _ts_decorate$7([
    Controller('auth'),
    _ts_metadata$4("design:type", Function),
    _ts_metadata$4("design:paramtypes", [
        typeof AuthService === "undefined" ? Object : AuthService,
        typeof UsersService === "undefined" ? Object : UsersService
    ])
], AuthController);

function _define_property$1(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_decorate$6(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$3(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
class CreateUserDto {
    constructor(){
        _define_property$1(this, "firstName", void 0);
        _define_property$1(this, "lastName", void 0);
        _define_property$1(this, "password", void 0);
        _define_property$1(this, "roleId", void 0);
        _define_property$1(this, "email", void 0);
    }
}
_ts_decorate$6([
    IsString(),
    _ts_metadata$3("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
_ts_decorate$6([
    IsString(),
    _ts_metadata$3("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
_ts_decorate$6([
    IsString(),
    _ts_metadata$3("design:type", String)
], CreateUserDto.prototype, "password", void 0);
_ts_decorate$6([
    IsString(),
    _ts_metadata$3("design:type", String)
], CreateUserDto.prototype, "roleId", void 0);
_ts_decorate$6([
    IsString(),
    _ts_metadata$3("design:type", String)
], CreateUserDto.prototype, "email", void 0);

class UpdateUserDto extends PartialType(CreateUserDto) {
}

function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_decorate$5(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$2(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
class UsersController {
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll(req) {
        return this.usersService.findAll();
    }
    findOne(id) {
        return this.usersService.findOne(+id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(+id);
    }
    constructor(usersService){
        _define_property(this, "usersService", void 0);
        this.usersService = usersService;
    }
}
_ts_decorate$5([
    Post(),
    _ts_param(0, Body()),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        typeof CreateUserDto === "undefined" ? Object : CreateUserDto
    ]),
    _ts_metadata$2("design:returntype", void 0)
], UsersController.prototype, "create", null);
_ts_decorate$5([
    Get(),
    _ts_param(0, Req()),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata$2("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
_ts_decorate$5([
    Get(':id'),
    _ts_param(0, Param('id')),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        String
    ]),
    _ts_metadata$2("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
_ts_decorate$5([
    Patch(':id'),
    _ts_param(0, Param('id')),
    _ts_param(1, Body()),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        String,
        typeof UpdateUserDto === "undefined" ? Object : UpdateUserDto
    ]),
    _ts_metadata$2("design:returntype", void 0)
], UsersController.prototype, "update", null);
_ts_decorate$5([
    Delete(':id'),
    _ts_param(0, Param('id')),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        String
    ]),
    _ts_metadata$2("design:returntype", void 0)
], UsersController.prototype, "remove", null);
UsersController = _ts_decorate$5([
    Controller('users'),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        typeof UsersService === "undefined" ? Object : UsersService
    ])
], UsersController);

function _ts_decorate$4(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
class UsersModule {
}
UsersModule = _ts_decorate$4([
    Module({
        controllers: [
            UsersController
        ],
        providers: [
            UsersService,
            PrismaService
        ],
        exports: [
            UsersService,
            PrismaService
        ]
    })
], UsersModule);

function _ts_decorate$3(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$1(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
class JwtStrategy extends PassportStrategy(Strategy) {
    async validate(payload) {
        //more lookup logic can be implemented here
        return {
            userId: payload.sub,
            username: payload.username
        };
    }
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env['JWT_SECRET'],
            sessionStorage: true
        });
    }
}
JwtStrategy = _ts_decorate$3([
    Injectable(),
    _ts_metadata$1("design:type", Function),
    _ts_metadata$1("design:paramtypes", [])
], JwtStrategy);

function _ts_decorate$2(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
config();
class GoogleStrategy extends PassportStrategy(Strategy$1, 'google') {
    async validate(accessToken, refreshToken, profile, done) {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        };
        done(null, user);
    }
    constructor(){
        super({
            clientID: process.env['GOOGLE_CLIENT_ID'],
            clientSecret: process.env['GOOGLE_SECRET'],
            callbackURL: 'http://localhost:3000/auth/redirect',
            scope: [
                'email',
                'profile'
            ]
        });
    }
}
GoogleStrategy = _ts_decorate$2([
    Injectable(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], GoogleStrategy);

function _ts_decorate$1(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
class AuthModule {
}
AuthModule = _ts_decorate$1([
    Module({
        imports: [
            UsersModule,
            PassportModule.register({
                session: true
            })
        ],
        controllers: [
            AuthController
        ],
        //providers: [AuthService,JwtService,AuthGuard],
        providers: [
            AuthService,
            JwtService,
            JwtStrategy,
            JwtAuthGuard,
            GoogleStrategy
        ],
        //exports: [AuthService,JwtService,AuthGuard]
        exports: [
            AuthService,
            JwtService,
            JwtStrategy,
            JwtAuthGuard
        ]
    })
], AuthModule);

function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const DEFAULT_ADMIN = {
    email: 'admin@localhost',
    password: 'password'
};
const authenticate = async (email, password)=>{
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
};
AdminJS.registerAdapter({
    Database,
    Resource
});
const prisma = new PrismaService();
class AppModule {
    configure(consumer) {
        consumer.apply(LoggerMiddleware).exclude({
            path: 'none',
            method: RequestMethod.GET
        }, {
            path: 'none',
            method: RequestMethod.POST
        }).forRoutes('*');
    //.forRoutes({ path: 'users', method: RequestMethod.GET });
    }
}
AppModule = _ts_decorate([
    Module({
        imports: [
            ConfigModule.forRoot(),
            AdminModule.createAdminAsync({
                useFactory: ()=>({
                        adminJsOptions: {
                            rootPath: '/admin',
                            resources: [
                                {
                                    resource: {
                                        model: getModelByName('Role'),
                                        client: prisma
                                    },
                                    options: {}
                                },
                                {
                                    resource: {
                                        model: getModelByName('user'),
                                        client: prisma
                                    },
                                    options: {}
                                },
                                {
                                    resource: {
                                        model: getModelByName('Tag'),
                                        client: prisma
                                    },
                                    options: {}
                                },
                                {
                                    resource: {
                                        model: getModelByName('postTags'),
                                        client: prisma
                                    },
                                    options: {}
                                },
                                {
                                    resource: {
                                        model: getModelByName('Post'),
                                        client: prisma
                                    },
                                    options: {}
                                }
                            ]
                        },
                        auth: {
                            authenticate,
                            cookieName: 'adminjs',
                            cookiePassword: 'secret'
                        },
                        sessionOptions: {
                            resave: true,
                            saveUninitialized: true,
                            secret: 'secret'
                        }
                    })
            }),
            AuthModule
        ]
    })
], AppModule);

const viteNodeApp = await NestFactory.create(AppModule);

export { viteNodeApp };
