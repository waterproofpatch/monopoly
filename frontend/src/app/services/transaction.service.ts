import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { BaseComponent } from '../base/base/base.component';
import { Transaction } from '../types';
import { DialogService } from './dialog-service/dialog.service';
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

  constructor(private http: HttpClient, private dialogService: DialogService) {
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
        catchError(
          this.dialogService.handleError<Transaction[]>('getTransactionsHttp')
        )
      );
  }

  deleteTransactionHttp(transactionId: number): Observable<Transaction[]> {
    const url = `${this.getUrlBase() + this.transactionsUrl}/${transactionId}`;

    return this.http
      .delete<Transaction[]>(url, this.httpOptions)
      .pipe(
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
        catchError(
          this.dialogService.handleError<Transaction[]>('addTransactionHttp')
        )
      );
  }
}
