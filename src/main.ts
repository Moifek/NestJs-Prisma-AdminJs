import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './Logger/logger.middleware.js';
import session from 'express-session';

if(!true){
  async function bootstrap() {
    const app = await NestFactory.create(AppModule, { abortOnError: false });
    app.useGlobalPipes(new ValidationPipe({
      //disableErrorMessages: true,
      //whitelist: true
    }));
    //use this to apply the middleware to all routes
    //const logger = new LoggerMiddleware();
    //app.use(logger.use);
    app.use(
      session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
        /*cookie: {
          maxAge: 60000
        }*/
      }),
    );
    await app.listen(3000);
  }
  bootstrap();
}

  
export const viteNodeApp = NestFactory.create(AppModule);
