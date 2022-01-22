import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Player } from '../types';
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
  private playerSource = new BehaviorSubject<Player[]>([]);
  playerObservable = this.playerSource.asObservable();

  constructor(private http: HttpClient, private dialogService: DialogService) {
    this.playerObservable.subscribe((x) => (this.players = x));
  }

  getUrlBase(): string {
    return environment.apiUrlBase;
  }

  setPlayers(players: Player[]) {
    this.playerSource.next(players);
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
        tap(
          (players) => this.playerSource.next(players),
          catchError(
            this.dialogService.handleError<Player[]>('getPlayersHttp', [])
          )
        )
      );
  }

  getPlayerByIdHttp(id: number) {
    const url = `${
      (this.getUrlBase() + this.playersUrl, this.httpOptions)
    }/${id}`;
    return this.http.get<Player>(url).pipe(
      tap((_) => console.log(`fetched hero id=${id}`)),
      catchError(this.dialogService.handleError<Player>(`getPlayer id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updatePlayerHttp(player: Player): Observable<any> {
    return this.http
      .put(this.getUrlBase() + this.playersUrl, player, this.httpOptions)
      .pipe(
        tap((_) => console.log(`updated player id=${player.name}`)),
        catchError(this.dialogService.handleError<any>('updatePlayer'))
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
        catchError(this.dialogService.handleError<Player>('addPlayer'))
      );
  }

  /** DELETE: delete the hero from the server */
  deletePlayerHttp(id: number): Observable<Player> {
    const url = `${this.getUrlBase() + this.playersUrl}/${id}`;

    return this.http.delete<Player>(url, this.httpOptions).pipe(
      tap((_) => console.log(`deleted player id=${id}`)),
      catchError(this.dialogService.handleError<Player>('deletePlayer'))
    );
  }

  removePlayer(player: Player) {
    player.inGame = false;
  }
}
