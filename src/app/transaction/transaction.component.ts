import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from '../types';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit {
  @Input() transaction?: Transaction; // from game-board
  @Input() transactions?: Transaction[]; // from game-board

  constructor(private logger: DialogService) {}

  ngOnInit(): void {}

  undoTransaction(): void {
    if (!this.transaction) {
      this.logger.displayErrorDialog('Transaction is not set!');
      return;
    }
    // really, just make a new transaction that is the reverse of this transaction
    let newTransaction: Transaction = {
      timestamp: new Date().toISOString(),
      toPlayer: this.transaction.fromPlayer,
      fromPlayer: this.transaction.toPlayer,
      amount: this.transaction.amount,
    };
    newTransaction.fromPlayer.money -= newTransaction.amount;
    newTransaction.toPlayer.money += newTransaction.amount;
    if (this.transactions) {
      const index = this.transactions.indexOf(this.transaction, 0);
      if (index > -1) {
        this.transactions.splice(index, 1);
      }
    }
  }
}
