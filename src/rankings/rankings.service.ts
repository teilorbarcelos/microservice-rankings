import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { Category } from './interfaces/category.interface';
import { EventName } from './interfaces/event-name.enum';
import { Play } from './interfaces/play.interface';
import { RankingResponse } from './interfaces/ranking-response.interface';
import { Ranking } from './interfaces/rankings.schema';
import * as momentTimezone from 'moment-timezone';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('Ranking') private readonly challengeModel: Model<Ranking>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}
  private readonly logger = new Logger(RankingsService.name);
  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  private clientChallenges =
    this.clientProxySmartRanking.getClientProxyChallengesInstance();

  async processPlay(playId: string, play: Play): Promise<void> {
    try {
      const category: Category = await lastValueFrom(
        this.clientAdminBackend.send('get-category', play.category),
      );

      await Promise.all(
        play.players.map(async (player) => {
          const ranking = new this.challengeModel();

          ranking.category = play.category;
          ranking.challenge = play.challenge;
          ranking.play = playId;
          ranking.player = player;

          if (player === play.def) {
            const eventFilter = category.events.filter(
              (event) => event.name === EventName.VICTORY,
            );
            ranking.event = EventName.VICTORY;
            ranking.points = eventFilter[0].value;
            ranking.operation = eventFilter[0].operation;
          } else {
            const eventFilter = category.events.filter(
              (event) => event.name === EventName.DEFEAT,
            );
            ranking.event = EventName.DEFEAT;
            ranking.points = eventFilter[0].value;
            ranking.operation = eventFilter[0].operation;
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

  async getRankings(
    categoryId: string,
    dateRef: string,
  ): Promise<RankingResponse[] | RankingResponse> {
    try {
      this.logger.log(
        `categoryId: ${JSON.stringify(categoryId)} dateRef: ${dateRef}`,
      );

      if (!dateRef) {
        dateRef = momentTimezone().tz('America/Sao_Paulo').format('YYYY-MM-DD');
        this.logger.log(`dateRef: ${dateRef}`);
      }

      const rankingRegisters = await this.challengeModel
        .find()
        .where('category')
        .equals(categoryId)
        .exec();

      this.logger.log(`rankingRegisters: ${JSON.stringify(rankingRegisters)}`);

      const challenges: Challenge[] = await lastValueFrom(
        this.clientChallenges.send('get-done-challenges', {
          categoryId,
          dateRef,
        }),
      );

      return;
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
