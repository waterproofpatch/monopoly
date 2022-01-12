package main

import (
	"encoding/json"
	"net/http"
)

func players(w http.ResponseWriter, r *http.Request) {
	var players []Player
	db := getDb()
	db.Find(&players)
	json.NewEncoder(w).Encode(players)
}
