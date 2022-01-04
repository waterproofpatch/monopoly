import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Player, Transaction } from '../player';
import { LogService } from '../log-service.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  @Input() players?: Player[]; // from game-board
  @Input() transactions?: Transaction[]; // from game-board
  @Output() gameState = new EventEmitter<Transaction>();

  constructor(private logger: LogService) {}

  ngOnInit(): void {}

  updateGameState(t: Transaction): void {
    // forward the event up to the game board
    this.gameState.emit(t);
  }
  undoTransaction(transaction: Transaction): void {
    // really, just make a new transaction that is the reverse of this transaction
    let newTransaction: Transaction = {
      timestamp: new Date().toISOString(),
      toPlayer: transaction.fromPlayer,
      fromPlayer: transaction.toPlayer,
      amount: transaction.amount,
    };
    newTransaction.fromPlayer.money -= newTransaction.amount;
    newTransaction.toPlayer.money += newTransaction.amount;
    if (this.transactions) {
      const index = this.transactions.indexOf(transaction, 0);
      if (index > -1) {
        this.transactions.splice(index, 1);
      }
    }
  }
}
