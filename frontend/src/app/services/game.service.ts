import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Game } from '../types';
import { DialogService } from './dialog-service/dialog.service';
import { PlayerService } from './player.service';
import { TransactionService } from './transaction.service';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class GameService extends BaseService {
  apiUrl = '/api/games';

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
