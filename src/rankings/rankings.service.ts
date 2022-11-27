import { Injectable, Logger } from '@nestjs/common';
import { Play } from './interfaces/play.interface';

@Injectable()
export class RankingsService {
  private readonly logger = new Logger(RankingsService.name);

  async processPlay(playId: string, play: Play): Promise<void> {
    this.logger.log(`playId: ${playId} play: ${JSON.stringify(play)}`);
  }
}
