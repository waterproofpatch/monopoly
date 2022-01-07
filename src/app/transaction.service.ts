import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Transaction } from './types';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private logger: DialogService) {}
  // Observable string sources
  private transactionSource = new Subject<Transaction>();

  // Observable string streams
  transaction$ = this.transactionSource.asObservable();

  private doTransaction(t: Transaction) {
    this.transactionSource.next(t);
  }

  handleTransaction(transaction: Transaction): void {
    this.logger.log(
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
      this.logger.displayErrorDialog(
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