package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// returnAllItems returns each item in the collection.
func items(w http.ResponseWriter, r *http.Request) {
	log.Println(">") // just log that we made it here
	var items []Item
	db := getDb()
	db.Find(&items)
	json.NewEncoder(w).Encode(items)
}
