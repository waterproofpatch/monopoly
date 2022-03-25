import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import * as _ from 'lodash';

import { BaseComponent } from '../components/base/base.component';
import { PlayersApiService } from '../api/players-api.service';
import { Player } from '../types';

@Injectable({
  providedIn: 'root',
})
export class PlayerService extends BaseComponent {
  players$ = new BehaviorSubject<Player[]>([]);
  playersCache: Player[] = [];

  constructor(private playersApi: PlayersApiService) {
    super();
    this.players$.subscribe((x) => {
      if (this.playersCache.length != x.length) {
        this.playersCache.push(...x);
        return;
      }
      for (let newPlayer of x) {
        let existingPlayer = this.playersCache.find(
          (x) => x.ID == newPlayer.ID
        );
        if (existingPlayer) {
          if (!_.isEqual(existingPlayer, newPlayer)) {
            console.log(
              'Player ID ' +
                existingPlayer.ID +
                ' is not equal to ' +
                newPlayer.ID
            );
            existingPlayer.human = newPlayer.human;
            existingPlayer.money = newPlayer.money;
            existingPlayer.inGame = newPlayer.inGame;
            existingPlayer.img = newPlayer.img;
            existingPlayer.name = newPlayer.name;
          }
        }
      }
    });
  }

  invalidatePlayersCache(): void {
    this.playersCache = [];
  }

  getPlayersCache(): Player[] {
    return this.playersCache;
  }

  findPlayerByName(name: string): Player | null {
    for (let p of this.playersCache) {
      if (p.name == name) {
        return p;
      }
    }
    return null;
  }

  getHumanPlayers(): Player[] {
    return this.playersCache.filter((x) => x.human && x.inGame);
  }
  getNonHumanPlayers(): Player[] {
    return this.playersCache.filter((x) => !x.human && x.inGame);
  }
  getInGamePlayers(): Player[] {
    return this.playersCache.filter((x) => x.inGame);
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
