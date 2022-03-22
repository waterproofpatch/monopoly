package utils

import "gorm.io/gorm"

// Item is a model for an Item.
type Player struct {
	gorm.Model
	Name   string `json:"name"`
	Money  uint   `json:"money"`
	Img    string `json:"img"`
	Human  bool   `json:"human"`
	InGame bool   `json:"inGame"`
	GameID uint
}

type Game struct {
	gorm.Model
	Players      []Player
	Transactions []Transaction
	Name         string `json:"name"`
}

type Transaction struct {
	gorm.Model
	FromPlayerId uint `json:"fromPlayerId"`
	ToPlayerId   uint `json:"toPlayerId"`
	Amount       int  `json:"amount"`
	GameID       uint
}
