package main

import "gorm.io/gorm"

// Item is a model for an Item.
type Item struct {
	gorm.Model
	Id    uint   `gorm:"primaryKey;autoincrement:true"`
	Title string `json:"title"`
	Desc  string `json:"desc"`
}
