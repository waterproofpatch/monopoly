import { Component, OnInit } from '@angular/core';

import { GameService } from '../../services/game.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent extends BaseComponent implements OnInit {
  constructor(public gameService: GameService) {
    super();
    this.gameService.getGames();
  }

  ngOnInit(): void {}
}
