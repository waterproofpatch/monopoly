import { Player } from './player';

export const STARTING_MONEY: number = 1500;
export const PLAYERS: Player[] = [
  { img: 'dog', name: 'Dog', money: STARTING_MONEY },
  { img: 'ship', name: 'Ship', money: STARTING_MONEY },
  { img: 'dino', name: 'Dinosaur', money: STARTING_MONEY },
  { img: 'car', name: 'Car', money: STARTING_MONEY },
  { img: 'bank', name: 'Bank', money: 0 },
  { img: 'parking', name: 'Free Parking', money: 0 },
];
