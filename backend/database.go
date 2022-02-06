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
	db.Migrator().DropTable(&Player{})
	db.Migrator().DropTable(&Transaction{})
	db.AutoMigrate(&Player{})
	db.AutoMigrate(&Transaction{})

	// Create
	log.Println("Creating players ..")
	db.Create(&Player{Name: "Ship", Money: 1500, InGame: true, Human: true, Img: "ship"})
	db.Create(&Player{Name: "Dog", Money: 1500, InGame: true, Human: true, Img: "dog"})
	db.Create(&Player{Name: "Penguin", Money: 1500, InGame: true, Human: true, Img: "penguin"})
	db.Create(&Player{Name: "Car", Money: 1500, InGame: true, Human: true, Img: "car"})
	db.Create(&Player{Name: "Hat", Money: 1500, InGame: true, Human: true, Img: "hat"})
	db.Create(&Player{Name: "Dinosaur", Money: 1500, InGame: true, Human: true, Img: "dino"})
	db.Create(&Player{Name: "Cat", Money: 1500, InGame: true, Human: true, Img: "cat"})
	db.Create(&Player{Name: "Bank", Money: 1500, InGame: true, Human: false, Img: "bank"})
	db.Create(&Player{Name: "Free Parking", Money: 0, InGame: true, Human: false, Img: "parking"})

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
