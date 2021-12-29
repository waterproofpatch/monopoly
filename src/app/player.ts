export interface Player {
  id: number;
  name: string;
  money: number;
}

export interface Transaction {
  fromPlayer: Player;
  toPlayer: Player;
  amount: number;
}
