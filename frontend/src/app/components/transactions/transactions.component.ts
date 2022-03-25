import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import { TransactionService } from '../../services/transaction.service';
import { BaseComponent } from 'src/app/base/base.component';

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
