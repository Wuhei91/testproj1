package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Guest struct
type Guest struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	GuestName   string `json:"guestname"`
	GuestNumber string `json:"guestnumber"`
	PhoneNumber string `json:"phonenumber"`
	Vege        bool   `json:"vege"`
}

var db *gorm.DB

func initDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgresql://wuhei:4aIEAM3m8rl0yRHArBTYwdMFDTGTvJbt@dpg-cve1nvt6l47c73aa1dv0-a.singapore-postgres.render.com/mydb_gqc1"
	}
	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	db.AutoMigrate(&Guest{})
	fmt.Println("Database connected and migrated!")
}

func main() {
	initDB()
	r := gin.Default()

	// Serve Angular app at /ui
	r.StaticFS("/ui", http.Dir("../dist/testproj1/browser"))

	// Handle Angular routes for SPA
	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path
		if path == "/ui" || path == "/ui/" || path == "/ui/index.html" {
			c.File("../dist/testproj1/browser/index.html")
		} else {
			c.File("../dist/testproj1/browser" + path)
		}
	})

	// API routes
	r.GET("/guests", getGuests)
	r.POST("/guests", createGuest)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}

func getGuests(c *gin.Context) {
	var guests []Guest
	if result := db.Find(&guests); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, guests)
}

func createGuest(c *gin.Context) {
	var newGuest Guest
	if err := c.ShouldBindJSON(&newGuest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := db.Create(&newGuest); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, newGuest)
}
