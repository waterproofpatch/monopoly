import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { GameService } from 'src/app/services/game.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { Game, Transaction } from 'src/app/types';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  @Input() game?: Game | null = null;

  constructor(
    public gameService: GameService,
    public transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    if (!this.game) {
      return;
    }
    // so we can get the number of transactions per game metadata
    this.transactionService.getTransactionsForGame();
  }

  /**
   * Obtain the nuber of transactions for this game.
   * @returns number of transactions for this game
   */
  numTransactions(): Observable<number> {
    if (!this.game) {
      return of(0);
    }
    return this.transactionService.transactions$.pipe(
      map(
        (x: Transaction[]) =>
          x.filter((x: Transaction) => x.gameId == this.game?.ID).length
      )
    );
  }
}
