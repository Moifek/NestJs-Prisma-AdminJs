import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    /*console.log("session :",req.session)
    console.log("session ID :",req.sessionID)
    console.log("session Store :",req.sessionStore)*/
    next();
  }
}
