import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { BaseComponent } from '../base/base/base.component';
import { Transaction } from '../types';
import { DialogService } from './dialog-service/dialog.service';
import { PlayerService } from '../services/player.service';
import { environment } from '../../environments/environment'; // Change this to your file location

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends BaseComponent {
  transactionsUrl = '/api/transactions';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  private transactionSource = new BehaviorSubject<Transaction[]>([]);
  transactionObservable = this.transactionSource.asObservable();

  constructor(
    private http: HttpClient,
    private playerService: PlayerService,
    private dialogService: DialogService
  ) {
    super();
  }

  getUrlBase(): string {
    return environment.apiUrlBase;
  }

  getTransactionsHttp(gameId: number): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(
        this.getUrlBase() + this.transactionsUrl + '?gameId=' + gameId,
        this.httpOptions
      )
      .pipe(
        tap((transactions) => {
          this.setTransactions(transactions);
        }),
        catchError(
          this.dialogService.handleError<Transaction[]>('getTransactionsHttp')
        )
      );
  }

  deleteTransactionHttp(transaction: Transaction): Observable<Transaction[]> {
    const url = `${this.getUrlBase() + this.transactionsUrl}/${transaction.ID}`;

    return this.http.delete<Transaction[]>(url, this.httpOptions).pipe(
      tap((transactions) => {
        this.setTransactions(transactions);
        this.playerService
          .getPlayersHttp(transaction.GameID)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      }),
      catchError(
        this.dialogService.handleError<Transaction[]>('deleteTransactionHttp')
      )
    );
  }

  addTransactionHttp(transaction: Transaction): Observable<Transaction[]> {
    return this.http
      .post<Transaction[]>(
        this.getUrlBase() + this.transactionsUrl,
        transaction,
        this.httpOptions
      )
      .pipe(
        tap((transactions) => {
          this.setTransactions(transactions);
          this.playerService
            .getPlayersHttp(transaction.GameID)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        }),
        catchError(
          this.dialogService.handleError<Transaction[]>('addTransactionHttp')
        )
      );
  }

  handleTransaction(transaction: Transaction): void {
    this.addTransactionHttp(transaction)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        console.log('Transaction handled!');
      });
  }

  setTransactions(transactions: Transaction[]) {
    this.transactionSource.next(transactions);
  }
}
