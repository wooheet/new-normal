package id

import "github.com/google/uuid"

// New returns a new UUID v4 string.
func New() string {
	return uuid.New().String()
}
