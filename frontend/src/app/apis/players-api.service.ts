import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { BaseService } from '../services/base.service';
import { Player, ChangePlayerRequest } from '../types';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../services/dialog/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class PlayersApiService extends BaseService {
  apiUrl = '/api/players';
  constructor(private http: HttpClient, private dialogService: DialogService) {
    super();
  }
  changePlayersHttp(first: Player, second: Player): Observable<Player[]> {
    let request: ChangePlayerRequest = {
      first: first,
      second: second,
    };
    return this.http
      .put<Player[]>(
        this.getUrlBase() + this.apiUrl + '?gameId=' + first.GameID,
        request,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.dialogService.handleError<Player[]>('changePlayersHttp', [])
        )
      );
  }

  getPlayersHttp(gameId: number): Observable<Player[]> {
    return this.http
      .get<Player[]>(
        this.getUrlBase() + this.apiUrl + '?gameId=' + gameId,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.dialogService.handleError<Player[]>('getPlayersHttp', [])
        )
      );
  }

  getPlayerByIdHttp(playerId: number) {
    console.log('Get player ' + playerId);
    return this.http
      .get<Player>(
        this.getUrlBase() + this.apiUrl + '/' + playerId,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.dialogService.handleError<Player>(`getPlayer id=${playerId}`)
        )
      );
  }

  /** PUT: update the hero on the server */
  updatePlayerHttp(player: Player): Observable<any> {
    return this.http
      .put(this.getUrlBase() + this.apiUrl, player, this.httpOptions)
      .pipe(catchError(this.dialogService.handleError<any>('updatePlayer')));
  }

  /** POST: add a new player to the server */
  addPlayerHttp(player: Player): Observable<Player> {
    return this.http
      .post<Player>(this.getUrlBase() + this.apiUrl, player, this.httpOptions)
      .pipe(catchError(this.dialogService.handleError<Player>('addPlayer')));
  }

  /** DELETE: delete the player from the server (by setting their inGame to false!) */
  deletePlayerHttp(player: Player): Observable<Player[]> {
    const url = `${this.getUrlBase() + this.apiUrl}/${player.ID}?gameId=${
      player.GameID
    }`;

    return this.http
      .delete<Player[]>(url, this.httpOptions)
      .pipe(
        catchError(this.dialogService.handleError<Player[]>('deletePlayer'))
      );
  }
}
