import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { Transaction } from '../types';
import { TransactionsApiService } from '../transactions-api.service';
import { BaseComponent } from '../base/base/base.component';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends BaseComponent {
  transactions$ = new BehaviorSubject<Transaction[]>([]);

  constructor(
    private transactionsApi: TransactionsApiService,
    private playerService: PlayerService
  ) {
    super();
  }

  private setTransactions(transactions: Transaction[], gameId: number) {
    this.transactions$.next(transactions);
    this.playerService.getPlayersForGame(gameId);
  }

  addTransaction(transaction: Transaction, gameId: number) {
    this.transactionsApi
      .addTransactionHttp(transaction, gameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x, gameId));
  }

  getTransactionsForGame(gameId: number) {
    this.transactionsApi
      .getTransactionsHttp(gameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x, gameId));
  }

  updateTransactionsForGame(gameId: number) {
    this.transactionsApi
      .getTransactionsHttp(gameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x, gameId));
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionsApi
      .deleteTransactionHttp(transaction.ID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x, transaction.GameID));
  }
}
