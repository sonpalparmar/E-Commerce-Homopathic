# Use official Golang image
FROM golang:1.21-alpine AS builder

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY backend/go.mod backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY backend/ .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/main.go

# Production stage
FROM alpine:latest

# Install certificates
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy built binary from builder stage
COPY --from=builder /app/main .

# Expose application port
EXPOSE 8080

# Run the binary
CMD ["./main"]