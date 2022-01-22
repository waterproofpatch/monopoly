import { Injectable } from '@angular/core';
import { Player } from '../types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DialogService } from '../dialog-service/dialog.service';
import { environment } from '../../environments/environment'; // Change this to your file location

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  playersUrl = '/api/players';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };
  players: Player[] = [];

  constructor(private http: HttpClient, private dialogService: DialogService) {}

  getUrlBase(): string {
    return environment.apiUrlBase;
  }

  getPlayerByName(name: string): Player | null {
    for (let p of this.players) {
      if (p.name == name) {
        return p;
      }
    }
    return null;
  }

  /** GET players from the server */
  getPlayersHttp(): Observable<Player[]> {
    return this.http
      .get<Player[]>(this.getUrlBase() + this.playersUrl, this.httpOptions)
      .pipe(
        tap((players) => (this.players = players)),
        catchError(this.handleError<Player[]>('getPlayersHttp', []))
      );
  }

  getPlayerByIdHttp(id: number) {
    const url = `${
      (this.getUrlBase() + this.playersUrl, this.httpOptions)
    }/${id}`;
    return this.http.get<Player>(url).pipe(
      tap((_) => console.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Player>(`getPlayer id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updatePlayerHttp(player: Player): Observable<any> {
    return this.http
      .put(this.getUrlBase() + this.playersUrl, player, this.httpOptions)
      .pipe(
        tap((_) => console.log(`updated player id=${player.name}`)),
        catchError(this.handleError<any>('updatePlayer'))
      );
  }

  /** POST: add a new player to the server */
  addPlayerHttp(player: Player): Observable<Player> {
    return this.http
      .post<Player>(
        this.getUrlBase() + this.playersUrl,
        player,
        this.httpOptions
      )
      .pipe(
        tap((newPlayer: Player) =>
          console.log(`added player w/ id=${newPlayer.name}`)
        ),
        catchError(this.handleError<Player>('addPlayer'))
      );
  }

  /** DELETE: delete the hero from the server */
  deletePlayerHttp(id: number): Observable<Player> {
    const url = `${this.getUrlBase() + this.playersUrl}/${id}`;

    return this.http.delete<Player>(url, this.httpOptions).pipe(
      tap((_) => console.log(`deleted player id=${id}`)),
      catchError(this.handleError<Player>('deletePlayer'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.dialogService.displayErrorDialog(
        `${operation} failed: ${error.message}`
      );

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  removePlayer(player: Player) {
    player.inGame = false;
  }
}
