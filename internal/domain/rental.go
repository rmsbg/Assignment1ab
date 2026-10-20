package domain

import "strings"

func (r Rental) Active() bool { return r.ReturnedAt.IsZero() }

func ValidateRentalReferences(personID, skiID string) (string, string, error) {
	personID, skiID = strings.TrimSpace(personID), strings.TrimSpace(skiID)
	fields := ValidationErrors{}
	if personID == "" {
		fields["personID"] = "Bitte eine Person auswählen."
	}
	if skiID == "" {
		fields["skiID"] = "Bitte ein verfügbares Ski-Paar auswählen."
	}
	if len(fields) > 0 {
		return "", "", fields
	}
	return personID, skiID, nil
}
