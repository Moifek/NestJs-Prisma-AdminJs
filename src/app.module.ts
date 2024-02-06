import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './Logger/logger.middleware.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaService } from './prisma/prisma.service.js';

import AdminJS from 'adminjs';
import {Database,Resource, getModelByName} from '@adminjs/prisma'
import { AdminModule } from '@adminjs/nestjs';


const DEFAULT_ADMIN = {
  email: 'admin@localhost',
  password: 'password',
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

AdminJS.registerAdapter({Database,Resource});
const prisma = new PrismaService();

@Module({
  imports: [ConfigModule.forRoot(),
    AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            {
              resource:{ model: getModelByName('Role'), client: prisma},
              options: {},
            },{
              resource:{ model: getModelByName('user'), client: prisma},
              options: {},
            },{
              resource:{ model: getModelByName('Tag'), client: prisma},
              options: {},
            },{
              resource:{ model: getModelByName('postTags'), client: prisma},
              options: {},
            },{
              resource:{ model: getModelByName('Post'), client: prisma},
              options: {},
            },
          ],
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
        },
      }),
    }),
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'none', method: RequestMethod.GET },
        { path: 'none', method: RequestMethod.POST },
        //'users/(.*)',
      )
      .forRoutes('*');
      //.forRoutes({ path: 'users', method: RequestMethod.GET });
      
  }
}