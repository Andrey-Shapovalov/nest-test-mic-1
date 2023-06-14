import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from '../../common/interfaces/user.interface';
import { IncomingMessage } from 'http';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const logger = new Logger('JwtGuard');

    const request = this.getRequest<
      IncomingMessage & { user: UserInterface } & {
        headers: Record<string, string | string[]>;
      }
    >(context);
    try {
      const token = this.getToken(request);
      const base64PublicKey = this.configService.get('JWT_ACCESS_PUBLIC_KEY');

      if (!token) {
        return false;
      }

      const user = this.jwtService.verify(token, {
        publicKey: Buffer.from(base64PublicKey, 'base64').toString(),
      });
      request.user = user;
      return true;
    } catch (e) {
      logger.debug(e);
      return false;
    }
  }

  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }

  protected getToken(request: {
    headers: Record<string, string | string[]>;
  }): string | undefined {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    const [, token] = authorization.split(' ');
    return token;
  }
}
