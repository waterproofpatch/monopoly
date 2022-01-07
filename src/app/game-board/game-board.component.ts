import { Component, OnInit } from '@angular/core';
import { Player, Transaction } from '../types';
import { PLAYERS } from '../players';
import { DialogService } from '../dialog.service';
import { TransactionService } from '../transaction.service';

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

  constructor(
    private logger: DialogService,
    private transactionService: TransactionService
  ) {
    transactionService.transaction$.subscribe((transaction) => {
      this.updateGameState(transaction);
    });
  }

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

  ngOnInit(): void {}
}
