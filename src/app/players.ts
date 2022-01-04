import { Player } from './types';

export const STARTING_MONEY: number = 1500;
export const PLAYERS: Player[] = [
  { img: 'dog', name: 'Dog', money: STARTING_MONEY, human: true },
  { img: 'ship', name: 'Ship', money: STARTING_MONEY, human: true },
  { img: 'dino', name: 'Dinosaur', money: STARTING_MONEY, human: true },
  { img: 'car', name: 'Car', money: STARTING_MONEY, human: true },
  { img: 'bank', name: 'Bank', money: 0, human: false },
  { img: 'parking', name: 'Free Parking', money: 0, human: false },
];
