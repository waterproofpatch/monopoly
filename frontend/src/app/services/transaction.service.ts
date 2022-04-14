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

  private setTransactions(transactions: Transaction[]) {
    console.log('Setting transactions ' + transactions);
    this.transactions$.next(transactions);
    this.playerService.getPlayersForGame();
  }

  /**
   *
   * @param gameId Obtain all transactions for the given gameId.
   * @returns an observable list of transactions for the specified @c gameId.
   */
  getTransactionsForGameId(gameId: number): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((x: Transaction[]) => x.filter((x) => x.gameId == gameId))
    );
  }

  addTransaction(transaction: Transaction, gameId: number) {
    this.transactionsApi
      .addTransactionHttp(transaction)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x));
  }

  getTransactionsForGame() {
    this.transactionsApi
      .getTransactionsHttp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x));
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionsApi
      .deleteTransactionHttp(transaction)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTransactions(x));
  }
}
