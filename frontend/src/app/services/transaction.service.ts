import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, from, of, Observable } from 'rxjs';

import { Transaction } from '../types';
import { DialogService } from './dialog-service/dialog.service';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends BaseService {
  apiUrl = '/api/transactions';

  transactions$ = new BehaviorSubject<Transaction[]>([]);

  constructor(private http: HttpClient, private dialogService: DialogService) {
    super();
  }

  private setTransactions(transactions: Transaction[]) {
    this.transactions$.next(transactions);
  }

  updateTransactionsForGame(gameId: number) {
    this.getTransactionsHttp(gameId).subscribe((x) => this.setTransactions(x));
  }

  getTransactionsHttp(gameId: number): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(
        this.getUrlBase() + this.apiUrl + '?gameId=' + gameId,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.dialogService.handleError<Transaction[]>('getTransactionsHttp')
        )
      );
  }

  deleteTransactionHttp(transactionId: number): Observable<Transaction[]> {
    const url = `${this.getUrlBase() + this.apiUrl}/${transactionId}`;

    return this.http.delete<Transaction[]>(url, this.httpOptions).pipe(
      tap((x) => this.setTransactions(x)),
      catchError(
        this.dialogService.handleError<Transaction[]>('deleteTransactionHttp')
      )
    );
  }

  addTransactionHttp(transaction: Transaction): Observable<Transaction[]> {
    return this.http
      .post<Transaction[]>(
        this.getUrlBase() + this.apiUrl,
        transaction,
        this.httpOptions
      )
      .pipe(
        tap((x) => this.setTransactions(x)),
        catchError(
          this.dialogService.handleError<Transaction[]>('addTransactionHttp')
        )
      );
  }
}
