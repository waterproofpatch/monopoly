import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';

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

  getPlayerImgUrl(playerId: number): Observable<string> {
    return this.players$.pipe(
      map((players) => players.find((x) => x.ID == playerId)),
      map((x) => x?.img ?? 'DEFAULT_' + playerId)
    );
  }

  getPlayersForGame(gameId: number) {
    this.playersApi
      .getPlayersHttp(gameId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.players$.next(x));
  }

  deletePlayer(player: Player) {
    this.playersApi
      .deletePlayerHttp(player)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.players$.next(x));
  }

  changePlayer(oldPlayer: Player, newPlayer: Player) {
    this.playersApi
      .changePlayersHttp(oldPlayer, newPlayer)
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.players$.next(x));
  }
}
