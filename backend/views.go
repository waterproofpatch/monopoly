package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type ChangePlayerRequest struct {
	First  Player `json:"first"`
	Second Player `json:"second"`
}

type NewGameRequest struct {
	GameName string `json:"name"`
}

type Error struct {
	ErrorMessage string `json:"error_message"`
}

func writeError(w http.ResponseWriter, message string) {
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(&Error{ErrorMessage: message})
}

func getTransactionsForGame(db *gorm.DB, gameId string) []Transaction {
	var transactions []Transaction
	var game Game
	db.Find(&game, "ID = ?", gameId)
	db.Model(&game).Order("ID").Association("Transactions").Find(&transactions)
	return transactions
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
			vars := mux.Vars(r)
			id, ok := vars["id"]
			if ok {
				log.Printf("Single player, ID %v", id)
				var player Player
				db.Find(&player, "ID = ?", id)
				json.NewEncoder(w).Encode(player)
				return
			}
			log.Printf("All players, no gameId nor playerId specified!\n")
			var players []Player
			db.Find(&players)
			json.NewEncoder(w).Encode(players)
			return
		} else {
			log.Printf("All players, gameId %v!\n", gameId)
			var players []Player
			var game Game
			db.Find(&game, "ID = ?", gameId)
			db.Model(&game).Order("ID").Association("Players").Find(&players)
			log.Printf("Game ID is %v\n", game.ID)

			json.NewEncoder(w).Encode(players)
			return
		}
	case "DELETE":
		log.Printf("DELETE players")
		vars := mux.Vars(r)
		id := vars["id"]
		log.Printf("InGame for playerId id %v", id)
		results := db.Model(&Player{}).Where("id=?", id).Update("InGame", false)
		log.Printf("Affected %d rows", results.RowsAffected)
		var players []Player
		var game Game
		db.Find(&game, "ID = ?", gameId)
		db.Model(&game).Order("ID").Association("Players").Find(&players)
		log.Printf("Game ID is %v\n", game.ID)

		json.NewEncoder(w).Encode(players)
		return
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
		var players []Player
		var game Game
		db.Find(&game, "ID = ?", gameId)
		db.Model(&game).Order("ID").Association("Players").Find(&players)
		log.Printf("Game ID is %v\n", game.ID)

		json.NewEncoder(w).Encode(players)
		return
	}

	var players []Player
	db.Find(&players)
	json.NewEncoder(w).Encode(players)
}

func games(w http.ResponseWriter, r *http.Request) {
	db := getDb()
	gameId, hasGameId := mux.Vars(r)["id"]

	switch r.Method {
	case "GET": // get a specific game that was already existing
		if hasGameId {
			var game Game
			log.Printf("Game %v!", gameId)
			db.First(&game, "id = ?", gameId)
			json.NewEncoder(w).Encode(game)
			return
		}
	case "DELETE":
		if !hasGameId {
			writeError(w, "Missing gameId!")
			return
		}
		log.Printf("Deleting game %v", gameId)
		db.Delete(&Game{}, gameId)
	case "PUT":
		writeError(w, "Not implemented!")
		return
	case "POST": // start a new game
		// create a new game given a name
		var newGameRequest NewGameRequest
		json.NewDecoder(r.Body).Decode(&newGameRequest)

		newGameId := newGame(newGameRequest.GameName)

		var game Game
		db.First(&game, "id = ?", newGameId)
		json.NewEncoder(w).Encode(game)
		return
	}
	var games []Game
	db.Find(&games)
	json.NewEncoder(w).Encode(games)
}

func transactions(w http.ResponseWriter, r *http.Request) {
	db := getDb()
	gameId := r.FormValue("gameId")
	if gameId == "" {
		writeError(w, "Missing gameId!")
		return
	}

	switch r.Method {
	case "GET":
	case "DELETE":
		vars := mux.Vars(r)
		id, hasTransactionId := vars["id"]
		if !hasTransactionId {
			writeError(w, "Missing ID!")
			return
		}
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
		processTransaction(w, transaction, false)
		db.Create(&transaction)
	}
	json.NewEncoder(w).Encode(getTransactionsForGame(db, gameId))
}

func initViews(router *mux.Router) {
	router.HandleFunc("/api/games", games).Methods("GET", "POST", "OPTIONS")
	router.HandleFunc("/api/games/{id:[0-9]+}", games).Methods("DELETE", "GET", "POST", "OPTIONS")

	router.HandleFunc("/api/players", players).Methods("GET", "PUT", "OPTIONS").Queries("gameId", "[0-9]*")
	router.HandleFunc("/api/players", players).Methods("GET", "PUT", "OPTIONS")
	router.HandleFunc("/api/players/{id:[0-9]+}", players).Methods("DELETE", "OPTIONS", "GET")

	router.HandleFunc("/api/transactions", transactions).Methods("POST", "GET", "OPTIONS").Queries("gameId", "[0-9]*")
	router.HandleFunc("/api/transactions", transactions).Methods("POST", "DELETE", "GET", "OPTIONS")
	router.HandleFunc("/api/transactions/{id:[0-9]+}", transactions).Methods("DELETE", "OPTIONS")
}
