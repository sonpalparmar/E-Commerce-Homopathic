// cmd/main.go
package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/medicine-ecommerce/internal/middleware"

	"github.com/medicine-ecommerce/internal/config"
	"github.com/medicine-ecommerce/internal/database"
	"github.com/medicine-ecommerce/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize database
	db, err := database.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Initialize router
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"POST", "GET", "PUT", "OPTIONS", "DELETE"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Accept", "User-Agent", "Cache-Control", "Pragma"}
	config.ExposeHeaders = []string{"Content-Length"}
	config.AllowCredentials = true
	config.MaxAge = 12 * time.Hour

	router.Use(cors.New(config))

	// Initialize handlers
	userHandler := handlers.NewUserHandler(db)
	adminHandler := handlers.NewAdminHandler(db)
	sellerHandler := handlers.NewSellerHandler(db)
	orderHandler := handlers.NewOrderHandler(db)

	// Public routes
	public := router.Group("/api/v1")
	{
		public.POST("/register", userHandler.Register)
		public.POST("/login", userHandler.Login)
		public.GET("/products", adminHandler.GetAllProducts)
	}

	// Protected routes
	protected := router.Group("/api/v1")
	protected.Use(middleware.AuthMiddleware())
	{
		// User routes
		protected.GET("/user/profile", userHandler.GetProfile)
		protected.PUT("/user/profile", userHandler.UpdateProfile)

		// Admin routes
		admin := protected.Group("/admin")
		admin.Use(middleware.AdminOnly())
		{
			admin.POST("/products", adminHandler.CreateProduct)
			admin.PUT("/products/:id", adminHandler.UpdateProduct)
			admin.DELETE("/products/:id", adminHandler.DeleteProduct)
			admin.POST("/sellers", adminHandler.CreateSeller)
			admin.GET("/getallorders", orderHandler.GetAllOrders)
			admin.GET("/productlist", adminHandler.GetAllProducts)
		}

		// Seller routes
		seller := protected.Group("/seller")
		seller.Use(middleware.SellerOnly())
		{
			seller.GET("/orders", sellerHandler.GetOrders)
			seller.POST("/orders/:id/respond", sellerHandler.RespondToOrder)
		}

		// Order routes
		protected.POST("/orders", orderHandler.CreateOrder)
		protected.GET("/orders", orderHandler.GetUserOrders)
	}

	// Start server
	router.Run(":" + cfg.Port)
}
