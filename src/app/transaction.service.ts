import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Transaction } from './types';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor() {}
  // Observable string sources
  private transactionSource = new Subject<Transaction>();

  // Observable string streams
  transaction$ = this.transactionSource.asObservable();

  doTransaction(t: Transaction) {
    this.transactionSource.next(t);
  }
}
