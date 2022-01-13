// entry point to golang server.
package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// startServing creates the server mux and registers endpoints with it.
func startServing(port string) {
	portStr := fmt.Sprintf("0.0.0.0:%s", port)

	router := mux.NewRouter()
	initViews(router)

	srv := &http.Server{
		Handler: router,
		Addr:    portStr,
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}

// main is the entrypoint to the program.
func main() {
	config := getConfig()
	// init the database
	log.Println("Initializing database...")
	initDb(config.dbUrl)

	log.Println("Starting server...")
	startServing(config.port)
}
