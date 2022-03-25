import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { BaseService } from '../services/base.service';
import { Transaction } from '../types';
import { DialogService } from '../services/dialog-service/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsApiService extends BaseService {
  apiUrl = '/api/transactions';
  constructor(private http: HttpClient, private dialogService: DialogService) {
    super();
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

  deleteTransactionHttp(transaction: Transaction): Observable<Transaction[]> {
    const url = `${this.getUrlBase() + this.apiUrl}/${transaction.ID}?gameId=${
      transaction.GameID
    }`;

    return this.http
      .delete<Transaction[]>(url, this.httpOptions)
      .pipe(
        catchError(
          this.dialogService.handleError<Transaction[]>('deleteTransactionHttp')
        )
      );
  }

  addTransactionHttp(
    transaction: Transaction,
    gameId: number
  ): Observable<Transaction[]> {
    return this.http
      .post<Transaction[]>(
        this.getUrlBase() + this.apiUrl + '?gameId=' + gameId,
        transaction,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.dialogService.handleError<Transaction[]>('addTransactionHttp')
        )
      );
  }
}
