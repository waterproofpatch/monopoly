import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Game } from './types';
import { DialogService } from './dialog-service/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class GameServiceService {
  games: Game[] = [];

  // Observable string sources
  private gameSource = new Subject<Game>();

  // Observable string streams
  game$ = this.gameSource.asObservable();

  constructor(private dialogService: DialogService) {}

  newGame(name: string) {
    if (!this.games) {
      this.dialogService.displayErrorDialog('No games set!');
      return;
    }
    let g: Game = {
      name: name,
    };
    this.gameSource.next(g);
    this.games.push(g);
  }

  getGames() {
    if (!this.games) {
      return [];
    }
    return this.games;
  }
}
