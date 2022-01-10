import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from '../types';
import { DialogService } from '../dialog-service/dialog.service';
import { TransactionService } from '../transaction-service/transaction.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit {
  @Input() transaction?: Transaction; // from game-board

  constructor(
    private dialogService: DialogService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {}

  undoTransaction(): void {
    if (!this.transaction) {
      this.dialogService.displayErrorDialog('Transaction is not set!');
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
    if (this.transactionService.getTransactions()) {
      const index = this.transactionService
        .getTransactions()
        .indexOf(this.transaction, 0);
      if (index > -1) {
        this.transactionService.getTransactions().splice(index, 1);
      }
    }
  }
}
