import { Injectable } from '@angular/core';
import { Player } from '../types';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  startingMoney: number = 1500;
  originalPlayers: Player[] = [];
  players: Player[] = [
    {
      img: 'dog',
      name: 'Dog',
      money: this.startingMoney,
      human: true,
      inGame: true,
    },
    {
      img: 'ship',
      name: 'Ship',
      money: this.startingMoney,
      human: true,
      inGame: true,
    },
    {
      img: 'dino',
      name: 'Dinosaur',
      money: this.startingMoney,
      human: true,
      inGame: true,
    },
    {
      img: 'car',
      name: 'Car',
      money: this.startingMoney,
      human: true,
      inGame: true,
    },
    {
      img: 'cat',
      name: 'Cat',
      money: this.startingMoney,
      human: true,
      inGame: true,
    },
    {
      img: 'duck',
      name: 'Duck',
      money: this.startingMoney,
      human: true,
      inGame: true,
    },
    {
      img: 'penguin',
      name: 'Penguin',
      money: this.startingMoney,
      human: true,
      inGame: true,
    },
    { img: 'bank', name: 'Bank', money: 0, human: false, inGame: true },
    {
      img: 'parking',
      name: 'Free Parking',
      money: 0,
      human: false,
      inGame: true,
    },
  ];

  constructor() {
    this.originalPlayers = this.players.map((x) => Object.assign({}, x));
  }

  getPlayers(): Player[] {
    return this.players;
  }

  removePlayer(player: Player) {
    player.inGame = false;
  }

  reset() {
    for (let p of this.players) {
      p.inGame = true;
      p.money = this.startingMoney;
    }
  }
}
