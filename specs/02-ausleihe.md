# Phase 2 – Ausleihe und Rückgabe

## Status und Umfang

Spezifikation vor Implementierung erstellt, 20.10.2026. Phase 1 ist abgenommen.
**Aktueller Status: implementiert, geprüft und vom Auftraggeber am 21.10.2026 abgenommen.**
Phase 2 umfasst das Anlegen und Anzeigen von Ausleihen sowie die Rückgabe.
Die Auftraggeberabnahme erfolgte nach Implementierung und Prüfung gesondert;
der lokale Phasen-Commit dokumentiert die ausdrücklich bestätigte Abnahme.
Echte Dashboard-Kennzahlen bleiben Phase 3 vorbehalten.

## Abläufe und Geschäftsregeln

- Unter „Neue Ausleihe“ wählen Mitarbeiter eine vorhandene Person und ein aktuell
  verfügbares Ski-Paar. Auswahltexte enthalten Name und ID, damit gleiche Namen
  unterscheidbar bleiben. Nach einer Personenregistrierung und im Personendetail
  führt „Ski ausleihen“ hierher; die betreffende Person ist vorausgewählt.
- Eine Person darf mehrere unterschiedliche Ski-Paare gleichzeitig ausleihen.
  Jede Ausleihe verknüpft genau eine vorhandene Person mit genau einem Paar.
- Das Backend erzeugt unveränderliche Ausleih-IDs und UTC-Zeitpunkte automatisch.
  Es gibt keine manuell wählbaren Termine, Preise oder Reservierungen.
- Verfügbarkeit ergibt sich ausschließlich aus aktiven Ausleihen. Prüfung und
  Anlage erfolgen atomar unter derselben Sperre. Bei gleichzeitigen Anfragen
  auf dasselbe Paar gelingt genau eine. Fehler verändern keine Daten.
- Das Formular bietet Abbrechen und sichtbare Bestätigung. Fehlende Personen
  oder verfügbare Ski führen zu erklärenden Hinweisen und Links zur Verwaltung.
- Eine Übersicht zeigt aktive Ausleihen (Person, Paar, IDs, Zeitpunkt) mit
  „Rückgabe erfassen“. Beendete Ausleihen bleiben als Verlauf mit Rückgabezeit
  sichtbar. Listen zeigen keine Ausweisnachweise. Namen sind aktuelle Stammdaten;
  die unveränderten IDs sichern die Zuordnung auch nach einer Umbenennung.
- Rückgabe beendet genau die ausgewählte Ausleihe und macht das Paar wieder
  verfügbar. Wiederholte Rückgabe ist idempotent: ursprünglicher Zeitpunkt bleibt
  erhalten. Insbesondere beeinflusst die Rückgabe einer alten Ausleihe keine
  spätere Ausleihe desselben Paars.
- Veraltete Auswahllisten sind möglich. Ein Konflikt erklärt, dass das Paar
  inzwischen ausgeliehen wurde, und aktualisiert die Auswahl. Keine automatische
  Ersatzausleihe. „Aktualisieren“ lädt Auswahl und Übersicht erneut.
- Leer-/Demostart und Speicherhinweise bleiben erhalten. Alle Daten gehen beim
  Neustart verloren; der Demostart enthält weiterhin keine Ausleihen.

## HTTP-Schnittstellen

JSON, `Cache-Control: no-store`, ohne zusätzliche Abhängigkeiten:

| Methode und Route | Verhalten |
| --- | --- |
| `GET /api/ski/verfuegbar` | Sortierte Liste verfügbarer Paare (`id`, `name`) |
| `GET /api/ausleihen` | Sortierte Ausleihen mit `id`, `personID`, `skiID`, aktuellen `personName`/`skiName`, `rentedAt`, `returnedAt` (null bei aktiver Ausleihe) |
| `POST /api/ausleihen` | JSON mit `personID` und `skiID`; 201 mit Location und Ausleihdatensatz |
| `GET /api/ausleihen/{id}` | Einzelne Ausleihe, 200 oder 404 |
| `PUT /api/ausleihen/{id}/rueckgabe` | Leerer Request-Body; beendet Ausleihe oder liefert bereits beendeten Datensatz mit 200 |

