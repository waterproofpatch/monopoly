import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, takeUntil } from 'rxjs/operators';

import { DialogService } from './services/dialog-service/dialog.service';
import { BaseService } from './base.service';
import { Game } from './types';
import { PlayerService } from './services/player.service';
import { TransactionService } from './services/transaction.service';
import { TransactionsApiService } from './transactions-api.service';
import { PlayersApiService } from './players-api.service';

@Injectable({
  providedIn: 'root',
})
export class GamesApiService extends BaseService {
  apiUrl = '/api/games';

  constructor(
    private http: HttpClient,
    private dialogService: DialogService,
    private playersApi: PlayersApiService,
    private transactionsApi: TransactionsApiService
  ) {
    super();
  }

  getGamesHttp(): Observable<Game[]> {
    return this.http
      .get<Game[]>(this.getUrlBase() + this.apiUrl, this.httpOptions)
      .pipe(
        tap((games) => {},
        catchError(this.dialogService.handleError<Game[]>('getGamesHttp')))
      );
  }
  newGameHttp(name: string): Observable<Game> {
    return this.http
      .post<Game>(
        this.getUrlBase() + this.apiUrl,
        { name: name },
        this.httpOptions
      )
      .pipe(
        tap((game) => {
          this.playersApi
            .getPlayersHttp(game.ID)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
          this.transactionsApi
            .getTransactionsHttp(game.ID)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        }, catchError(this.dialogService.handleError<Game>('newGameHttp')))
      );
  }
}
