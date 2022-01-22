import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';
import { Transaction } from '../types';
import { DialogService } from '../dialog-service/dialog.service';
import { environment } from '../../environments/environment'; // Change this to your file location
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  playersUrl = '/api/transactions';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  transactions: Transaction[] = [];
  // Observable string sources
  private transactionSource = new Subject<Transaction>();

  // Observable string streams
  transaction$ = this.transactionSource.asObservable();

  constructor(private http: HttpClient, private dialogService: DialogService) {}

  getUrlBase(): string {
    return environment.apiUrlBase;
  }

  /** GET players from the server */
  getTransactionsHttp(): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(this.getUrlBase() + this.playersUrl, this.httpOptions)
      .pipe(
        tap((_) => console.log('Fetched players')),
        catchError(this.handleError<Transaction[]>('getTransactionsHttp', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.dialogService.displayErrorDialog(
        `${operation} failed: ${error.message}`
      );

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private doTransaction(t: Transaction) {
    this.transactionSource.next(t);
    this.transactions.push(t);
  }

  reset() {
    this.transactions = [];
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  handleTransaction(transaction: Transaction): void {
    this.dialogService.log(
      'Transaction from ' +
        transaction.fromPlayer.name +
        ' to ' +
        transaction.toPlayer.name +
        ' in the amount of ' +
        transaction.amount
    );

    // the bank has unlimited money
    if (
      transaction.fromPlayer.name != 'Bank' &&
      transaction.fromPlayer.money < transaction.amount
    ) {
      this.dialogService.displayErrorDialog(
        'Not enough money. Must raise $' +
          (transaction.amount - transaction.fromPlayer.money) +
          '.'
      );
      return;
    }

    this.doTransaction(transaction);

    transaction.fromPlayer.money -= transaction.amount;
    transaction.toPlayer.money += transaction.amount;
  }
}
