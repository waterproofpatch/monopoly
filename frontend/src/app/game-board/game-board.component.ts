import { Component, OnInit } from '@angular/core';

import { Player, Transaction } from '../types';
import { DialogService } from '../dialog-service/dialog.service';
import { TransactionService } from '../transaction-service/transaction.service';
import { PlayerService } from '../player-service/player.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  players: Player[] = [];
  transactions: Transaction[] = [];

  constructor(
    private dialogService: DialogService,
    private transactionService: TransactionService,
    public playerService: PlayerService
  ) {
    // start receiving notifications whenever the transaction list changes
    this.transactionService.transactionObservable.subscribe(
      (x) => (this.transactions = x)
    );
    // start receiving notifications whenever the players list changes
    this.playerService.playerObservable.subscribe((x) => (this.players = x));
  }

  newGame(): void {
    this.dialogService.displayLogDialog('New game started!');

    // get the initial set of players and transactions
    this.playerService
      .getPlayersHttp()
      .subscribe((players) => (this.players = players));
    this.transactionService.getTransactionsHttp().subscribe();
  }

  ngOnInit(): void {}
}
