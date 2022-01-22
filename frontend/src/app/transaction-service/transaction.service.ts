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
  transactionsUrl = '/api/transactions';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  transactions: Transaction[] = [];

  constructor(private http: HttpClient, private dialogService: DialogService) {}

  getUrlBase(): string {
    return environment.apiUrlBase;
  }

  /** GET players from the server */
  getTransactionsHttp(): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(
        this.getUrlBase() + this.transactionsUrl,
        this.httpOptions
      )
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

  deleteTransactionHttp(transaction: Transaction): Observable<Transaction> {
    const url = `${this.getUrlBase() + this.transactionsUrl}/${transaction.id}`;

    return this.http.delete<Transaction>(url, this.httpOptions).pipe(
      tap((_) => console.log(`deleted player id=${transaction.id}`)),
      catchError(this.handleError<Transaction>('deleteTransaction'))
    );
  }

  handleTransaction(transaction: Transaction): void {
    this.dialogService.log(
      'Transaction from ' +
        transaction.fromPlayer +
        ' to ' +
        transaction.toPlayer +
        ' in the amount of ' +
        transaction.amount
    );
  }
}
