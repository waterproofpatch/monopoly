package utils

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const (
	PORT   = "1337"
	SECRET = "42isTheAnswer"
)

type JWTData struct {
	// Standard claims are the standard jwt claims from the IETF standard
	// https://tools.ietf.org/html/rfc7519
	jwt.StandardClaims
	Email string `json:"email"`
	// CustomClaims map[string]string `json:"email,omitempty"`
}
type Error struct {
	ErrorMessage string `json:"error_message"`
}

// Hash password
func HashPassword(password string) (string, error) {
	// Convert password string to byte slice
	var passwordBytes = []byte(password)
	// Hash password with Bcrypt's min cost
	hashedPasswordBytes, err := bcrypt.
		GenerateFromPassword(passwordBytes, bcrypt.MinCost)
	return string(hashedPasswordBytes), err
}

func IsValidEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

// Check if two passwords match using Bcrypt's CompareHashAndPassword
// which return nil on success and an error on failure.
func DoPasswordsMatch(hashedPassword, currPassword string) bool {
	err := bcrypt.CompareHashAndPassword(
		[]byte(hashedPassword), []byte(currPassword))
	return err == nil
}

func WriteError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("content-type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(&Error{ErrorMessage: message})
}

func GetTransactionsForGame(db *gorm.DB, gameId string) []Transaction {
	var transactions []Transaction
	var game Game
	db.Find(&game, "ID = ?", gameId)
	db.Model(&game).Order("ID").Association("Transactions").Find(&transactions)
	return transactions
}

func GenerateJwtToken(email string) (string, error) {
	claims := JWTData{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour).Unix(),
		},

		Email: email,
		// CustomClaims: map[string]string{
		// 	"email": email,
		// },
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(SECRET))
	if err != nil {
		return "", errors.New("Failed generating token!")
	}
	return tokenString, nil
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
			WriteError(w, "Not enougn money!", http.StatusBadRequest)
			return
		}

		// update cash
		fromPlayer.Money -= uint(transaction.Amount)
		toPlayer.Money += uint(transaction.Amount)
	}

	db.Save(&fromPlayer)
	db.Save(&toPlayer)
}

func ParseClaims(w http.ResponseWriter, r *http.Request) (bool, *JWTData) {
	authToken := r.Header.Get("Authorization")
	authArr := strings.Split(authToken, " ")

	if len(authArr) != 2 {
		log.Println("Authentication header is invalid: " + authToken)
		return false, nil
	}

	jwtToken := authArr[1]
	token, err := jwt.ParseWithClaims(jwtToken, &JWTData{}, func(token *jwt.Token) (interface{}, error) {
		if jwt.SigningMethodHS256 != token.Method {
			return nil, errors.New("Invalid signing algorithm")
		}
		return []byte(SECRET), nil
	})

	if err != nil {
		log.Println(err)
		return false, nil
	}
	claims, ok := token.Claims.(*JWTData)
	if !ok {
		log.Printf("Failed processing claims")
		return false, nil
	}
	return true, claims
}

func IsAuthorized(w http.ResponseWriter, r *http.Request) bool {

	// it's enough to just be able to parse the claims
	parsed, _ := ParseClaims(w, r)
	return parsed
}
