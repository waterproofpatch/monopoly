import { Injectable } from '@angular/core';
import { Player } from './types';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  STARTING_MONEY: number = 1500;
  PLAYERS: Player[] = [
    { img: 'dog', name: 'Dog', money: this.STARTING_MONEY, human: true },
    { img: 'ship', name: 'Ship', money: this.STARTING_MONEY, human: true },
    { img: 'dino', name: 'Dinosaur', money: this.STARTING_MONEY, human: true },
    { img: 'car', name: 'Car', money: this.STARTING_MONEY, human: true },
    { img: 'cat', name: 'Cat', money: this.STARTING_MONEY, human: true },
    { img: 'duck', name: 'Duck', money: this.STARTING_MONEY, human: true },
    {
      img: 'penguin',
      name: 'Penguin',
      money: this.STARTING_MONEY,
      human: true,
    },
    { img: 'bank', name: 'Bank', money: 0, human: false },
    { img: 'parking', name: 'Free Parking', money: 0, human: false },
  ];

  constructor() {}

  getPlayers(): Player[] {
    return this.PLAYERS;
  }

  removePlayer(player: Player) {
    const index = this.PLAYERS.indexOf(player, 0);
    if (index > -1) {
      this.PLAYERS.splice(index, 1);
    }
  }
}
