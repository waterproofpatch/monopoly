package main

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var gDb *gorm.DB

func initDb(dbUrl string) *gorm.DB {
	database, err := gorm.Open(postgres.Open(dbUrl), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.AutoMigrate(&Player{})

	// Create
	log.Println("Creating some items...")
	database.Create(&Player{Name: "Ship", Money: 1500, InGame: true, Human: true})

	// Read
	return database
}

// getDb returns the database object
func getDb() *gorm.DB {
	return gDb
}
