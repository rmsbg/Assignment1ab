// Package domain defines the initial SkiRental data model.
package domain

import "time"

// Person represents a customer. Identity data must not appear in overview pages.
type Person struct {
	ID                  string `json:"id"`
	Name                string `json:"name"`
	DocumentType        string `json:"documentType,omitempty"`
	DocumentDescription string `json:"documentDescription,omitempty"`
	DocumentNumber      string `json:"documentNumber,omitempty"`
	Photo               []byte `json:"-"`
	PhotoType           string `json:"-"`
	PhotoURL            string `json:"photoURL,omitempty"`
}

// Ski represents a pair of skis rented and returned together.
type Ski struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// Rental is active until ReturnedAt is set.
type Rental struct {
	ID         string
	PersonID   string
	SkiID      string
	RentedAt   time.Time
	ReturnedAt time.Time
}
