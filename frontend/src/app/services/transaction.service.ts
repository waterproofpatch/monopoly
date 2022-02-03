import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Transaction, PlayersTransactionsResponse } from '../types';
import { DialogService } from './dialog-service/dialog.service';
import { PlayerService } from '../services/player.service';
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
  getTransactionsHttp(): Observable<PlayersTransactionsResponse> {
    return this.http
      .get<PlayersTransactionsResponse>(
        this.getUrlBase() + this.transactionsUrl,
        this.httpOptions
      )
      .pipe(
        tap((response) => {
          this.transactionSource.next(response.transactions);
          this.playerService.setPlayers(response.players);
        }),
        catchError(
          this.dialogService.handleError<PlayersTransactionsResponse>(
            'getTransactionsHttp'
          )
        )
      );
  }

  deleteTransactionHttp(
    transaction: Transaction
  ): Observable<PlayersTransactionsResponse> {
    const url = `${this.getUrlBase() + this.transactionsUrl}/${transaction.ID}`;

    return this.http
      .delete<PlayersTransactionsResponse>(url, this.httpOptions)
      .pipe(
        tap((response) => {
          this.transactionSource.next(response.transactions);
          this.playerService.setPlayers(response.players);
        }),
        catchError(
          this.dialogService.handleError<PlayersTransactionsResponse>(
            'deleteTransactionHttp'
          )
        )
      );
  }

  /** POST: add a new player to the server */
  addTransactionHttp(
    transaction: Transaction
  ): Observable<PlayersTransactionsResponse> {
    return this.http
      .post<PlayersTransactionsResponse>(
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
          this.dialogService.handleError<PlayersTransactionsResponse>(
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
