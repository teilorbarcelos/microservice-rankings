import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingsModule } from './rankings/rankings.module';

const configService = new ConfigService();
const DB_URL = configService.get<string>('DB_URL');

@Module({
  imports: [
    RankingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(DB_URL, {
      // useNewUrlParses: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
