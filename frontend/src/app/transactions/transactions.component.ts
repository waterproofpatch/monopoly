import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { map, takeUntil, exhaustMap } from 'rxjs/operators';
import { of, Observable, BehaviorSubject } from 'rxjs';

import { TransactionService } from '../services/transaction.service';
import { Game, Transaction, Player } from '../types';
import { BaseComponent } from 'src/app/base/base/base.component';
import { DialogService } from '../services/dialog-service/dialog.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent extends BaseComponent implements OnInit {
  @Input() game?: Game; // from game-board
  transactions: Transaction[] = [];
  transactionsObserver = {
    next: (transactions: Transaction[]) => {
      this.transactions = transactions;
    },
    error: (err: Error) => console.log('observer got error ' + err),
    complete: () => console.log('observer is complete'),
  };

  constructor(private transactionService: TransactionService) {
    super();
    this.transactionService.transactions$.subscribe(this.transactionsObserver);
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    for (const propname in changes) {
      if (propname === 'game') {
        console.log('New game!');
        this.getTransactionsForGame(changes[propname].currentValue.ID);
      }
    }
  }

  getTransactionsForGame(gameId: number) {
    this.transactionService.updateTransactionsForGame(gameId);
  }
}
