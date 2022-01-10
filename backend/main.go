// entry point to golang server.
package main

import (
	"crypto/tls"
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
)

type Certs struct {
	certPath string
	keyPath  string
}

// should match 'listen' port in src/frontend/nginx/nginx.conf
const gDefaultPort int = 8081

// startServing loads the HTTPS certs and begins listening for connections on
// http2 at the specified portString.
func startServing(portString string, mux *http.ServeMux) {
	server := http.Server{
		Addr:    portString,
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

	log.Printf("Server listening on %v using certs: %+v\n", server.Addr, certs)
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

// main is the entrypoint to the program.
func main() {
	// init the database
	log.Println("Starting up (version 123)...")
	log.Println("Initing DB...")
	gDb = initDb()

	// default port.
	port := flag.Int("port", gDefaultPort, "listen port")
	flag.Parse()

	// build the mux
	mux := buildMux()

	// start the server
	portString := fmt.Sprintf(":%d", *port)
	startServing(portString, mux)
}
