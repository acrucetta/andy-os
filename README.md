# andy-os MVP Skeleton

A minimal MVP implementation of andy-os - a web-based desktop environment with Go backend and React frontend.

## Features (MVP)

- Basic desktop environment with window management
- Simple file system operations
- Basic text editor
- Theme switching (System 7, Windows XP)
- Virtual file system with local storage

## Project Structure

```
andy-os/
├── backend/          # Go backend
│   ├── main.go
│   ├── handlers/
│   ├── models/
│   └── go.mod
├── frontend/         # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Quick Start

### Backend (Go)
```bash
cd backend
go mod tidy
go run main.go
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## Development

- Backend runs on `http://localhost:3001`
- Frontend runs on `http://localhost:3002`

## Learning Goals

- Desktop environment architecture
- Window management systems
- File system abstraction
- Theme system implementation
- Real-time updates between frontend and backend
