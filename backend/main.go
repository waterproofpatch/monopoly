// entry point to golang server.
package main

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/http"
	"os"
)

type Certs struct {
	certPath string
	keyPath  string
}

// startServing loads the HTTPS certs and begins listening for connections on
// http2 at the specified portString.
func startServing(mux *http.ServeMux) {
	port, err := getPortFromEnv()
	if err != nil {
		log.Fatalf("failed loading port: %v", err)
	}
	addrString := fmt.Sprintf("%s:%s", "0.0.0.0", port)
	server := http.Server{
		Addr:    addrString,
		Handler: mux,
		TLSConfig: &tls.Config{
			NextProtos: []string{"h2", "http/1.1"},
		},
	}

	// load the certificates from the environment.
	certs, err := getCertsFromEnv()
	if err != nil {
		log.Fatalf("failed loading certs: %v", err)
	}

	log.Printf("Server listening on %v:%v using certs: %+v\n", server.Addr, port, certs)
	if err := server.ListenAndServeTLS(certs.certPath, certs.keyPath); err != nil {
		fmt.Println(err)
	}
}

// buildMux creates the server mux and registers endpoints with it.
func buildMux() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello HTTP/2")
	})
	mux.HandleFunc("/api/items", items)
	return mux
}

func getPortFromEnv() (string, error) {
	port := os.Getenv("PORT")
	return port, nil
}

// getCertsFromEnv loads certificates from the environment
func getCertsFromEnv() (*Certs, error) {
	var certs Certs
	certBasePath := os.Getenv("CERTS_PATH")
	if len(certBasePath) == 0 {
		log.Println("CERTS_PATH is not set, defaulting...")
		certs.certPath = "/go/bin/certs/cert.pem"
		certs.keyPath = "/go/bin/certs/key.pem"
		return &certs, nil
	}
	certs.certPath = certBasePath + "/cert.pem"
	certs.keyPath = certBasePath + "/key.pem"

	return &certs, nil
}

// main is the entrypoint to the program.
func main() {
	// init the database
	log.Println("Starting up (version 123)...")
	log.Println("Initing DB...")
	gDb = initDb()

	// build the mux
	mux := buildMux()

	// start the server
	startServing(mux)
}
