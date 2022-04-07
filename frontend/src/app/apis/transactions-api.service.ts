import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../services/base.service';
import { Transaction } from '../types';
import { DialogService } from '../services/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsApiService extends BaseService {
  apiUrl = '/api/transactions';
  constructor(private http: HttpClient, private dialogService: DialogService) {
    super();
  }

  getTransactionsHttp(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      this.getUrlBase() + this.apiUrl,
      this.httpOptions
    );
  }

  deleteTransactionHttp(transaction: Transaction): Observable<Transaction[]> {
    const url = `${this.getUrlBase() + this.apiUrl}/${transaction.ID}`;

    return this.http.delete<Transaction[]>(url, this.httpOptions);
  }

  addTransactionHttp(transaction: Transaction): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(
      this.getUrlBase() + this.apiUrl,
      transaction,
      this.httpOptions
    );
  }
}
