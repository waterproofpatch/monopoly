import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game.service';
import { AuthenticationService } from '../../services/authentication.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent extends BaseComponent implements OnInit {
  constructor(
    public gameService: GameService,
    public authenticationService: AuthenticationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.authenticationService.loginEvent$.subscribe((x) => {
      if (x) {
        this.gameService.getGames();
      }
    });
  }
}
