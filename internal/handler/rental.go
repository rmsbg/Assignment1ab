package handler

import (
	"encoding/json"
	"errors"
	"io"
	"mime"
	"net/http"
	"time"

	"skirental/internal/store"
)

type rentalResponse struct {
	ID         string     `json:"id"`
	PersonID   string     `json:"personID"`
	SkiID      string     `json:"skiID"`
	PersonName string     `json:"personName"`
	SkiName    string     `json:"skiName"`
	RentedAt   time.Time  `json:"rentedAt"`
	ReturnedAt *time.Time `json:"returnedAt"`
}

func exposeRental(detail store.RentalDetails) rentalResponse {
	r := detail.Rental
	result := rentalResponse{ID: r.ID, PersonID: r.PersonID, SkiID: r.SkiID, PersonName: detail.PersonName, SkiName: detail.SkiName, RentedAt: r.RentedAt}
	if !r.Active() {
		returned := r.ReturnedAt
		result.ReturnedAt = &returned
	}
	return result
}
func registerRentals(mux *http.ServeMux, s *store.Store) {
	mux.HandleFunc("GET /api/ski/verfuegbar", func(w http.ResponseWriter, r *http.Request) { writeJSON(w, 200, s.AvailableSkis()) })
	mux.HandleFunc("GET /api/ausleihen", func(w http.ResponseWriter, r *http.Request) {
		result := []rentalResponse{}
		for _, detail := range s.Rentals() {
			result = append(result, exposeRental(detail))
		}
		writeJSON(w, 200, result)
	})
	mux.HandleFunc("GET /api/ausleihen/{id}", func(w http.ResponseWriter, r *http.Request) {
		detail, err := s.Rental(r.PathValue("id"))
		if err != nil {
			apiError(w, err)
			return
		}
		writeJSON(w, 200, exposeRental(detail))
	})
	mux.HandleFunc("POST /api/ausleihen", func(w http.ResponseWriter, r *http.Request) {
		media, _, _ := mime.ParseMediaType(r.Header.Get("Content-Type"))
		if media != "application/json" {
			writeJSON(w, 415, map[string]any{"errors": map[string]string{"form": "JSON erwartet."}})
			return
		}
		r.Body = http.MaxBytesReader(w, r.Body, 64*1024)
		var input struct {
			PersonID string `json:"personID"`
			SkiID    string `json:"skiID"`
		}
		dec := json.NewDecoder(r.Body)
		dec.DisallowUnknownFields()
		if err := dec.Decode(&input); err != nil {
			apiError(w, err)
			return
		}
		if err := dec.Decode(new(any)); err != io.EOF {
			if err == nil {
				err = errors.New("extra JSON")
			}
			apiError(w, err)
			return
		}
		detail, err := s.CreateRental(input.PersonID, input.SkiID)
		if err != nil {
			apiError(w, err)
			return
		}
		w.Header().Set("Location", "/api/ausleihen/"+detail.Rental.ID)
		writeJSON(w, 201, exposeRental(detail))
	})
	mux.HandleFunc("PUT /api/ausleihen/{id}/rueckgabe", func(w http.ResponseWriter, r *http.Request) {
		// This action accepts no replacement fields or client-controlled timestamps.
		body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 64*1024))
		if err != nil {
			apiError(w, err)
			return
		}
		if len(body) != 0 {
			apiError(w, errors.New("unexpected return body"))
			return
		}
		detail, err := s.ReturnRental(r.PathValue("id"))
		if err != nil {
			apiError(w, err)
			return
		}
		writeJSON(w, 200, exposeRental(detail))
	})
}
