package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/medicine-ecommerce/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SellerHandler struct {
	db *gorm.DB
}

func NewSellerHandler(db *gorm.DB) *SellerHandler {
	return &SellerHandler{db: db}
}

func (h *SellerHandler) GetOrders(c *gin.Context) {
	sellerID, _ := c.Get("userID")
	var orders []models.Order

	if err := h.db.Where("seller_id = ?", sellerID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

type OrderResponseRequest struct {
	Accept       bool   `json:"Accept" binding:"required"`
	RejectReason string `json:"RejectReason"`
}

func (h *SellerHandler) RespondToOrder(c *gin.Context) {
	orderID := c.Param("id")
	var request OrderResponseRequest

	// 1. Debug: Print received headers
	fmt.Println("Received Headers:", c.Request.Header)

	// 2. Read and log the raw body
	bodyBytes, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body", "details": err.Error()})
		return
	}

	// Log the raw body
	fmt.Printf("Raw request body: %s\n", string(bodyBytes))

	// 3. Attempt manual JSON parsing
	err = json.Unmarshal(bodyBytes, &request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":         "Failed to parse JSON",
			"details":       err.Error(),
			"received_data": string(bodyBytes),
		})
		return
	}

	// 4. Debug: Print the parsed request
	fmt.Printf("Parsed request struct: %+v\n", request)

	// 5. Validate seller ID from token
	sellerID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Seller ID not found in token"})
		return
	}
	fmt.Printf("Seller ID from token: %v\n", sellerID)

	// 6. Find and validate order
	var order models.Order
	if err := h.db.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":    "Order not found",
			"order_id": orderID,
			"details":  err.Error(),
		})
		return
	}

	// 7. Debug: Print found order
	fmt.Printf("Found order: %+v\n", order)

	// 8. Validate seller ownership
	if order.SellerID != sellerID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Order doesn't belong to this seller"})
		return
	}

	// Validate reject reason when rejecting
	if !request.Accept && request.RejectReason == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reject reason is required when rejecting an order"})
		return
	}

	// Update order status
	if request.Accept {
		order.Status = models.Accepted
	} else {
		order.Status = models.Rejected
		order.RejectReason = request.RejectReason
	}

	if err := h.db.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to update order",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Order updated successfully",
		"order":   order,
	})
}
