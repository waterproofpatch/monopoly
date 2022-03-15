import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { Game } from '../types';
import { BaseComponent } from '../base/base/base.component';
import { GamesApiService } from '../games-api.service';
import { PlayerService } from './player.service';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root',
})
export class GameService extends BaseComponent {
  games$ = new BehaviorSubject<Game[]>([]);
  selectedGameId: number = 0;

  constructor(
    private gamesApi: GamesApiService,
    private playerService: PlayerService,
    private transactionService: TransactionService
  ) {
    super();
  }

  newGame(gameName: string) {
    this.gamesApi.newGameHttp(gameName).subscribe((_) => this.getGames());
  }

  getGames() {
    this.gamesApi.getGamesHttp().subscribe((x) => this.games$.next(x));
  }

  getSelectedGame(): Observable<Game | undefined> {
    return this.games$.pipe(
      map((games) => games.find((x) => x.ID == this.selectedGameId))
    );
  }

  resumeGame(gameId: number) {
    this.selectedGameId = gameId;
    this.playerService.getPlayersForGame(gameId);
    this.transactionService.getTransactionsForGame(gameId);
  }
}
