# Build stage
FROM golang:1.25-alpine AS build

WORKDIR /app

# Install git (needed for go mod download)
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Production stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Create data directory
RUN mkdir -p /data

# Copy the binary from build stage
COPY --from=build /app/main .

# Expose port 3001
EXPOSE 3001

# Run the binary
CMD ["./main"]
