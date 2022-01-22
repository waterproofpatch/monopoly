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
  ) {}

  newGame(): void {
    this.dialogService.displayLogDialog('New game started!');

    this.playerService
      .getPlayersHttp()
      .subscribe((players) => (this.players = players));
    this.transactionService
      .getTransactionsHttp()
      .subscribe((transactions) => (this.transactions = transactions));
  }

  ngOnInit(): void {}
}
