export interface Player {
  ID: number;
  img: string;
  name: string;
  money: number;
  human: boolean;
  inGame: boolean; // whether or not this player is active in the game
  gameId: number;
}

export interface Game {
  ID: number;
  name: string;
  createdBy: string;
  CreatedAt: string;
}

export interface JWTData {
  email: string;
}

export interface Version {
  version: string;
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
  gameId: number;
}

export interface Error {
  message: string;
}

export interface ChangePlayerRequest {
  first: Player;
  second: Player;
}
