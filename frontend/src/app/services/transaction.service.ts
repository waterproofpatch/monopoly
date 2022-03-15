import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { Transaction } from '../types';
import { TransactionsApiService } from '../transactions-api.service';
import { BaseComponent } from '../base/base/base.component';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends BaseComponent {
  transactions$ = new BehaviorSubject<Transaction[]>([]);

  constructor(private transactionsApi: TransactionsApiService) {
    super();
  }

  private setTransactions(transactions: Transaction[]) {
    this.transactions$.next(transactions);
  }

  addTransaction(transaction: Transaction, gameId: number) {
    this.transactionsApi
      .addTransactionHttp(transaction, gameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x));
  }

  getTransactionsForGame(gameId: number) {
    this.transactionsApi
      .getTransactionsHttp(gameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x));
  }

  updateTransactionsForGame(gameId: number) {
    this.transactionsApi
      .getTransactionsHttp(gameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x));
  }

  deleteTransaction(transactionId: number) {
    this.transactionsApi
      .deleteTransactionHttp(transactionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x));
  }
}
