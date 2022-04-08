import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import { TransactionService } from '../../services/transaction.service';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Game } from 'src/app/types';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent extends BaseComponent implements OnInit {
  @Input() game?: Game | null; // from game-board

  constructor(public transactionService: TransactionService) {
    super();
  }

  ngOnInit(): void {}
}
