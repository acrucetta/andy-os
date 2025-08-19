package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

const dataDir = "/data"

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for development
	},
}

type Window struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Type      string `json:"type"`
	X         int    `json:"x"`
	Y         int    `json:"y"`
	Width     int    `json:"width"`
	Height    int    `json:"height"`
	Minimized bool   `json:"minimized"`
	Content   string `json:"content,omitempty"`
}

type File struct {
	Name     string `json:"name"`
	Type     string `json:"type"`
	Content  string `json:"content,omitempty"`
	Modified string `json:"modified"`
}

type SystemState struct {
	Windows []Window `json:"windows"`
	Files   []File   `json:"files"`
	Theme   string   `json:"theme"`
}

var (
	state = SystemState{
		Windows: []Window{},
		Files:   []File{},
		Theme:   "system7",
	}
	clients = make(map[*websocket.Conn]bool)
	mutex   sync.RWMutex
)

func main() {
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3002")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "*")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// API routes
	r.GET("/api/state", getState)
	r.POST("/api/windows", createWindow)
	r.PUT("/api/windows/:id", updateWindow)
	r.DELETE("/api/windows/:id", deleteWindow)
	r.GET("/api/files", getFiles)
	r.GET("/api/files/:filename", loadFile)
	r.POST("/api/files", createFile)
	r.POST("/api/save", saveFile)
	r.PUT("/api/theme", updateTheme)
	r.GET("/ws", handleWebSocket)

	log.Println("Server starting on :3001")
	r.Run(":3001")
}

func getState(c *gin.Context) {
	mutex.RLock()
	defer mutex.RUnlock()

	c.JSON(http.StatusOK, state)
}

func createWindow(c *gin.Context) {
	var window Window
	if err := c.ShouldBindJSON(&window); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mutex.Lock()
	state.Windows = append(state.Windows, window)
	mutex.Unlock()

	broadcastState()
	c.JSON(http.StatusOK, window)
}

func updateWindow(c *gin.Context) {
	id := c.Param("id")

	var window Window
	if err := c.ShouldBindJSON(&window); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mutex.Lock()
	for i, w := range state.Windows {
		if w.ID == id {
			state.Windows[i] = window
			break
		}
	}
	mutex.Unlock()

	broadcastState()
	c.JSON(http.StatusOK, window)
}

func deleteWindow(c *gin.Context) {
	id := c.Param("id")

	mutex.Lock()
	for i, w := range state.Windows {
		if w.ID == id {
			state.Windows = append(state.Windows[:i], state.Windows[i+1:]...)
			break
		}
	}
	mutex.Unlock()

	broadcastState()
	c.Status(http.StatusNoContent)
}

func getFiles(c *gin.Context) {
	mutex.RLock()
	defer mutex.RUnlock()
	c.JSON(http.StatusOK, state.Files)
}

func createFile(c *gin.Context) {
	var file File
	if err := c.ShouldBindJSON(&file); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mutex.Lock()
	state.Files = append(state.Files, file)
	// Save here also to load the file to the data folder.
	mutex.Unlock()

	broadcastState()
	c.JSON(http.StatusOK, file)
}

// Saves the latest file content
func saveFile(c *gin.Context) {
	var file File
	if err := c.ShouldBindJSON(&file); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Save file content to disk
	filePath := filepath.Join(dataDir, file.Name)
	if err := os.WriteFile(filePath, []byte(file.Content), 0644); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Update in-memory state
	mutex.Lock()
	for i, f := range state.Files {
		if f.Name == file.Name {
			state.Files[i] = file
			break
		}
	}
	mutex.Unlock()

	broadcastState()
	c.JSON(http.StatusOK, file)
}

// Returns a specific file content
func loadFile(c *gin.Context) {
	filename := c.Param("filename")

	// Open file from the data folder
	filePath := filepath.Join(dataDir, filename)

	file, err := os.Open(filePath)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}
	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"filename": filename,
		"content":  string(content),
	})
}

func updateTheme(c *gin.Context) {
	var req struct {
		Theme string `json:"theme"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mutex.Lock()
	state.Theme = req.Theme
	mutex.Unlock()

	broadcastState()
	c.JSON(http.StatusOK, gin.H{"theme": state.Theme})
}

func handleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	mutex.Lock()
	clients[conn] = true
	mutex.Unlock()

	// Send initial state
	conn.WriteJSON(state)

	// Keep connection alive
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			mutex.Lock()
			delete(clients, conn)
			mutex.Unlock()
			break
		}
	}
}

func broadcastState() {
	mutex.RLock()
	stateCopy := state
	mutex.RUnlock()

	mutex.Lock()
	for client := range clients {
		err := client.WriteJSON(stateCopy)
		if err != nil {
			delete(clients, client)
			client.Close()
		}
	}
	mutex.Unlock()
}
