package main

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var gDb *gorm.DB

func resetDb() {
	log.Printf("Resetting db...")
	db := getDb()
	// Migrate the schema
	db.Migrator().DropTable(&Game{})
	db.Migrator().DropTable(&Player{})
	db.Migrator().DropTable(&Transaction{})
	db.AutoMigrate(&Game{})
	db.AutoMigrate(&Player{})
	db.AutoMigrate(&Transaction{})

	db.Create(&Game{Name: "Default Game"})

	var game Game
	db.First(&game)

	// Create
	log.Printf("Creating players for game %s\n", game.Name)
	db.Create(&Player{GameID: game.ID, Name: "Ship", Money: 1500, InGame: true, Human: true, Img: "ship"})
	db.Create(&Player{GameID: game.ID, Name: "Dog", Money: 1500, InGame: true, Human: true, Img: "dog"})
	db.Create(&Player{GameID: game.ID, Name: "Penguin", Money: 1500, InGame: true, Human: true, Img: "penguin"})
	db.Create(&Player{GameID: game.ID, Name: "Car", Money: 1500, InGame: true, Human: true, Img: "car"})
	db.Create(&Player{GameID: game.ID, Name: "Hat", Money: 1500, InGame: true, Human: true, Img: "hat"})
	db.Create(&Player{GameID: game.ID, Name: "Dinosaur", Money: 1500, InGame: true, Human: true, Img: "dino"})
	db.Create(&Player{GameID: game.ID, Name: "Cat", Money: 1500, InGame: true, Human: true, Img: "cat"})
	db.Create(&Player{GameID: game.ID, Name: "Bank", Money: 1500, InGame: true, Human: false, Img: "bank"})
	db.Create(&Player{GameID: game.ID, Name: "Free Parking", Money: 0, InGame: true, Human: false, Img: "parking"})

}
func initDb(dbUrl string) {
	database, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Read
	gDb = database
	resetDb()
}

// getDb returns the database object
func getDb() *gorm.DB {
	if gDb == nil {
		panic("gDb is not initialized!")
	}
	return gDb
}
