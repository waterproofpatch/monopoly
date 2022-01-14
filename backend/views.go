package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
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

func transactions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Access-Control-Allow-Origin")

	var transactions []Transaction
	db := getDb()
	db.Find(&transactions)

	json.NewEncoder(w).Encode(transactions)
}

func initViews(router *mux.Router) {
	router.HandleFunc("/", dashboard).Methods("GET")
	router.HandleFunc("/api/players", players).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/transactions", transactions).Methods("GET", "OPTIONS")
}
