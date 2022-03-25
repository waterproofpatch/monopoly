// entry point to golang server.
package main

import (
	"fmt"
	"log"
	"monopoly/api"
	"monopoly/utils"
	"net/http"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// startServing creates the server mux and registers endpoints with it.
func startServing(port string) {
	portStr := fmt.Sprintf("0.0.0.0:%s", port)

	router := mux.NewRouter()
	api.InitViews(router)

	methods := []string{"GET", "POST", "PUT", "DELETE"}
	headers := []string{"Content-Type", "Access-Control-Allow-Origin", "Authorization"}
	srv := &http.Server{
		// Handler: router,
		Handler: handlers.CORS(handlers.AllowedMethods(methods), handlers.AllowedHeaders(headers))(router),
		Addr:    portStr,
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}

// main is the entrypoint to the program.
func main() {
	cfg := utils.GetConfig()
	// init the database
	log.Println("Initializing database...")
	utils.InitDb(cfg.DbUrl)

	log.Println("Starting server...")
	startServing(cfg.Port)
}
