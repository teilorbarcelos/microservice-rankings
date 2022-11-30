import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Play } from './interfaces/play.interface';
import { RankingResponse } from './interfaces/ranking-response.interface';
import { RankingsService } from './rankings.service';

const ackError: string[] = ['E11000'];

@Controller()
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}
  private readonly logger = new Logger(RankingsController.name);

  @EventPattern('process-play')
  async processPlay(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);
      const playId: string = data.playId;
      const play: Play = data.play;

      await this.rankingsService.processPlay(playId, play);
      await channel.ack(originalMessage);
    } catch (error) {
      const filterAckError = ackError.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('get-rankings')
  async getRankings(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<RankingResponse[] | RankingResponse> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { categoryId, dateRef } = data;
      return await this.rankingsService.getRankings(categoryId, dateRef);
    } finally {
      await channel.ack(originalMessage);
    }
  }
}
