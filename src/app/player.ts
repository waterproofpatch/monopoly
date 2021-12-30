export interface Player {
  img: string;
  name: string;
  money: number;
}

export interface Transaction {
  fromPlayer: Player;
  toPlayer: Player;
  amount: number;
}
