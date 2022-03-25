package utils

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type Error struct {
	ErrorMessage string `json:"error_message"`
}

func WriteError(w http.ResponseWriter, message string) {
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(&Error{ErrorMessage: message})
}

func GetTransactionsForGame(db *gorm.DB, gameId string) []Transaction {
	var transactions []Transaction
	var game Game
	db.Find(&game, "ID = ?", gameId)
	db.Model(&game).Order("ID").Association("Transactions").Find(&transactions)
	return transactions
}

func ProcessTransaction(w http.ResponseWriter, transaction Transaction, reverse bool) {
	db := GetDb()

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
			WriteError(w, "Not enougn money!")
			return
		}

		// update cash
		fromPlayer.Money -= uint(transaction.Amount)
		toPlayer.Money += uint(transaction.Amount)
	}

	db.Save(&fromPlayer)
	db.Save(&toPlayer)
}
