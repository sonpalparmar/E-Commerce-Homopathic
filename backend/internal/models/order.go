// internal/models/order.go
package models

import (
	"gorm.io/gorm"
)

type OrderStatus string

const (
	Pending  OrderStatus = "pending"
	Accepted OrderStatus = "accepted"
	Rejected OrderStatus = "rejected"
)

type Order struct {
	gorm.Model
	UserID       uint        `json:"user_id"`
	SellerID     uint        `json:"seller_id"`
	ProductID    uint        `json:"product_id"`
	ProductName  string      `json:"product_name" binding:"required"`
	Quantity     int         `json:"quantity" binding:"required"`
	Price        float64     `json:"price" binding:"required"`
	TotalAmount  float64     `json:"total_amount"`
	Pincode      string      `json:"pincode" binding:"required"`
	Status       OrderStatus `json:"status" default:"pending"`
	RejectReason string      `json:"reject_reason"`
}
