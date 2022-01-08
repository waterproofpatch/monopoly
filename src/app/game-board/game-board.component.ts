import { Component, OnInit } from '@angular/core';
import { Player, Transaction } from '../types';
import { DialogService } from '../dialog-service/dialog.service';
import { TransactionService } from '../transaction-service/transaction.service';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  players: Player[] = [];
  transactions: Transaction[] = [];
  playerStates: Array<Player[]> = new Array<Player[]>();
  transactionStates: Array<Transaction[]> = new Array<Transaction[]>();

  constructor(
    private dialogService: DialogService,
    private transactionService: TransactionService,
    private playerService: PlayerService
  ) {
    // whenever a component registers a transaction, process it here.
    transactionService.transaction$.subscribe((transaction) => {
      this.updateGameState(transaction);
    });
    this.players = this.playerService.getPlayers();
  }

  updateGameState(t: Transaction): void {
    this.dialogService.log('Updating gamestate with transaction ' + t);
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
