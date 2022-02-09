export interface Player {
  ID: number;
  img: string;
  name: string;
  money: number;
  human: boolean;
  inGame: boolean; // whether or not this player is active in the game
  GameID: number;
}

export interface Game {
  ID: number;
  name: string;
}

export interface Game {
  players: Player[];
  transactions: Transaction[];
}

export interface Transaction {
  ID: number;
  fromPlayerId: number;
  toPlayerId: number;
  amount: number;
  timestamp: string;
  GameID: number;
}

export interface Error {
  message: string;
}

export interface ChangePlayerRequest {
  first: Player;
  second: Player;
}
