package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type PlayersTransactionsResponse struct {
	Transactions []Transaction `json:"transactions"`
	Players      []Player      `json:"players"`
}

type ChangePlayerRequest struct {
	First  Player `json:"first"`
	Second Player `json:"second"`
}

type Error struct {
	ErrorMessage string `json:"error_message"`
}

func writeError(w http.ResponseWriter, message string) {
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(&Error{ErrorMessage: message})
}

func processTransaction(w http.ResponseWriter, transaction Transaction, reverse bool) {
	db := getDb()

	var fromPlayer Player
	var toPlayer Player
	db.First(&fromPlayer, "id = ?", transaction.FromPlayerId)
	db.First(&toPlayer, "id = ?", transaction.ToPlayerId)

	log.Printf("Processing transaction %v From player: %v, To player: %v", transaction, fromPlayer, toPlayer)

	if reverse {
		fromPlayer.Money += uint(transaction.Amount)
		toPlayer.Money -= uint(transaction.Amount)
	} else {
		// bank has unlimited money...
		if fromPlayer.Name != "bank" && fromPlayer.Money < uint(transaction.Amount) {
			writeError(w, "Not enougn money!")
			return
		}

		// update cash
		fromPlayer.Money -= uint(transaction.Amount)
		toPlayer.Money += uint(transaction.Amount)
	}

	db.Save(&fromPlayer)
	db.Save(&toPlayer)
}

func players(w http.ResponseWriter, r *http.Request) {
	log.Printf("%v players", r.Method)
	db := getDb()

	gameId := r.FormValue("gameId")

	switch r.Method {
	case "GET":
		if gameId == "" {
			log.Printf("All players, no gameId specified!\n")
			var players []Player
			db.Find(&players)
			json.NewEncoder(w).Encode(players)
			return
		} else {
			log.Printf("All players, gameId %v!\n", gameId)
			var players []Player
			var game Game
			db.Find(&game, "ID = ?", gameId)
			db.Model(&game).Association("Players").Find(&players)

			json.NewEncoder(w).Encode(players)
			return
		}
	case "DELETE":
		log.Printf("DELETE players")
		vars := mux.Vars(r)
		id := vars["id"]
		log.Printf("DELETE id %v", id)
		results := db.Model(&Player{}).Where("id=?", id).Update("InGame", false)
		log.Printf("Affected %d rows", results.RowsAffected)
	case "PUT":
		var req ChangePlayerRequest
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			writeError(w, "Failed decoding change player request!")
			return
		}
		log.Printf("first player ID %v, second player ID %v", req.First, req.Second)
		firstName := req.First.Name
		firstImg := req.First.Img
		results := db.Model(&req.First).Updates(Player{Name: req.Second.Name, Img: req.Second.Img})
		log.Printf("Affected %d rows", results.RowsAffected)
		results = db.Model(&req.Second).Updates(Player{Name: firstName, Img: firstImg})
		log.Printf("Affected %d rows", results.RowsAffected)
	}

	var players []Player
	db.Find(&players)
	json.NewEncoder(w).Encode(players)
}

func games(w http.ResponseWriter, r *http.Request) {
	db := getDb()
	log.Printf("%v games", r.Method)

	switch r.Method {
	case "GET": // get a specific game that was already existing
		id, Ok := mux.Vars(r)["id"]
		if !Ok {
			log.Printf("All games!")
			// return a list of names for each game in the db
			var games []Game
			db.Find(&games)
			json.NewEncoder(w).Encode(games)
		} else {
			var game Game
			log.Printf("Game %v!", id)
			db.First(&game, "id = ?", id)
			json.NewEncoder(w).Encode(game)
		}
	case "PUT": // modify a game, look for Players and Transactions
	case "POST": // start a new game
		// re-init the whole db
		resetDb()
		var game Game
		db.First(&game, "id = ?", 1)
		json.NewEncoder(w).Encode(game)
	}
}

func transactions(w http.ResponseWriter, r *http.Request) {
	log.Printf("%v transactions", r.Method)

	db := getDb()

	switch r.Method {
	case "GET":
		gameId, Ok := mux.Vars(r)["gameId"]
		if !Ok {
			writeError(w, "Missing gameId!")
			return
		} else {
			log.Printf("All players, gameId %v!\n", gameId)
			var transactions []Transaction
			var game Game
			db.Find(&game, "ID = ?", gameId)
			db.Model(&game).Association("Transactions").Find(&transactions)
			json.NewEncoder(w).Encode(transactions)
			return
		}
	case "DELETE":
		log.Printf("DELETE transactions")
		vars := mux.Vars(r)
		id := vars["id"]
		log.Printf("DELETE id %v", id)

		// find, reverse, and then delete the transaction
		var transaction Transaction
		db.First(&transaction, id)
		processTransaction(w, transaction, true)
		db.Delete(&Transaction{}, id)
	case "POST":
		var transaction Transaction
		err := json.NewDecoder(r.Body).Decode(&transaction)
		if err != nil {
			writeError(w, "Failed decoding transaction!")
			return
		}
		// create and then process the transaction
		db.Create(&transaction)
		processTransaction(w, transaction, false)
	}

	// return new set of players and transactions
	var transactions []Transaction

	db.Find(&transactions)

	json.NewEncoder(w).Encode(transactions)
}

func initViews(router *mux.Router) {
	router.HandleFunc("/api/games", games).Methods("GET", "POST", "OPTIONS")
	router.HandleFunc("/api/games/{id:[0-9]+}", games).Methods("GET", "POST", "OPTIONS")

	router.HandleFunc("/api/players", players).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/players", players).Methods("GET", "OPTIONS").Queries("gameId", "[0-9]*")
	router.HandleFunc("/api/players/{id:[0-9]+}", players).Methods("DELETE", "OPTIONS")

	router.HandleFunc("/api/transactions", transactions).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/transactions", transactions).Methods("GET", "OPTIONS").Queries("gameId", "[0-9]*")
	router.HandleFunc("/api/transactions/{id:[0-9]+}", transactions).Methods("DELETE", "OPTIONS")
}
