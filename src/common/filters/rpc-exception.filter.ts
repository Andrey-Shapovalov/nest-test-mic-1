import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
  } from '@nestjs/common';
  import { RpcException } from '@nestjs/microservices';
  import { Response } from 'express';
  
  @Catch(RpcException)
  export class RpcExceptionFilter implements ExceptionFilter {
    static RpcToHttpStatusCode: Record<number, number> = {
      5: HttpStatus.NOT_FOUND,
    };
  
    catch(exception: RpcException, host: ArgumentsHost) {
      const error = exception.getError() as { code: number; details: string };
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      const { code, details } = error;
  
      const statusCode =
        RpcExceptionFilter.RpcToHttpStatusCode[code] ||
        HttpStatus.INTERNAL_SERVER_ERROR;
  
      response.status(statusCode).json({
        statusCode: statusCode,
        message: details,
      });
    }
  }
  