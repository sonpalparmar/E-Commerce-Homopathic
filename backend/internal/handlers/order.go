// internal/handlers/order.go
package handlers

import (
	"log"
	"net/http"

	"github.com/medicine-ecommerce/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OrderHandler struct {
	db *gorm.DB
}

func NewOrderHandler(db *gorm.DB) *OrderHandler {
	return &OrderHandler{db: db}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	order.UserID = userID.(uint)

	// Find nearest seller based on pincode
	var seller models.User
	if err := h.db.Where("user_type = ? AND pincode = ?", models.SellerType, order.Pincode).First(&seller).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No seller found for this pincode"})
		return
	}
	order.SellerID = seller.ID

	// Calculate total amount
	order.TotalAmount = float64(order.Quantity) * order.Price
	order.Status = models.Pending

	if err := h.db.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	c.JSON(http.StatusCreated, order)
}

func (h *OrderHandler) GetUserOrders(c *gin.Context) {
	userID, _ := c.Get("userID")
	var orders []models.Order

	// Get user type from context
	userType, _ := c.Get("userType")

	query := h.db

	// If user is a seller, get orders assigned to them
	if userType == string(models.SellerType) {
		query = query.Where("seller_id = ?", userID)
	} else {
		// For regular users, get their orders
		query = query.Where("user_id = ?", userID)
	}

	if err := query.Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}
func (h *OrderHandler) GetAllOrders(c *gin.Context) {
	var orders []models.Order
	userType, _ := c.Get("userType")
	// Log request details for debugging
	if userType != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "unotherized user"})
		return
	}
	log.Println("Fetching all orders...")

	if err := h.db.Find(&orders).Error; err != nil {
		log.Printf("Error fetching orders: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"orders": orders,
		"count":  len(orders),
	})
}
