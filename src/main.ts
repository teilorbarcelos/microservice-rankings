import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('Main');
const configService = new ConfigService();

async function bootstrap() {
  const RABBITMQ_USER = configService.get<string>('RABBITMQ_USER');
  const RABBITMQ_PASSWORD = configService.get<string>('RABBITMQ_PASSWORD');
  const RMQ_SERVER_URL = configService.get<string>('RMQ_SERVER_URL');

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RMQ_SERVER_URL}`],
      noAck: false,
      queue: 'rankings',
    },
  });
  await app.listen();
}
bootstrap();
