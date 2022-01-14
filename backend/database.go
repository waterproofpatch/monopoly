package main

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var gDb *gorm.DB

func initDb(dbUrl string) {
	database, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.Migrator().DropTable(&Player{})
	database.Migrator().DropTable(&Transaction{})
	database.AutoMigrate(&Player{})
	database.AutoMigrate(&Transaction{})

	// Create
	log.Println("Creating players ..")
	database.Create(&Player{Name: "Ship", Money: 1500, InGame: true, Human: true, Img: "ship"})
	database.Create(&Player{Name: "Dog", Money: 1500, InGame: true, Human: true, Img: "dog"})
	database.Create(&Player{Name: "Penguin", Money: 1500, InGame: true, Human: true, Img: "penguin"})
	database.Create(&Player{Name: "Car", Money: 1500, InGame: true, Human: true, Img: "car"})
	database.Create(&Player{Name: "Hat", Money: 1500, InGame: true, Human: true, Img: "hat"})
	database.Create(&Player{Name: "Dinosaur", Money: 1500, InGame: true, Human: true, Img: "dino"})
	database.Create(&Player{Name: "Cat", Money: 1500, InGame: true, Human: true, Img: "cat"})
	database.Create(&Player{Name: "Bank", Money: 1500, InGame: true, Human: false, Img: "bank"})
	database.Create(&Player{Name: "Free Parking", Money: 0, InGame: true, Human: false, Img: "parking"})

	// Read
	gDb = database
}

// getDb returns the database object
func getDb() *gorm.DB {
	if gDb == nil {
		panic("gDb is not initialized!")
	}
	return gDb
}
