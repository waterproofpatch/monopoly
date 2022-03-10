import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { BaseComponent } from '../base/base/base.component';
import { Player, ChangePlayerRequest } from '../types';
import { DialogService } from './dialog-service/dialog.service';
import { environment } from '../../environments/environment'; // Change this to your file location

@Injectable({
  providedIn: 'root',
})
export class PlayerService extends BaseComponent {
  playersUrl = '/api/players';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  constructor(private http: HttpClient, private dialogService: DialogService) {
    super();
  }

  getUrlBase(): string {
    return environment.apiUrlBase;
  }

  changePlayersHttp(first: Player, second: Player): Observable<Player[]> {
    let request: ChangePlayerRequest = {
      first: first,
      second: second,
    };
    return this.http
      .put<Player[]>(
        this.getUrlBase() + this.playersUrl,
        request,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.dialogService.handleError<Player[]>('changePlayersHttp', [])
        )
      );
  }

  /** GET players from the server */
  getPlayersHttp(gameId: number): Observable<Player[]> {
    return this.http
      .get<Player[]>(
        this.getUrlBase() + this.playersUrl + '?gameId=' + gameId,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.dialogService.handleError<Player[]>('getPlayersHttp', [])
        )
      );
  }

  getPlayerByIdHttp(id: number) {
    const url = `${
      (this.getUrlBase() + this.playersUrl, this.httpOptions)
    }/${id}`;
    return this.http
      .get<Player>(url)
      .pipe(
        catchError(this.dialogService.handleError<Player>(`getPlayer id=${id}`))
      );
  }

  /** PUT: update the hero on the server */
  updatePlayerHttp(player: Player): Observable<any> {
    return this.http
      .put(this.getUrlBase() + this.playersUrl, player, this.httpOptions)
      .pipe(catchError(this.dialogService.handleError<any>('updatePlayer')));
  }

  /** POST: add a new player to the server */
  addPlayerHttp(player: Player): Observable<Player> {
    return this.http
      .post<Player>(
        this.getUrlBase() + this.playersUrl,
        player,
        this.httpOptions
      )
      .pipe(catchError(this.dialogService.handleError<Player>('addPlayer')));
  }

  /** DELETE: delete the player from the server (by setting their inGame to false!) */
  deletePlayerHttp(player: Player): Observable<Player[]> {
    const url = `${this.getUrlBase() + this.playersUrl}/${player.ID}`;

    return this.http
      .delete<Player[]>(url, this.httpOptions)
      .pipe(
        catchError(this.dialogService.handleError<Player[]>('deletePlayer'))
      );
  }
}
