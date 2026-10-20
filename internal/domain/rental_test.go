package domain

import (
	"testing"
	"time"
)

func TestRentalReferencesAndActivity(t *testing.T) {
	for _, ids := range [][2]string{{"", ""}, {" ", "ski"}, {"person", " "}} {
		if _, _, err := ValidateRentalReferences(ids[0], ids[1]); err == nil {
			t.Fatal("missing reference accepted")
		}
	}
	p, s, err := ValidateRentalReferences(" person ", " ski ")
	if err != nil || p != "person" || s != "ski" {
		t.Fatal("references not trimmed")
	}
	r := Rental{}
	if !r.Active() {
		t.Fatal("new rental inactive")
	}
	r.ReturnedAt = time.Now()
	if r.Active() {
		t.Fatal("returned rental active")
	}
}
