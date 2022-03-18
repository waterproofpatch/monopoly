import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  selectedGameId$ = new BehaviorSubject<number>(0);

  constructor(private gamesApi: GamesApiService) {
    super();
    this.getGames();
  }

  newGame(gameName: string) {
    this.gamesApi.newGameHttp(gameName).subscribe((x) => {
      this.selectedGameId$.next(x.ID);
      this.getGames();
    });
  }

  getGames() {
    this.gamesApi.getGamesHttp().subscribe((x) => this.games$.next(x));
  }

  resumeGame(gameId: number) {
    console.log('Selected gameId is ' + gameId);
    this.selectedGameId$.next(gameId);
  }
}
