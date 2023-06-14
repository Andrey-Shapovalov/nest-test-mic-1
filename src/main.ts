import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

import { protobufPackage } from 'protorepo-users-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const options = new DocumentBuilder()
    .setTitle('Open API')
    .setDescription('The API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const serverGrpcUrl = configService.get('SERVER_GRPC_URL');
  const protoFilePath = require.resolve(`protorepo-users-nestjs/proto/${protobufPackage}.proto`);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: serverGrpcUrl,
      package: protobufPackage,
      protoPath: protoFilePath,
      loader: { keepCase: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
