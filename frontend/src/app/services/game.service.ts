import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Game } from '../types';
import { BaseComponent } from '../base/base.component';
import { GamesApiService } from '../api/games-api.service';

@Injectable({
  providedIn: 'root',
})
export class GameService extends BaseComponent {
  games$ = new BehaviorSubject<Game[]>([]);
  selectedGameId$ = new BehaviorSubject<number>(0);
  version$ = new BehaviorSubject<string>('Unknown...');

  constructor(private gamesApi: GamesApiService) {
    super();
    this.getGames();
  }

  getVersion() {
    this.gamesApi.getVersionHttp().subscribe((x) => {
      this.version$.next(x.version);
    });
  }

  deleteGame(game: Game) {
    this.gamesApi.deleteGameHttp(game).subscribe((x) => {
      this.selectedGameId$.next(0);
      this.games$.next(x);
    });
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