Schreibanfragen erlauben keine clientseitigen IDs oder Zeitpunkte. JSON-Requests
sind auf 64 KiB begrenzt. Fehler: 400 Pflichtfelder/fehlerhafter Request oder
unbekannte Felder, 404 unbekannte Person/Ski/Ausleihe, 409 bereits verliehenes Paar,
413 Requestlimit, 415 falscher Medientyp, 405 unzulässige Methode. Fehler enthalten
`errors` mit Feldnamen (`personID`, `skiID`, `form`). GET-Listen sind bei leerem
Bestand `[]`. Vergabe von ID und Zeit erfolgt erst nach erfolgreicher Prüfung.

## Aufgaben und Akzeptanzkriterien

1. Domainregeln für Pflichtreferenzen und Aktivstatus; atomare Storeoperationen
   für Anlegen, Rückgabe und konsistente Verfügbarkeitsabfragen.
2. API mit validierten Eingaben, klaren Fehlern und datensparsamen Antworten.
3. Formular, aktive Ausleihen und Verlauf in bestehendem Layout; direkter Einstieg
   aus der Personenverwaltung. Aktualisierung nach Ausleihe und Rückgabe.
4. Tests prüfen Referenzen, Mehrfachausleihen pro Person, Verfügbarkeit, Zeitpunkte,
   unveränderten Zustand bei Fehlern, Rückgabe-Wiederholung auch nach erneuter
   Ausleihe, eindeutige IDs, Lesekopien und gleichzeitige Zugriffe.
5. HTTP-Tests prüfen erfolgreichen Gesamtfluss, Fehlercodes, konkurrierende
   Ausleihversuche und Datenschutz; alle Phase-1-Tests bleiben erfolgreich.
6. Build, Standardtests, Race-Tests, Vet und Browserdurchläufe (Demo-/Normalstart,
   Ausleihe/Rückgabe, leere Auswahl, Fehler, Abbrechen, Desktop/Mobil).
7. README, Verfassung, Roadmap und Prüfnachweis aktualisieren. Technische Prüfung
   und Auftraggeberabnahme getrennt dokumentieren.

## Prüfnachweis – 21.10.2026

**Prüfergebnis: implementiert und geprüft; Auftraggeberabnahme am 21.10.2026 bestätigt.**
Prüfumgebung: macOS/arm64, Go 1.27.3, Apple Clang, Google Chrome 155.
Go-Toolchain: `/private/tmp/skirental-toolchain/go`;
Buildcache wegen der Sandbox: `/private/tmp/skirental-go-cache`.
Keine neuen Abhängigkeiten. Phase 1 bleibt unverändert abgenommen.

| Prüfung | Ergebnis |
| --- | --- |
| `go build ./...` | Bestanden |
| `go test ./...` | Bestanden einschließlich aller bisherigen Tests |
| `go test -race ./...` | Bestanden; keine Datenrennen |
| `go vet ./...` | Bestanden |
| `node --check web/assets/ausleihe.js` und `verwaltung.js` | Bestanden |
| Pflichtreferenzen, IDs, Zeitpunkte, unbekannte Datensätze, Konflikte ohne Zustandsänderung | Domain-/Store-/HTTP-Tests bestanden |
| Mehrere aktive Ausleihen pro Person, Umbenennung bei stabilen Referenzen | Store-/HTTP-Tests bestanden |
| Rückgabe, unveränderter Zeitpunkt bei Wiederholung, alte Rückgabe nach erneuter Ausleihe | Store-/HTTP-Tests bestanden |
| Lese-/Snapshot-/Verfügbarkeitskopien und frischer Store ohne Ausleihen | Store-Tests bestanden |
| Gleichzeitige Ausleihe desselben Paars | Store: 32 Versuche, genau 1 Erfolg; HTTP: 24 Versuche, genau 1 × 201 und 23 × 409 |
| Gleichzeitige Rückgabe derselben Ausleihe | 32 Versuche, ein einheitlicher Rückgabezeitpunkt |
| Parallele Ausleihen unterschiedlicher Paare | 24 unterschiedliche IDs ohne verlorene Ausleihen |
| Requestformat, unbekannte Felder/Zeitpunkte, Größenlimit, Methoden | HTTP-Tests bestanden (400/404/405/409/413/415) |
| Keine Ausweisnachweise in Ausleihantworten; no-store | HTTP-Tests bestanden |
| Demoablauf in Chrome | Zwei Paare für dieselbe Person ausgeliehen; keine Paare mehr verfügbar, Speichern deaktiviert |
| Rückgabe und Verlauf | In Chrome Desktop und mobil bedient; Paar aus aktiver Liste entfernt, Rückgabezeit im Verlauf |
| Pflichtfelder und Abbrechen | Leeres Formular zeigt Feldfehler; Abbrechen öffnet Übersicht ohne zusätzliche Ausleihe |
| Veraltete Auswahl in zwei Tabs | Erster erfolgreicher Versuch, zweiter Versuch verständlich abgelehnt; Ski-Auswahl aktualisiert und bei fehlendem Bestand Speichern deaktiviert |
| Normalstart und Neustart | In Chrome leere Personen-/Ski-Auswahl, keine alten Ausleihen, kein Demohinweis |
| Registrierung → Ausleihe | Synthetische Person registriert; „Ski ausleihen“ öffnet Formular mit richtiger Person vorausgewählt |
| Normalmodus mit neuem Bestand | Synthetisches Paar angelegt, im Formular gewählt und erfolgreich ausgeliehen |
| Desktop und 375 × 667 Pixel | Chrome-Sichtprüfung von Übersicht, Verlauf, Formularfeldern und Fehlerdarstellung; mobile Rückgabe bedient |

