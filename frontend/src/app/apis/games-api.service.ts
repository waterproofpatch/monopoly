import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';

import { DialogService } from '../services/dialog.service';
import { BaseService } from '../services/base.service';
import { Game, Version } from '../types';
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

  deleteGameHttp(game: Game): Observable<Game[]> {
    const url = `${this.getUrlBase() + this.apiUrl}/${game.ID}`;

    return this.http.delete<Game[]>(url, this.httpOptions);
  }

  getVersionHttp(): Observable<Version> {
    return this.http.get<Version>(
      this.getUrlBase() + '/api/version',
      this.httpOptions
    );
  }

  getGamesHttp(): Observable<Game[]> {
    return this.http.get<Game[]>(
      this.getUrlBase() + this.apiUrl,
      this.httpOptions
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
        })
      );
  }
}
