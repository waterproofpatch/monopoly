export interface Player {
  img: string;
  name: string;
  money: number;
  transactions: Transaction[];
}

export interface Transaction {
  fromPlayer: Player;
  toPlayer: Player;
  amount: number;
}
