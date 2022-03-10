import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

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
  games: Game[] = [];
  selectedGame?: Game;

  constructor(
    private dialogService: DialogService,
    public transactionService: TransactionService,
    private gamesServices: GameService,
    public playerService: PlayerService
  ) {
    super();
    this.getGames();
  }

  newGame(): void {
    // this.dialogService
    //   .displayNewGameDialog()
    //   .afterClosed()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((name) => {
    //     this.gamesServices.newGame(name);
    //   });
    this.gamesServices
      .newGameHttp('New Game!!!')
      .subscribe((x) => this.games.push(x));
  }

  getGames(): void {
    this.gamesServices
      .getGamesHttp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => (this.games = x));
  }

  resumeGame(gameId: number): void {
    console.log('Resuming game ' + gameId);
    this.selectedGame = this.games.filter((x) => x.ID == gameId)[0];
  }

  ngOnInit(): void {}
}
