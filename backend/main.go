package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

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
	r := mux.NewRouter()

	// CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3002"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	// API routes
	r.HandleFunc("/api/state", getState).Methods("GET")
	r.HandleFunc("/api/windows", createWindow).Methods("POST")
	r.HandleFunc("/api/windows/{id}", updateWindow).Methods("PUT")
	r.HandleFunc("/api/windows/{id}", deleteWindow).Methods("DELETE")
	r.HandleFunc("/api/files", getFiles).Methods("GET")
	r.HandleFunc("/api/files", createFile).Methods("POST")
	r.HandleFunc("/api/theme", updateTheme).Methods("PUT")
	r.HandleFunc("/ws", handleWebSocket)

	// Apply CORS
	handler := c.Handler(r)

	log.Println("Server starting on :3001")
	log.Fatal(http.ListenAndServe(":3001", handler))
}

func getState(w http.ResponseWriter, r *http.Request) {
	mutex.RLock()
	defer mutex.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(state)
}

func createWindow(w http.ResponseWriter, r *http.Request) {
	var window Window
	if err := json.NewDecoder(r.Body).Decode(&window); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mutex.Lock()
	state.Windows = append(state.Windows, window)
	mutex.Unlock()

	broadcastState()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(window)
}

func updateWindow(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var window Window
	if err := json.NewDecoder(r.Body).Decode(&window); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
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
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(window)
}

func deleteWindow(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	mutex.Lock()
	for i, w := range state.Windows {
		if w.ID == id {
			state.Windows = append(state.Windows[:i], state.Windows[i+1:]...)
			break
		}
	}
	mutex.Unlock()

	broadcastState()
	w.WriteHeader(http.StatusNoContent)
}

func getFiles(w http.ResponseWriter, r *http.Request) {
	mutex.RLock()
	defer mutex.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(state.Files)
}

func createFile(w http.ResponseWriter, r *http.Request) {
	var file File
	if err := json.NewDecoder(r.Body).Decode(&file); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mutex.Lock()
	state.Files = append(state.Files, file)
	mutex.Unlock()

	broadcastState()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(file)
}

func updateTheme(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Theme string `json:"theme"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mutex.Lock()
	state.Theme = req.Theme
	mutex.Unlock()

	broadcastState()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"theme": state.Theme})
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
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
