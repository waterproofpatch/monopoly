import { Component, OnInit } from '@angular/core';
import { Player, Transaction } from '../types';
import { PLAYERS } from '../players';
import { LogService } from '../log-service.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  players: Player[] = PLAYERS;
  transactions: Transaction[] = [];
  playerStates: Array<Player[]> = new Array<Player[]>();
  transactionStates: Array<Transaction[]> = new Array<Transaction[]>();
  errorMsg: string = '';

  constructor(private logger: LogService) {}

  updateGameState(t: Transaction): void {
    this.logger.log('Updating gamestate with transaction ' + t);
    let clonedPlayers: Player[] = this.players.map((x) => Object.assign({}, x));
    let clonedTransactions: Transaction[] = this.transactions.map((x) =>
      Object.assign({}, x)
    );
    this.playerStates.push(clonedPlayers);
    this.transactionStates.push(clonedTransactions);

    this.transactions.push(t);
  }

  winningPlayer(): Player {
    let winningPlayer: Player = this.players[0];
    for (var p of this.players) {
      // bank and free parking can't win
      if (p.name == 'Bank' || p.name == 'Free Parking') {
        continue;
      }
      if (p.money > winningPlayer.money) {
        winningPlayer = p;
      }
    }
    return winningPlayer;
  }

  ngOnInit(): void {}
}
