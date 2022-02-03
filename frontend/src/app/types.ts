export interface Player {
  ID: number;
  img: string;
  name: string;
  money: number;
  human: boolean;
  inGame: boolean; // whether or not this player is active in the game
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
}

export interface Error {
  message: string;
}

export interface PlayersTransactionsResponse {
  transactions: Transaction[];
  players: Player[];
}

export interface ChangePlayerRequest {
  first: Player;
  second: Player;
}
