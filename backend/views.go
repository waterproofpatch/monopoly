package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func dashboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Access-Control-Allow-Origin")

	fmt.Fprint(w, "Hello HTTP/2")
}

func players(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Access-Control-Allow-Origin")

	var players []Player
	db := getDb()
	db.Find(&players)

	json.NewEncoder(w).Encode(players)
}
