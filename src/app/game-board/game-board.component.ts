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
  playerStates: Array<Player[]> = new Array<Player[]>();
  transactionStates: Array<Transaction[]> = new Array<Transaction[]>();

  constructor(
    private dialogService: DialogService,
    private transactionService: TransactionService,
    public playerService: PlayerService
  ) {
    // whenever a component registers a transaction, process it here.
    transactionService.transaction$.subscribe((transaction) => {
      this.updateGameState(transaction);
    });
  }

  reset(): void {
    this.playerService.reset();
  }

  updateGameState(t: Transaction): void {
    this.dialogService.log('Updating gamestate with transaction ' + t);
    let clonedPlayers: Player[] = this.playerService
      .getPlayers()
      .map((x) => Object.assign({}, x));
    let clonedTransactions: Transaction[] = this.transactionService
      .getTransactions()
      .map((x) => Object.assign({}, x));
    this.playerStates.push(clonedPlayers);
    this.transactionStates.push(clonedTransactions);
  }

  ngOnInit(): void {}
}
