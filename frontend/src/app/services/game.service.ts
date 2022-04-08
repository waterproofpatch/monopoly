import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Game } from '../types';
import { BaseComponent } from '../components/base/base.component';
import { GamesApiService } from '../apis/games-api.service';

@Injectable({
  providedIn: 'root',
})
export class GameService extends BaseComponent {
  games$ = new BehaviorSubject<Game[]>([]);
  selectedGameId: number = 0;
  version$ = new BehaviorSubject<string>('Unknown...');

  constructor(private gamesApi: GamesApiService) {
    super();
  }

  getVersion() {
    this.gamesApi.getVersionHttp().subscribe((x) => {
      this.version$.next(x.version);
    });
  }

  deleteGame(game: Game) {
    this.gamesApi.deleteGameHttp(game).subscribe((x: Game[]) => {
      this.games$.next(x);
    });
  }

  newGame(gameName: string) {
    this.gamesApi.newGameHttp(gameName).subscribe((x) => {
      this.selectedGameId = x.ID;
      this.getGames();
    });
  }

  getGames() {
    this.gamesApi.getGamesHttp().subscribe((x) => this.games$.next(x));
  }

  resumeGame(gameId: number) {
    console.log('Selected gameId is ' + gameId);
    this.selectedGameId = gameId;
  }

  getSelectedGame(): Observable<Game> {
    return this.games$.pipe(
      map((x: Game[]) => x.filter((x: Game) => x.ID == this.selectedGameId)[0])
    );
  }
}
