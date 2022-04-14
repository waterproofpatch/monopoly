import {
  Component,
  OnChanges,
  OnInit,
  Input,
  SimpleChanges,
} from '@angular/core';

import { TransactionService } from '../../services/transaction.service';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Game } from 'src/app/types';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @Input() game?: Game | null; // from game-board

  constructor(public transactionService: TransactionService) {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['game']) {
      console.log('game changes for transcations component');
      this.transactionService.getTransactionsForGame();
    }
  }
}
