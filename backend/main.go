// entry point to golang server.
package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

type Certs struct {
	certPath string
	keyPath  string
}

// startServing creates the server mux and registers endpoints with it.
func startServing() {
	port, err := getPortFromEnv()
	if err != nil {
		log.Fatalf("failed loading port: %v", err)
	}
	router := mux.NewRouter()
	router.HandleFunc("/", dashboard).Methods("GET")
	router.HandleFunc("/api/players", players).Methods("GET", "OPTIONS")
	portStr := fmt.Sprintf("0.0.0.0:%s", port)
	srv := &http.Server{
		Handler: router,
		Addr:    portStr,
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}

func getPortFromEnv() (string, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	return port, nil
}

// getCertsFromEnv loads certificates from the environment
func getCertsFromEnv() (*Certs, error) {
	var certs Certs
	certBasePath := os.Getenv("CERTS_PATH")
	if len(certBasePath) == 0 {
		return nil, errors.New("CERTS_PATH environment variable is not set")
	}
	certs.certPath = certBasePath + "/cert.pem"
	certs.keyPath = certBasePath + "/key.pem"

	return &certs, nil
}

func getDbConfigFromEnv() string {
	var found bool

	dburl, found := os.LookupEnv("DATABASE_URL")
	if !found {
		panic("Failed finding DATABASE_URL")
	}
	return dburl
}

// main is the entrypoint to the program.
func main() {
	// init the database
	log.Println("Initing DB...")
	dbUrl := getDbConfigFromEnv()
	gDb = initDb(dbUrl)

	// build the mux and start serving
	startServing()
}
