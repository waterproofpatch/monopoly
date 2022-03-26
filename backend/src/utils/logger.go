package utils

import (
	"log"
	"net/http"
	"time"
)

func Logger(inner func(http.ResponseWriter, *http.Request), name string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		inner(w, r)

		log.Printf(
			"%s%s\t%s\t%s\t%s%d",
			r.RemoteAddr,
			r.Method,
			r.RequestURI,
			r.Response.Status,
			name,
			time.Since(start),
		)
	}
}
