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
	Message string `json"message"`
}

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

	switch r.Method {
	case "GET":
		var transactions []Transaction
		db := getDb()
		db.Find(&transactions)

		json.NewEncoder(w).Encode(transactions)
	case "DELETE":
		var transaction Transaction
		err := json.NewDecoder(r.Body).Decode(&transaction)
		if err != nil {
			log.Printf("Error decoding json request: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&Error{Message: "Failed decoding transaction!"})
		} else {
			log.Printf("Deleting transaction %v", transaction)
			db := getDb()
			var transactions []Transaction
			db.Find(&transactions)
			json.NewEncoder(w).Encode(transactions)
		}
	case "POST":
		var transaction Transaction
		err := json.NewDecoder(r.Body).Decode(&transaction)
		if err != nil {
			log.Printf("Error decoding json request: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&Error{Message: "Failed decoding transaction!"})
		} else {
			getDb().Create(&transaction)

			// TODO update the relevant players...

			var transactions []Transaction
			var players []Player

			db := getDb()
			db.Find(&transactions)
			db.Find(&players)

			resp := AddTransactionResponse{
				Transactions: transactions,
				Players:      players,
			}

			json.NewEncoder(w).Encode(resp)
		}
	}

}

func initViews(router *mux.Router) {
	router.HandleFunc("/", dashboard).Methods("GET")
	router.HandleFunc("/api/players", players).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/transactions", transactions).Methods("GET", "POST", "OPTIONS")
}
