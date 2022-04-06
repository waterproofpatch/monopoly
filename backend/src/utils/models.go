package utils

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `json:"email"`
	Password string `json:"password"`
}

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
	CreatedBy    string `json:"createdBy"`
}

type Transaction struct {
	gorm.Model
	FromPlayerId uint `json:"fromPlayerId"`
	ToPlayerId   uint `json:"toPlayerId"`
	Amount       int  `json:"amount"`
	GameID       uint
}
