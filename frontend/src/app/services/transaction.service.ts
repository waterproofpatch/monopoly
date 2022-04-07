import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Transaction } from '../types';
import { TransactionsApiService } from '../apis/transactions-api.service';
import { BaseComponent } from '../components/base/base.component';
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
    console.log('Setting transactions ' + transactions);
    this.transactions$.next(transactions);
    this.playerService.getPlayersForGame(gameId);
  }

  /**
   *
   * @param gameId Obtain all transactions for the given gameId.
   * @returns an observable list of transactions for the specified @c gameId.
   */
  getTransactionsForGameId(gameId: number): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((x: Transaction[]) => x.filter((x) => x.GameID == gameId))
    );
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

  deleteTransaction(transaction: Transaction) {
    this.transactionsApi
      .deleteTransactionHttp(transaction)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x, transaction.GameID));
  }
}
