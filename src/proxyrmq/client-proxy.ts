import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientProxySmartRanking {
  constructor(private configService: ConfigService) {}

  private RABBITMQ_USER = this.configService.get<string>('RABBITMQ_USER');
  private RABBITMQ_PASSWORD =
    this.configService.get<string>('RABBITMQ_PASSWORD');
  private RMQ_SERVER_URL = this.configService.get<string>('RMQ_SERVER_URL');

  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RMQ_SERVER_URL}`,
        ],
        queue: 'admin-backend',
      },
    });
  }

  getClientProxyChallengesInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RMQ_SERVER_URL}`,
        ],
        queue: 'challenges',
      },
    });
  }

  getClientProxyRankingsInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RMQ_SERVER_URL}`,
        ],
        queue: 'rankings',
      },
    });
  }

  getClientProxyNotificationsInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RMQ_SERVER_URL}`,
        ],
        queue: 'notifications',
      },
    });
  }
}
