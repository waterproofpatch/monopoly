import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BaseComponent } from '../base/base/base.component';
import { PlayersApiService } from '../players-api.service';
import { Player } from '../types';

@Injectable({
  providedIn: 'root',
})
export class PlayerService extends BaseComponent {
  players$ = new BehaviorSubject<Player[]>([]);

  constructor(private playersApi: PlayersApiService) {
    super();
  }

  getHumanPlayers(): Observable<Player[]> {
    return this.players$.pipe(map((players) => players.filter((x) => x.human)));
  }
  getNonHumanPlayers(): Observable<Player[]> {
    return this.players$.pipe(
      map((players) => players.filter((x) => !x.human))
    );
  }
  getInGamePlayers(): Observable<Player[]> {
    return this.players$.pipe(
      map((players) => players.filter((x) => x.inGame))
    );
  }

  getPlayersForGame(gameId: number) {
    this.playersApi
      .getPlayersHttp(gameId)
      .subscribe((x) => this.players$.next(x));
  }

  deletePlayer(player: Player) {
    this.playersApi
      .deletePlayerHttp(player)
      .subscribe((x) => this.players$.next(x));
  }

  changePlayer(oldPlayer: Player, newPlayer: Player) {
    this.playersApi
      .changePlayersHttp(oldPlayer, newPlayer)
      .subscribe((x) => this.players$.next(x));
  }
}
