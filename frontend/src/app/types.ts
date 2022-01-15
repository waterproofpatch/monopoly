export interface Player {
  img: string;
  name: string;
  money: number;
  human: boolean;
  inGame: boolean; // whether or not this player is active in the game
}

export interface Transaction {
  fromPlayer: Player;
  toPlayer: Player;
  amount: number;
  timestamp: string;
}

export interface Error {
  message: string;
}
