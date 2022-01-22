import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Transaction, AddTransactionResponse } from '../types';
import { DialogService } from '../dialog-service/dialog.service';
import { PlayerService } from '../player-service/player.service';
import { environment } from '../../environments/environment'; // Change this to your file location

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
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
  ) {}

  getUrlBase(): string {
    return environment.apiUrlBase;
  }

  /** GET players from the server */
  getTransactionsHttp(): Observable<AddTransactionResponse> {
    return this.http
      .get<AddTransactionResponse>(
        this.getUrlBase() + this.transactionsUrl,
        this.httpOptions
      )
      .pipe(
        tap((response) => {
          this.transactionSource.next(response.transactions);
          this.playerService.setPlayers(response.players);
        }),
        catchError(
          this.dialogService.handleError<AddTransactionResponse>(
            'getTransactionsHttp'
          )
        )
      );
  }

  deleteTransactionHttp(
    transaction: Transaction
  ): Observable<AddTransactionResponse> {
    const url = `${this.getUrlBase() + this.transactionsUrl}/${transaction.ID}`;

    return this.http.delete<AddTransactionResponse>(url, this.httpOptions).pipe(
      tap((response) => {
        this.transactionSource.next(response.transactions);
        this.playerService.setPlayers(response.players);
      }),
      catchError(
        this.dialogService.handleError<AddTransactionResponse>(
          'deleteTransactionHttp'
        )
      )
    );
  }

  /** POST: add a new player to the server */
  addTransactionHttp(
    transaction: Transaction
  ): Observable<AddTransactionResponse> {
    return this.http
      .post<AddTransactionResponse>(
        this.getUrlBase() + this.transactionsUrl,
        transaction,
        this.httpOptions
      )
      .pipe(
        tap((response) => {
          this.transactionSource.next(response.transactions);
          this.playerService.setPlayers(response.players);
        }),
        catchError(
          this.dialogService.handleError<AddTransactionResponse>(
            'addTransactionHttp'
          )
        )
      );
  }

  handleTransaction(transaction: Transaction): void {
    this.addTransactionHttp(transaction).subscribe((x) => {
      console.log('Transaction handled!');
    });
  }
}
