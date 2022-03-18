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
  @Input() gameId?: number | null; // from game-board

  constructor(public transactionService: TransactionService) {
    super();
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['gameId']) {
      console.log('TRANSACTIONS: GAME CHANGED');
      this.transactionService.getTransactionsForGame(
        changes['gameId'].currentValue
      );
    }
  }
}
