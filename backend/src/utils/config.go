package utils

import (
	"os"
)

type Config struct {
	Port  string
	DbUrl string
}

func GetPortFromEnv() string {
	port, found := os.LookupEnv("PORT")
	if !found {
		panic("Failed finding PORT")
	}
	return port
}

func GetDbUrlFromEnv() string {
	var found bool

	dburl, found := os.LookupEnv("DATABASE_URL")
	if !found {
		panic("Failed finding DATABASE_URL")
	}
	return dburl
}

func GetConfig() *Config {
	config := Config{
		Port:  GetPortFromEnv(),
		DbUrl: GetDbUrlFromEnv(),
	}
	return &config
}
