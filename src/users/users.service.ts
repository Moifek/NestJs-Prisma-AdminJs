import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { user, Prisma } from '@prisma/client';
import { INQUIRER, ModuleRef, REQUEST } from '@nestjs/core';
import { CatsService } from '../cat/cat.service';
import { User } from '../Models/user.model';

//scoped injected services are init with each request thus slowing down performance(good handling causes at best 5% slowdown), use default singleton for best performance
@Injectable({ scope: Scope.TRANSIENT })
export class UsersService {
  private catS: CatsService;
  constructor(
    @Inject(REQUEST) private request: Request,
    private prisma: PrismaService,
    @Inject(INQUIRER) private readonly inquirer: object,
    private moduleRef: ModuleRef,
  ) {}
  async create(createUserDto: CreateUserDto | User): Promise<boolean> {
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
          roleId: createUserDto.roleId,
        },
      });
      return true;
    } catch (error) {
      throw new HttpException(error, HttpStatus.CONFLICT, {
        cause: error,
        description: '',
      });
    }
  }

  async findAll(): Promise<string | HttpStatus | user[]> {
    try {
      /*this.request ? console.log('it exists') : console.log('it doesn\'t')
      this.request ? console.log('inquirer:',this.inquirer) : console.log('inquirer doesn\'t exist')
      this.request ? console.log('inquirer class:',this.inquirer.constructor.name) : console.log('inquirer doesn\'t exist')
      //fetching provider that has been injected into an other module (see app.module.ts) by passing strict : false
      this.catS = this.moduleRef.get(CatsService, { strict: false });
      can use resolve() to get a unique instance of a scoped service/provider
      console.log('catS:',this.catS.getHello())
      console.log('catS:',this.catS.constructor.name);*/
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      console.log('error:', error);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN, {
        cause: error,
        description: '',
      });
    }
  }

  async findOne(identifier: number | string): Promise<User | undefined> {
    try {
      console.log(identifier)
      if (typeof identifier === 'string') {
        const user = await this.prisma.user.findFirst({
          where: {
            username: identifier,
          },
        });
        
        if (user === undefined) return undefined;
        else return user;
      } else {
        const user = await this.prisma.user.findUnique({
          where: {
            id: identifier,
          },
        });
        return user;
      }
    } catch (error) {
      throw new HttpException('could not find user', HttpStatus.BAD_REQUEST, {
        cause: error,
        description: '',
      });
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<string | HttpStatus> {
    try {
      const user = this.findOne(id);
      if (typeof user === 'object') {
        await this.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            firstname: updateUserDto.firstName,
            lastname: updateUserDto.lastName,
          },
        });
        return HttpStatus.OK;
      }
    } catch (error) {
      console.log('error at update:', error);
      return HttpStatus.BAD_REQUEST;
    }
  }

  async remove(id: number): Promise<string | HttpStatus> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      return HttpStatus.OK;
    } catch (error) {
      console.log('error:', error);
      return HttpStatus.BAD_REQUEST;
    }
  }
}