Screenshots: [Desktop](screenshots/02-ausleihe-desktop.png),
[mobil](screenshots/02-ausleihe-mobil.png). Es wurden ausschließlich synthetische
Daten verwendet. Die Screenshots zeigen den geprüften Demoablauf.

Die wiederholte Rückgabe und die echten gleichzeitigen HTTP-Anfragen wurden
**automatisiert** geprüft. Der Browserkonflikttest verwendete nacheinander zwei
bereits geladene Tabs. Diese Prüfungen sind getrennt von der unten dokumentierten
Auftraggeberabnahme dokumentiert.

## Auftraggeberabnahme – 21.10.2026

Der Auftraggeber hat Phase 2 im Projektgespräch ausdrücklich mit
„phase 2 ist hiermit abgenommen“ bestätigt. Die Abnahme erfolgte nach Bereitstellung
des Demostands, des technischen Prüfnachweises und der Abnahmeliste. Damit ist
Phase 2 abgeschlossen. Die folgende Liste bleibt als Abnahmeleitfaden erhalten;
einzelne manuelle Prüfschritte des Auftraggebers wurden nicht gesondert protokolliert.

## Abnahmeliste für den Auftraggeber

- [ ] Demo-Person und verfügbare Ski-Paare lassen sich auswählen.
- [ ] Ausleihe erscheint mit korrekter Person, Paar und Zeitpunkt in der Übersicht.
- [ ] Dasselbe Paar verschwindet aus der verfügbaren Auswahl.
- [ ] Dieselbe Person kann ein zweites unterschiedliches Paar ausleihen.
- [ ] Fehlende Auswahl zeigt verständliche Fehler; Abbrechen erzeugt keine Ausleihe.
- [ ] Zwei bereits geladene Tabs: Der zweite Ausleihversuch desselben Paars scheitert verständlich.
- [ ] Rückgabe verschiebt den Datensatz in den Verlauf und gibt das Paar frei.
- [ ] Das zurückgegebene Paar kann erneut ausgeliehen werden.
- [ ] Nach Personenregistrierung führt „Ski ausleihen“ zum vorausgefüllten Formular.
- [ ] Leerer Bestand erklärt die nächsten Schritte; Desktop und Mobilansicht sind bedienbar.

## Bekannte Grenzen

- Ausschließlich Arbeitsspeicher; Neustart verwirft Personen, Paare und Ausleihen.
- Keine Suche, Ausleihbearbeitung, Löschung, Reservierung oder Terminplanung.
- Das Dashboard zeigt weiterhin Platzhalter (Phase 3).
- Keine automatische Synchronisierung zwischen Tabs; „Aktualisieren“ lädt den
  aktuellen Stand. Nach Konflikten wird die Ski-Auswahl erneut geladen.
- Browserprüfung dieser Phase in Chrome; Safari wurde für Phase 2 nicht separat geprüft.
- Ohne Benutzerkonten ausschließlich lokal betreiben; nur synthetische Daten.
- Keine offenen Abweichungen von den hier beschriebenen Akzeptanzkriterien.
  Die ausdrückliche Auftraggeberabnahme ist oben dokumentiert; der lokale Commit
  sichert den abgenommenen Stand.
