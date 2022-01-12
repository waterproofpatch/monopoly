package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var gDb *gorm.DB

// initDb demonstartes using GORM.
func initDb(dbConfig DbConfig) *gorm.DB {
	log.Println("Opening test.sqlite...")
	dsn := "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable"
	dsn = fmt.Sprintf(dsn, dbConfig.host, dbConfig.user, dbConfig.password, dbConfig.dbname, dbConfig.port)
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
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
