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
    private authenticationService: AuthenticationService
  ) {
    super();
    if (authenticationService.isAuthenticated) {
      this.gameService.getGames();
    }
  }

  ngOnInit(): void {}
}
