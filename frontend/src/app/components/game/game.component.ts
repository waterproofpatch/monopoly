import { Component, Input, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { Game } from 'src/app/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    this.transactionService.getTransactionsForGame(this.game?.ID);
  }

  /**
   *
   * @returns Get the umber of transactions for this game
   */
  numTransactions(): Observable<number> {
    return this.transactionService.transactions$.pipe(map((x) => x.length));
  }
}
