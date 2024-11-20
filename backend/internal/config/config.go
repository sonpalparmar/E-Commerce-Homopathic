package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	Environment string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Error loading .env file")
	}

	// Construct the DatabaseURL dynamically
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "medicine_ecommerce")
	databaseURL := "postgresql://" + dbUser + ":" + dbPassword + "@" + dbHost + ":" + dbPort + "/" + dbName + "?sslmode=disable"

	config := &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: databaseURL,
		JWTSecret:   getEnv("JWT_SECRET", "your-secret-key"),
		Environment: getEnv("ENVIRONMENT", "development"),
	}

	return config
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// // internal/config/config.go
// package config

// import (
// 	"log"
// 	"os"

// 	"github.com/joho/godotenv"
// )

// type Config struct {
// 	Port        string
// 	DatabaseURL string
// 	JWTSecret   string
// 	Environment string
// }

// func LoadConfig() *Config {
// 	err := godotenv.Load()
// 	if err != nil {
// 		log.Println("Warning: Error loading .env file")
// 	}

// 	config := &Config{
// 		Port:        getEnv("PORT", "8080"),
// 		DatabaseURL: getEnv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/medicine_ecommerce?sslmode=disable"),
// 		JWTSecret:   getEnv("JWT_SECRET", "your-secret-key"),
// 		Environment: getEnv("ENVIRONMENT", "development"),
// 	}

// 	return config
// }

// func getEnv(key, defaultValue string) string {
// 	value := os.Getenv(key)
// 	if value == "" {
// 		return defaultValue
// 	}
// 	return value
// }
