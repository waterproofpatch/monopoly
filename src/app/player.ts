export interface Player {
  img: string;
  name: string;
  money: number;
  human: boolean;
}

export interface Transaction {
  fromPlayer: Player;
  toPlayer: Player;
  amount: number;
}
