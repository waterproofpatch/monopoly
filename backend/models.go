package main

import "gorm.io/gorm"

// Item is a model for an Item.
type Player struct {
	gorm.Model
	Id     uint   `gorm:"primaryKey;autoincrement:true"`
	Name   string `json:"name"`
	Money  uint   `json:"money"`
	Img    string `json:"img"`
	Human  bool   `json:"human"`
	InGame bool   `json:"inGame"`
}

type Transaction struct {
	gorm.Model
	Id         uint   `gorm:"primaryKey;autoincrement:true"`
	FromPlayer string `json:"fromPlayer"`
	ToPlayer   string `json:"toPlayer"`
	Amount     int    `json:"amount"`
}
