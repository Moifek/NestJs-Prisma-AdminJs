
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        //supposedly creates a session
        const request = context.switchToHttp().getRequest();
       console.log(request)
        const reqAuthenticated = super.canActivate(context);
        return reqAuthenticated;
      }
      handleRequest(err, user, info) {
        console.log('custom JWT guard handling request',err,user,info)
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          throw new UnauthorizedException(err);
        }
        return user;
      }
}
