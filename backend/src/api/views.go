package api

import (
	"encoding/json"
	"log"
	"monopoly/utils"
	"net/http"
	"time"

	jwt "github.com/dgrijalva/jwt-go"

	"github.com/gorilla/mux"
)

const (
	PORT   = "1337"
	SECRET = "42isTheAnswer"
)

type JWTData struct {
	// Standard claims are the standard jwt claims from the IETF standard
	// https://tools.ietf.org/html/rfc7519
	jwt.StandardClaims
	CustomClaims map[string]string `json:"custom,omitempty"`
}

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

func login(w http.ResponseWriter, r *http.Request) {

	var loginRequest LoginRequest
	err := json.NewDecoder(r.Body).Decode(&loginRequest)
	if err != nil {
		utils.WriteError(w, "Invalid request!")
		return
	}

	if loginRequest.Email == "admin@gmail.com" && loginRequest.Password == "admin123" {
		claims := JWTData{
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: time.Now().Add(time.Hour).Unix(),
			},

			CustomClaims: map[string]string{
				"userid": "u1",
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString([]byte(SECRET))
		if err != nil {
			log.Println(err)
			utils.WriteError(w, "Failed generating new token!")
			return
		}

		json, err := json.Marshal(struct {
			Token string `json:"token"`
		}{
			tokenString,
		})

		if err != nil {
			log.Println(err)
			utils.WriteError(w, "Failed generating a new token")
			return
		}

		w.Write(json)
	} else {
		utils.WriteError(w, "Invalid credentials!")
		return
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
			utils.WriteError(w, "Missing playerId")
			return
		}
		db.Model(&utils.Player{}).Where("id=?", playerId).Update("InGame", false)
	case "PUT":
		var req ChangePlayerRequest
		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			utils.WriteError(w, "Failed decoding change player request!")
			return
		}
		firstName := req.First.Name
		firstImg := req.First.Img
		db.Model(&req.First).Updates(utils.Player{Name: req.Second.Name, Img: req.Second.Img})
		db.Model(&req.Second).Updates(utils.Player{Name: firstName, Img: firstImg})
	}

	gameId := r.FormValue("gameId")
	if gameId == "" {
		utils.WriteError(w, "Missing gameId!")
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
			utils.WriteError(w, "Missing gameId!")
			return
		}
		db.Delete(&utils.Game{}, gameId)
	case "PUT":
		utils.WriteError(w, "Not implemented!")
		return
	case "POST": // start a new game
		// create a new game given a name
		var newGameRequest NewGameRequest
		json.NewDecoder(r.Body).Decode(&newGameRequest)

		newGameId := utils.NewGame(newGameRequest.GameName)

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
	if gameId == "" {
		utils.WriteError(w, "Missing gameId!")
		return
	}

	switch r.Method {
	case "GET":
	case "DELETE":
		vars := mux.Vars(r)
		id, hasTransactionId := vars["id"]
		if !hasTransactionId {
			utils.WriteError(w, "Missing ID!")
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
			utils.WriteError(w, "Failed decoding transaction!")
			return
		}
		// create and then process the transaction
		utils.ProcessTransaction(w, transaction, false)
		db.Create(&transaction)
	}
	json.NewEncoder(w).Encode(utils.GetTransactionsForGame(db, gameId))
}

func version(w http.ResponseWriter, r *http.Request) {
	var version VersionResponse
	version.Version = "0.0.1"
	json.NewEncoder(w).Encode(&version)
}

func InitViews(router *mux.Router) {
	router.HandleFunc("/api/games", games).Methods("GET", "POST", "OPTIONS")
	router.HandleFunc("/api/games/{id:[0-9]+}", games).Methods("DELETE", "GET", "POST", "OPTIONS")

	router.HandleFunc("/api/players", players).Methods("GET", "PUT", "OPTIONS").Queries("gameId", "[0-9]*")
	router.HandleFunc("/api/players", players).Methods("GET", "PUT", "OPTIONS")
	router.HandleFunc("/api/players/{id:[0-9]+}", players).Methods("DELETE", "OPTIONS", "GET")

	router.HandleFunc("/api/transactions", transactions).Methods("POST", "GET", "OPTIONS").Queries("gameId", "[0-9]*")
	router.HandleFunc("/api/transactions", transactions).Methods("POST", "DELETE", "GET", "OPTIONS")
	router.HandleFunc("/api/transactions/{id:[0-9]+}", transactions).Methods("DELETE", "OPTIONS")

	router.HandleFunc("/api/version", version).Methods("GET", "OPTIONS")

	router.HandleFunc("/api/login", login).Methods("POST", "OPTIONA")
}
