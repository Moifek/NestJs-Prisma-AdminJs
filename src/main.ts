import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './Logger/logger.middleware';
import session from 'express-session';

  export async function bootstrapApp(options?: NestApplicationOptions): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule, { abortOnError: false });
    app.enableCors()
    app.useGlobalPipes(
      new ValidationPipe({
        //disableErrorMessages: true,
        //whitelist: true
      }),
    );
    app.use(
      session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
        store: new session.MemoryStore(), // this is purely for development, should be swapped to a database or file or anything our of memory in production
        cookie: {
          maxAge: 60000
        }
      }),
    );
    //use this to apply the middleware to all routes
    //const logger = new LoggerMiddleware();
    //app.use(logger.use);
      return app;
  }
  async function main() {
    const app = await bootstrapApp();
    
    await app.listen(3001);
  
  
  }
  
  export let viteNodeApp;   

  if(process.env.NODE_ENV ==='production'){
    main();
  }else{
    viteNodeApp = bootstrapApp();
  }
