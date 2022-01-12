// entry point to golang server.
package main

import (
	"crypto/tls"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
)

type Certs struct {
	certPath string
	keyPath  string
}

type DbConfig struct {
	host     string
	user     string
	password string
	dbname   string
	port     string
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
	}

	// load the certificates from the environment.
	certs, err := getCertsFromEnv()
	if err != nil {
		// heroku charges for this, so have an option to not...
		server.TLSConfig = &tls.Config{
			NextProtos: []string{"h2", "http/1.1"},
		}
		log.Print("Server listening on %v not using certs", server.Addr)
		if err := server.ListenAndServe(); err != nil {
			fmt.Println(err)
		}
	} else {
		log.Println("Server listening on %v using certs: %+v\n", server.Addr, certs)
		if err := server.ListenAndServeTLS(certs.certPath, certs.keyPath); err != nil {
			fmt.Println(err)
		}
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

func getDbConfigFromEnv() (*DbConfig, error) {
	var dbConfig DbConfig
	var found bool

	dbConfig.host, found = os.LookupEnv("DB_HOST")
	if !found {
		panic("Failed finding DB_HOST")
	}
	dbConfig.user, found = os.LookupEnv("DB_USER")
	if !found {
		panic("Failed finding DB_USER")
	}
	dbConfig.password, found = os.LookupEnv("DB_PASSWORD")
	if !found {
		panic("Failed finding DB_PASSWORD")
	}
	dbConfig.dbname, found = os.LookupEnv("DB_NAME")
	if !found {
		panic("Failed finding DB_NAME")
	}
	dbConfig.port, found = os.LookupEnv("DB_PORT")
	if !found {
		panic("Failed finding DB_PORT")
	}
	return &dbConfig, nil
}

// main is the entrypoint to the program.
func main() {
	// init the database
	log.Println("Initing DB...")
	var dbConfig *DbConfig
	dbConfig, err := getDbConfigFromEnv()
	if err != nil {
		panic("Can't get DB config from environment!")
	}
	gDb = initDb(*dbConfig)

	// build the mux
	mux := buildMux()

	// start the server
	startServing(mux)
}
