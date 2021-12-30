import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Player, Transaction } from '../player';
import { LogService } from '../log-service.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  @Input() players?: Player[]; // from game-board
  @Output() gameState = new EventEmitter<Transaction>();
  selectedPlayer?: Player;
  errorMsg: string = '';

  constructor(private logger: LogService) {}

  ngOnInit(): void {}
  ngOnChanges(): void {
    this.errorMsg = '';
  }

  onSelect(player: Player): void {
    this.errorMsg = '';
    this.selectedPlayer = player;
  }

  handleTransaction(event: Transaction): void {
    this.logger.log(
      'Transaction from ' +
        event.fromPlayer.name +
        ' to ' +
        event.toPlayer.name +
        ' in the amount of ' +
        event.amount
    );

    this.errorMsg = '';

    // the bank has unlimited money
    if (
      event.fromPlayer.name != 'Bank' &&
      event.fromPlayer.money < event.amount
    ) {
      this.errorMsg = 'Not enough money!';
      return;
    }

    this.gameState.emit(event);

    event.fromPlayer.money -= event.amount;
    event.toPlayer.money += event.amount;

    // store the transaction in each player
    event.fromPlayer.transactions.push(event);
    event.toPlayer.transactions.push(event);
  }
}
