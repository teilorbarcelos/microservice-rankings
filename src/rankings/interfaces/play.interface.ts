export interface Play {
  category: string;
  players: string[];
  def: string;
  result: Result[];
}

export interface Result {
  set: string;
}
