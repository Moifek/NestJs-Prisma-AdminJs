import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CatsService } from '../cat/cat.service.js';


@Module({
  controllers: [UsersController],
  providers: [UsersService,PrismaService],
  exports: [UsersService,PrismaService]
})
export class UsersModule {}
