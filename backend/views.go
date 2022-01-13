package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func dashboard(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello HTTP/2")
}

func players(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received request!")
	var players []Player
	db := getDb()
	db.Find(&players)

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Access-Control-Allow-Origin")
	// w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")

	json.NewEncoder(w).Encode(players)
}
