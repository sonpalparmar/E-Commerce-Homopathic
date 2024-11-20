// internal/models/user.go
package models

import (
	"gorm.io/gorm"
)

type UserType string

const (
	AdminType  UserType = "admin"
	SellerType UserType = "seller"
	BuyerType  UserType = "buyer"
)

type User struct {
	gorm.Model
	Name     string   `json:"name" binding:"required"`
	Email    string   `json:"email" binding:"required,email" gorm:"unique"`
	Password string   `json:"password" binding:"required"`
	Phone    string   `json:"phone" binding:"required"`
	Address  string   `json:"address" binding:"required"`
	Pincode  string   `json:"pincode" binding:"required"`
	UserType UserType `json:"user_type" binding:"required"`
}
