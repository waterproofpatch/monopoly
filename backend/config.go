package main

import "os"

type Config struct {
	port  string
	dbUrl string
}

func getPortFromEnv() string {
	port, found := os.LookupEnv("PORT")
	if !found {
		panic("Failed finding PORT")
	}
	return port
}

func getDbUrlFromEnv() string {
	var found bool

	dburl, found := os.LookupEnv("DATABASE_URL")
	if !found {
		panic("Failed finding DATABASE_URL")
	}
	return dburl
}

func getConfig() *Config {
	config := Config{
		port:  getPortFromEnv(),
		dbUrl: getDbUrlFromEnv(),
	}
	return &config
}
