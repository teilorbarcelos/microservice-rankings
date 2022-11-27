import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { Play } from './interfaces/play.interface';
import { Ranking } from './interfaces/rankings.schema';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('Ranking') private readonly challengeModel: Model<Ranking>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}
  private readonly logger = new Logger(RankingsService.name);
  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async processPlay(playId: string, play: Play): Promise<void> {
    try {
      await Promise.all(
        play.players.map(async (player) => {
          const ranking = new this.challengeModel();

          ranking.category = play.category;
          ranking.challenge = play.challenge;
          ranking.play = playId;
          ranking.player = player;

          if (player === play.def) {
            ranking.event = 'VICTORY';
            ranking.points = 30;
            ranking.operation = '+';
          } else {
            ranking.event = 'LOOSE';
            ranking.points = 0;
            ranking.operation = '+';
          }

          this.logger.log(`ranking: ${JSON.stringify(ranking)}`);

          ranking.save();
        }),
      );
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error)}`);
      throw new RpcException(error.message);
    }
  }
}
