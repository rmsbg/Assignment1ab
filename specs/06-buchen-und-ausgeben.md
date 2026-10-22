# Phase 6 – Buchen und ausgeben

Status: implementiert und technisch geprüft am 22.10.2026.
Am 22.10.2026 ausdrücklich vom Auftraggeber abgenommen.

## Verhalten und Schnittstelle

Bei Verleihbeginn heute (Europe/Vienna) bietet das Formular die Hauptaktion
„Buchen und ausgeben“ sowie „Nur buchen“. Für spätere Termine gibt es „Buchen“.
Alle drei Aktionen bestätigen den zuvor angezeigten Preis. Die separate Ausgabe
bestehender Buchungen bleibt möglich.

POST /api/ausleihen akzeptiert zusätzlich das optionale Boolean
`issueImmediately` (Standard false). Bei true werden Buchung und Ausgabe unter
einer gemeinsamen Store-Sperre geprüft und gespeichert. Die Antwort bleibt 201
mit Location und den vorhandenen Ausleihfeldern, bei Sofortausgabe mit Status
issued und gesetztem rentedAt. CreateRental bleibt für reine Buchungen erhalten;
CreateAndIssueRental bietet die atomare Sofortausgabe.

Bei zukünftiger Sofortausgabe, geändertem Tarif, überlappender Buchung oder noch
nicht zurückgegebenem Paar wird nichts angelegt. Fachliche Konflikte liefern 409;
ungültige Eingaben weiterhin 400. Fehlende oder false gesetzte Sofortausgabe
behält den bisherigen Reservierungsablauf bei. Preis-/Verfügbarkeitskonflikte
laden eine neue Vorschau und erfordern erneute Auswahl und Bestätigung.
Während der Anfrage sind beide Buchungsbuttons gesperrt.

## Prüfnachweis

Erfolgreich ausgeführt:

- `go build ./...`
- `go test ./...`
- `go test -race ./...`
- `go vet ./...`

Store-Tests prüfen Sofortausgabe und Dashboardzahlen, Wien-Tageswechsel,
Zukunftstermine, veralteten Tarif, Überschneidung und überfällige Vorgänger ohne
Teiländerungen sowie 32 konkurrierende Sofortausgaben mit genau einem Erfolg.
HTTP-Tests prüfen das neue Feld, Rückwärtskompatibilität, Status und Zeitstempel,
Location, Fehlerantworten und einen erneuten Buchungsversuch ohne Doppelbuchung.
Die vorhandenen Tests für Reservierung, Ausgabe, Rückgabe und MVP laufen mit.

Browserprüfung mit Chrome: Desktop (1280 × 1000), schmaler Bildschirm (390 × 844),
Sofortausgabe per Tastatur, reine Reservierung, Umschalten der Buttons bei
Datumsänderung, erneute Preisprüfung und Zukunftsbuchung. Keine JavaScript-Fehler
und kein horizontaler Überlauf. Tarifänderung nach Preisprüfung verhindert das
Speichern und erfordert erneute Bestätigung des neuen Preises.

Screenshots:

- [Desktop](screenshots/06-buchen-ausgeben-desktop.png)
- [Mobil](screenshots/06-buchen-ausgeben-mobil.png)

Nach der Prüfung wurde der Server mit frischen synthetischen Demodaten gestartet.
Alle Daten bleiben wie bisher flüchtig. Keine neuen Abhängigkeiten.

## Auftraggeberabnahme am 22.10.2026

- [x] „Buchen und ausgeben“ für heute speichert unmittelbar die Übergabe.
- [x] „Nur buchen“ lässt die spätere Ausgabe offen.
- [x] Zukünftige Termine bieten nur „Buchen“.
- [x] Bedienung und Rückmeldungen entsprechen dem gewünschten Verleihablauf.

Der Auftraggeber hat die bereitgestellte Änderung ausdrücklich mit
„die änderung ist hiermit abgenommen. mach bitte einen commit und aktualisiere
die dokumente auch entsprechend“ bestätigt. Damit ist Phase 6 abgeschlossen.
Die Abnahme beruht auf dieser ausdrücklichen Bestätigung; sie wird nicht allein
aus bestandenen technischen Prüfungen abgeleitet.

Abnahme und obiger Prüfnachweis werden vor dem lokalen Abschluss-Commit
`Phase 6: Buchung mit sofortiger Ausgabe abschließen` dokumentiert.
