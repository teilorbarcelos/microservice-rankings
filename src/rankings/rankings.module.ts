import { Module } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { RankingsController } from './rankings.controller';
import { RankingSchema } from './interfaces/rankings.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ranking', schema: RankingSchema }]),
    ProxyrmqModule,
  ],
  providers: [RankingsService],
  controllers: [RankingsController],
})
export class RankingsModule {}
