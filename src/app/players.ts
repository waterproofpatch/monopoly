import { Player } from './player';

export const STARTING_MONEY: number = 1500;
export const PLAYERS: Player[] = [
  { img: 'dog', name: 'Dog', money: STARTING_MONEY, transactions: [] },
  { img: 'ship', name: 'Ship', money: STARTING_MONEY, transactions: [] },
  { img: 'dino', name: 'Dinosaur', money: STARTING_MONEY, transactions: [] },
  { img: 'car', name: 'Car', money: STARTING_MONEY, transactions: [] },
  { img: 'bank', name: 'Bank', money: 0, transactions: [] },
  { img: 'parking', name: 'Free Parking', money: 0, transactions: [] },
];
