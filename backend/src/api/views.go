package api

import (
	"encoding/json"
	"log"
	"monopoly/utils"
	"net/http"

	"github.com/gorilla/mux"
)

type VersionResponse struct {
	Version string `json:"version"`
}
type ChangePlayerRequest struct {
	First  utils.Player `json:"first"`
	Second utils.Player `json:"second"`
}

type NewGameRequest struct {
	GameName string `json:"name"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func register(w http.ResponseWriter, r *http.Request) {
	var registerRequest RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&registerRequest)
	if err != nil {
		utils.WriteError(w, "Invalid request!", http.StatusBadRequest)
		return
	}
	if len(registerRequest.Email) == 0 {
		utils.WriteError(w, "Invalid email!", http.StatusBadRequest)
		return
	}
	if len(registerRequest.Password) == 0 {
		utils.WriteError(w, "Invalid password!", http.StatusBadRequest)
		return
	}

	// check that the email is valid
	if !utils.IsValidEmail(registerRequest.Email) {
		utils.WriteError(w, "Invalid email!", http.StatusBadRequest)
		return
	}

	db := utils.GetDb()
	var user utils.User
	result := db.First(&user, "email = ?", registerRequest.Email)
	if result.Error == nil {
		utils.WriteError(w, "Email taken", http.StatusBadRequest)
		return
	}
	hashedPassword, err := utils.HashPassword(registerRequest.Password)
	if err != nil {
		utils.WriteError(w, "Failed hashing password", http.StatusInternalServerError)
		return
	}
	db.Create(&utils.User{Email: registerRequest.Email, Password: hashedPassword})
	tokenString, err := utils.GenerateJwtToken(registerRequest.Email)
	if err != nil {
		utils.WriteError(w, "Faled getting token string!", http.StatusInternalServerError)
		return
	}
	json, err := json.Marshal(struct {
		Token string `json:"token"`
	}{
		tokenString,
	})

	if err != nil {
		log.Println(err)
		utils.WriteError(w, "Failed generating a new token", http.StatusInternalServerError)
		return
	}

	w.Write(json)

}
func login(w http.ResponseWriter, r *http.Request) {
	db := utils.GetDb()
	var loginRequest LoginRequest
	err := json.NewDecoder(r.Body).Decode(&loginRequest)
	if err != nil {
		utils.WriteError(w, "Invalid request!", http.StatusBadRequest)
		return
	}

	var user utils.User
	result := db.First(&user, "email = ?", loginRequest.Email)
	if result.Error != nil {
		utils.WriteError(w, "Invalid credentials!", http.StatusUnauthorized)
		return
	}

	if utils.DoPasswordsMatch(user.Password, loginRequest.Password) {
		tokenString, err := utils.GenerateJwtToken(user.Email)
		if err != nil {
			utils.WriteError(w, "Faled getting token string!", http.StatusInternalServerError)
			return
		}

		json, err := json.Marshal(struct {
			Token string `json:"token"`
		}{
			tokenString,
		})

		if err != nil {
			log.Println(err)
			utils.WriteError(w, "Failed generating a new token", http.StatusInternalServerError)
			return
		}

		w.Write(json)
	} else {
		utils.WriteError(w, "Invalid credentials!", http.StatusUnauthorized)
	}
}

func players(w http.ResponseWriter, r *http.Request) {
	db := utils.GetDb()
	vars := mux.Vars(r)
	playerId, hasPlayerId := vars["id"]

	switch r.Method {
	case "GET":
		if hasPlayerId {
			var player utils.Player
			db.Find(&player, "ID = ?", playerId)
			json.NewEncoder(w).Encode(player)
			return
		}
	case "DELETE":
		if !hasPlayerId {
			utils.WriteError(w, "Missing playerId", http.StatusBadRequest)
			return
		}
		db.Model(&utils.Player{}).Where("id=?", playerId).Update("InGame", false)
	case "PUT":
		var req ChangePlayerRequest
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			utils.WriteError(w, "Failed decoding change player request!", http.StatusBadRequest)
			return
		}
		firstName := req.First.Name
		firstImg := req.First.Img
		db.Model(&req.First).Updates(utils.Player{Name: req.Second.Name, Img: req.Second.Img})
		db.Model(&req.Second).Updates(utils.Player{Name: firstName, Img: firstImg})
	}

	gameId := r.FormValue("gameId")
	if gameId == "" {
		utils.WriteError(w, "Missing gameId!", http.StatusBadRequest)
		return
	}
	var players []utils.Player
	var game utils.Game
	db.Find(&game, "ID = ?", gameId)
	db.Model(&game).Order("ID").Association("Players").Find(&players)
	json.NewEncoder(w).Encode(players)
}

func games(w http.ResponseWriter, r *http.Request) {

	db := utils.GetDb()

	gameId, hasGameId := mux.Vars(r)["id"]

	switch r.Method {
	case "GET": // get a specific game that was already existing
		if hasGameId {
			var game utils.Game
			db.First(&game, "id = ?", gameId)
			json.NewEncoder(w).Encode(game)
			return
		}
	case "DELETE":
		if !hasGameId {
			utils.WriteError(w, "Missing gameId!", http.StatusBadRequest)
			return
		}
		db.Delete(&utils.Game{}, gameId)
	case "PUT":
		utils.WriteError(w, "Not implemented!", http.StatusNotImplemented)
		return
	case "POST": // start a new game
		// create a new game given a name
		parsedClaims, claims, errString := utils.ParseClaims(w, r)
		if !parsedClaims {
			utils.WriteError(w, errString, http.StatusBadRequest)
			return
		}

		var newGameRequest NewGameRequest
		json.NewDecoder(r.Body).Decode(&newGameRequest)

		log.Printf("Claims: %v", claims)
		log.Printf("Claims: %s", claims.Email)
		// log.Printf("Claims: %s", (*claims)["email"])

		newGameId := utils.NewGame(newGameRequest.GameName, claims.Email)

		var game utils.Game
		db.First(&game, "id = ?", newGameId)
		json.NewEncoder(w).Encode(game)
		return
	}
	var games []utils.Game
	db.Find(&games)
	json.NewEncoder(w).Encode(games)
}

func transactions(w http.ResponseWriter, r *http.Request) {
	db := utils.GetDb()
	gameId := r.FormValue("gameId")

	switch r.Method {
	case "GET":
		if gameId == "" {
			var transactions []utils.Transaction
			db.Find(&transactions)
			json.NewEncoder(w).Encode(transactions)
			log.Printf("Returning %v transactions\n", transactions)
			return
		}
	case "DELETE":
		vars := mux.Vars(r)
		id, hasTransactionId := vars["id"]
		if !hasTransactionId {
			utils.WriteError(w, "Missing ID!", http.StatusBadRequest)
			return
		}
		// find, reverse, and then delete the transaction
		var transaction utils.Transaction
		db.First(&transaction, id)
		utils.ProcessTransaction(w, transaction, true)
		db.Delete(&utils.Transaction{}, id)
	case "POST":
		var transaction utils.Transaction
		err := json.NewDecoder(r.Body).Decode(&transaction)
		if err != nil {
			utils.WriteError(w, "Failed decoding transaction!", http.StatusBadRequest)
			return
		}
		// create and then process the transaction
		utils.ProcessTransaction(w, transaction, false)
		db.Create(&transaction)
	}
	if gameId == "" {
		utils.WriteError(w, "Missing gameId!", http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(utils.GetTransactionsForGame(db, gameId))
}

func version(w http.ResponseWriter, r *http.Request) {
	var version VersionResponse
	version.Version = "1.1.0"
	json.NewEncoder(w).Encode(&version)
}

func InitViews(router *mux.Router) {
	router.HandleFunc("/api/games", utils.Authentication(games, "games")).Methods("GET", "POST", "OPTIONS")
	router.HandleFunc("/api/games/{id:[0-9]+}", utils.Authentication(games, "games")).Methods("DELETE", "GET", "POST", "OPTIONS")

	router.HandleFunc("/api/players", utils.Authentication(players, "players")).Methods("GET", "PUT", "OPTIONS").Queries("gameId", "[0-9]*")
	router.HandleFunc("/api/players", utils.Authentication(players, "players")).Methods("GET", "PUT", "OPTIONS")
	router.HandleFunc("/api/players/{id:[0-9]+}", utils.Authentication(players, "players")).Methods("DELETE", "OPTIONS", "GET")

	router.HandleFunc("/api/transactions", utils.Authentication(transactions, "transactions")).Methods("POST", "GET", "OPTIONS").Queries("gameId", "[0-9]*")
	router.HandleFunc("/api/transactions", utils.Authentication(transactions, "transactions")).Methods("POST", "DELETE", "GET", "OPTIONS")
	router.HandleFunc("/api/transactions/{id:[0-9]+}", utils.Authentication(transactions, "transactions")).Methods("DELETE", "OPTIONS")

	router.HandleFunc("/api/version", utils.LogRequest(version, "version")).Methods("GET", "OPTIONS")

	router.HandleFunc("/api/login", utils.LogRequest(login, "login")).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/register", utils.LogRequest(register, "register")).Methods("POST", "OPTIONS")
}
