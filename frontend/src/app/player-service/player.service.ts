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
  startingMoney: number = 1500;
  playersUrl = '/api/players';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  constructor(private http: HttpClient, private dialogService: DialogService) {}

  getUrlBase(): string {
    return environment.apiUrlBase;
  }

  /** GET heroes from the server */
  getPlayersHttp(): Observable<Player[]> {
    return this.http
      .get<Player[]>(this.getUrlBase() + this.playersUrl, this.httpOptions)
      .pipe(
        tap((_) => console.log('Fetched players')),
        catchError(this.handleError<Player[]>('getPlayers', []))
      );
  }

  getPlayerById(id: number) {
    const url = `${
      (this.getUrlBase() + this.playersUrl, this.httpOptions)
    }/${id}`;
    return this.http.get<Player>(url).pipe(
      tap((_) => console.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Player>(`getPlayer id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updatePlayer(player: Player): Observable<any> {
    return this.http
      .put(this.getUrlBase() + this.playersUrl, player, this.httpOptions)
      .pipe(
        tap((_) => console.log(`updated player id=${player.name}`)),
        catchError(this.handleError<any>('updatePlayer'))
      );
  }

  /** POST: add a new hero to the server */
  addHero(player: Player): Observable<Player> {
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
        catchError(this.handleError<Player>('addHero'))
      );
  }

  /** DELETE: delete the hero from the server */
  deletePlayer(id: number): Observable<Player> {
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

  // reset() {
  //   for (let p of this.players) {
  //     p.inGame = true;
  //     if (p.name == 'Free Parking') {
  //       p.money = 0;
  //     } else {
  //       p.money = this.startingMoney;
  //     }
  //   }
  // }
}
