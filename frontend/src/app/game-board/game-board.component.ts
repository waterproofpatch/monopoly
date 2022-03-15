import { Component, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { from, of, Observable, pipe } from 'rxjs';

import { Game, Player, Transaction } from '../types';
import { DialogService } from '../services/dialog-service/dialog.service';
import { TransactionService } from '../services/transaction.service';
import { PlayerService } from '../services/player.service';
import { GameService } from '../services/game.service';
import { BaseComponent } from '../base/base/base.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent extends BaseComponent implements OnInit {
  constructor(
    private dialogService: DialogService,
    public transactionService: TransactionService,
    public gameService: GameService,
    public playerService: PlayerService
  ) {
    super();
    this.gameService.getGames();
  }

  newGame(): void {
    this.dialogService
      .displayNewGameDialog()
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((name) => {
        this.gameService.newGame(name);
      });
  }

  ngOnInit(): void {}
}
