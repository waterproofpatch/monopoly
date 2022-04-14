import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import * as _ from 'lodash';

import { BaseComponent } from '../components/base/base.component';
import { PlayersApiService } from '../apis/players-api.service';
import { Player, Game } from '../types';

@Injectable({
  providedIn: 'root',
})
export class PlayerService extends BaseComponent {
  players$ = new BehaviorSubject<Player[]>([]);
  playersCache: Player[] = [];

  constructor(private playersApi: PlayersApiService) {
    super();
    // subscribing to players changes so we can update the cache in a way that
    // triggers the animated counter on money changes.
    this.players$.subscribe((x) => {
      if (this.playersCache.length == 0) {
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

  getHumanPlayers(gameId: number): Player[] {
    return this.playersCache.filter(
      (x: Player) => x.gameId == gameId && x.human
    );
  }

  getNonHumanPlayers(gameId: number): Player[] {
    return this.playersCache.filter(
      (x: Player) => x.gameId == gameId && !x.human
    );
  }

  getInGamePlayers(gameId: number): Player[] {
    return this.playersCache.filter(
      (x: Player) => x.gameId == gameId && x.inGame
    );
  }

  getPlayerImgUrl(playerId: number): Observable<string> {
    return this.players$.pipe(
      map((players) => players.find((x) => x.ID == playerId)),
      map((x) => x?.img ?? 'DEFAULT_' + playerId)
    );
  }

  getPlayersForGame() {
    this.playersApi
      .getPlayersHttp()
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

  /**
   * get the players for the specific gameId.
   * @param gameId the gameId to filter on.
   * @returns players for the @c gameId.
   */
  getPlayersForGameId(gameId: number): Observable<Player[]> {
    return this.players$.pipe(
      map((x: Player[]) => x.filter((x: Player) => x.gameId == gameId))
    );
  }
}
