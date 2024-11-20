// pkg/database/postgres.go
package database

import (
	"github.com/medicine-ecommerce/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto migrate models
	err = db.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.Order{},
	)
	if err != nil {
		return nil, err
	}

	return db, nil
}
