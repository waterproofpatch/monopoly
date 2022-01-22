package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type AddTransactionResponse struct {
	Transactions []Transaction `json:"transactions"`
	Players      []Player      `json:"players"`
}

type Error struct {
	ErrorMessage string `json:"error_message"`
}

func dashboard(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello HTTP/2")
}

func players(w http.ResponseWriter, r *http.Request) {
	var players []Player
	db := getDb()
	db.Find(&players)

	json.NewEncoder(w).Encode(players)
}

func transactions(w http.ResponseWriter, r *http.Request) {
	log.Printf("Transactions called with method %v", r.Method)

	db := getDb()

	switch r.Method {
	case "GET":
		log.Printf("GET transactions")
	case "DELETE":
		log.Printf("DELETE transactions")
		vars := mux.Vars(r)
		id := vars["id"]
		log.Printf("DELETE id %v", id)

		db.Delete(&Transaction{}, id)
	case "POST":
		var transaction Transaction
		err := json.NewDecoder(r.Body).Decode(&transaction)
		if err != nil {
			log.Printf("Error decoding json request: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&Error{ErrorMessage: "Failed decoding transaction!"})
			return
		}
		db.Create(&transaction)

		var fromPlayer Player
		var toPlayer Player
		db.First(&fromPlayer, "name = ?", transaction.FromPlayer)
		db.First(&toPlayer, "name = ?", transaction.ToPlayer)
		log.Printf("From player: %v, To player: %v", fromPlayer, toPlayer)

		// bank has unlimited money...
		if fromPlayer.Name != "bank" && fromPlayer.Money < uint(transaction.Amount) {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&Error{ErrorMessage: "Not enough money!"})
			return
		}

		// update cash
		fromPlayer.Money -= uint(transaction.Amount)
		toPlayer.Money += uint(transaction.Amount)
		db.Save(&fromPlayer)
		db.Save(&toPlayer)

	}

	// return new set of players and transactions
	var transactions []Transaction
	var players []Player

	db.Find(&transactions)
	db.Find(&players)

	resp := AddTransactionResponse{
		Transactions: transactions,
		Players:      players,
	}

	json.NewEncoder(w).Encode(resp)
}

func initViews(router *mux.Router) {
	router.HandleFunc("/", dashboard).Methods("GET")
	router.HandleFunc("/api/players", players).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/transactions", transactions).Methods("GET", "POST", "OPTIONS")
	router.HandleFunc("/api/transactions/{id:[0-9]+}", transactions).Methods("DELETE", "OPTIONS")
}
