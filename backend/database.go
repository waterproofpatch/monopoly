package main

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var gDb *gorm.DB

// initDb demonstartes using GORM.
func initDb() *gorm.DB {
	log.Println("Opening test.sqlite...")
	database, err := gorm.Open(sqlite.Open("test.sqlite"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.AutoMigrate(&Item{})

	// Create
	log.Println("Creating some items...")
	database.Create(&Item{Desc: "Item 1 desc", Title: "Item 1 title"})
	database.Create(&Item{Desc: "Item 2 desc", Title: "Item 2 title"})
	database.Create(&Item{Desc: "Item 3 desc", Title: "Item 3 title"})

	// Read
	return database
}

// getDb returns the database object
func getDb() *gorm.DB {
	return gDb
}
