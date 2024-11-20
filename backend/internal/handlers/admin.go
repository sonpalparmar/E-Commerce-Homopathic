// internal/handlers/admin.go
package handlers

import (
	"net/http"

	"github.com/medicine-ecommerce/internal/models"
	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AdminHandler struct {
	db *gorm.DB
}

func NewAdminHandler(db *gorm.DB) *AdminHandler {
	return &AdminHandler{db: db}
}

func (h *AdminHandler) CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	adminID, _ := c.Get("userID")
	product.AdminID = adminID.(uint)

	if err := h.db.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func (h *AdminHandler) UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := h.db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func (h *AdminHandler) DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	if err := h.db.Delete(&models.Product{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func (h *AdminHandler) CreateSeller(c *gin.Context) {
	var seller models.User
	if err := c.ShouldBindJSON(&seller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure user type is set to seller
	seller.UserType = models.SellerType

	// Hash password if provided
	if seller.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(seller.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		seller.Password = string(hashedPassword)
	}

	if err := h.db.Create(&seller).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create seller"})
		return
	}

	seller.Password = "" // Don't send password in response
	c.JSON(http.StatusCreated, seller)
}

func (h *AdminHandler) GetAllProducts(c *gin.Context) {
	var products []models.Product

	// Query all products from the database
	if err := h.db.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"count":    len(products),
	})
}
