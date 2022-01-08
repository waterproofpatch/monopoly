import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Transaction } from '../types';
import { DialogService } from '../dialog-service/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private dialogService: DialogService) {}
  transactions: Transaction[] = [];

  // Observable string sources
  private transactionSource = new Subject<Transaction>();

  // Observable string streams
  transaction$ = this.transactionSource.asObservable();

  private doTransaction(t: Transaction) {
    this.transactionSource.next(t);
    this.transactions.push(t);
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  handleTransaction(transaction: Transaction): void {
    this.dialogService.log(
      'Transaction from ' +
        transaction.fromPlayer.name +
        ' to ' +
        transaction.toPlayer.name +
        ' in the amount of ' +
        transaction.amount
    );

    // the bank has unlimited money
    if (
      transaction.fromPlayer.name != 'Bank' &&
      transaction.fromPlayer.money < transaction.amount
    ) {
      this.dialogService.displayErrorDialog(
        'Not enough money. Must raise $' +
          (transaction.amount - transaction.fromPlayer.money) +
          '.'
      );
      return;
    }

    this.doTransaction(transaction);

    transaction.fromPlayer.money -= transaction.amount;
    transaction.toPlayer.money += transaction.amount;
  }
}
