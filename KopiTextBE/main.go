package main

import (
	"math/rand"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

type Content struct {
	Value string `json:"value"`
}

var dummyDB = make(map[string]string)

func generateId() string {
	letters := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	b := make([]rune, 3)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func main() {
	router := gin.Default();

	router.Use((cors.Default()))

	router.POST("/api/texts", func(c *gin.Context){
		var req Content
		
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error":err.Error()})
			return
		}

		id := generateId()
		dummyDB[id] = req.Value
		c.JSON(http.StatusCreated, gin.H{"id":id, "message":"Text successfully created!"})
	})

	router.GET("/api/texts/:id", func(c *gin.Context){
		id := c.Param("id")
		val, exist := dummyDB[id]
		if !exist{
			c.JSON(http.StatusNotFound, gin.H{"error": "Not found!"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"result": val})
	})

	router.Run(":8080")
}
