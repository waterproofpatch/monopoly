import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Player, Transaction } from '../types';
import { DialogService } from '../dialog.service';
@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css'],
})
export class PlayerDetailComponent implements OnInit {
  @Input() player?: Player;
  @Input() players?: Player[]; // from players
  @Output() gameState = new EventEmitter<Transaction>();

  transactionForm = new FormGroup({
    otherPlayer: new FormControl(''),
    amount: new FormControl(''),
  });

  constructor(private logger: DialogService) {}

  ngOnInit(): void {}

  openPieceSelectDialog(): void {
    if (!this.player || !this.players) {
      this.logger.displayErrorDialog('Player is not set!');
      return;
    }
    this.logger.displayPieceSelectDialog(this.player, this.players);
  }
}
