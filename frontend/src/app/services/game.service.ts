import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { PlayersTransactionsResponse, Game } from '../types';
import { DialogService } from './dialog-service/dialog.service';
import { PlayerService } from './player.service';
import { TransactionService } from './transaction.service';
import { BaseComponent } from '../base/base/base.component';

@Injectable({
  providedIn: 'root',
})
export class GameService extends BaseComponent {
  gamesUrl = '/api/games';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  private gameSource = new Subject<Game>();
  gameObservable = this.gameSource.asObservable();

  constructor(
    private http: HttpClient,
    private dialogService: DialogService,
    private playerService: PlayerService,
    private transactionService: TransactionService
  ) {
    super();
  }

  getUrlBase(): string {
    return environment.apiUrlBase;
  }

  newGame(): void {
    this.newGameHttp()
      .pipe(takeUntil(this.destroy$))
      .subscribe((_) =>
        this.dialogService.displayLogDialog('New game started!')
      );
  }

  getGamesHttp(): Observable<Game[]> {
    return this.http
      .get<Game[]>(this.getUrlBase() + this.gamesUrl, this.httpOptions)
      .pipe(
        tap((games) => {},
        catchError(this.dialogService.handleError<Game[]>('getGamesHttp')))
      );
  }

  newGameHttp(): Observable<Game> {
    return this.http
      .post<Game>(this.getUrlBase() + this.gamesUrl, this.httpOptions)
      .pipe(
        tap((game) => {
          this.playerService
            .getPlayersHttp(game.ID)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
          this.transactionService
            .getTransactionsHttp(game.ID)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        }, catchError(this.dialogService.handleError<Game>('newGameHttp')))
      );
  }
}
