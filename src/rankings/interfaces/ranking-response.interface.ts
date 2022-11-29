export interface RankingResponse {
  player?: string;
  position?: number;
  score?: number;
  playsHistory?: PlaysHistory;
}

export interface PlaysHistory {
  victory?: number;
  defeats?: number;
}
