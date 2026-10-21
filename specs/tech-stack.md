# SkiRental – Technische Verfassung

## Technische Basis

| Bereich | Entscheidung | Begründung |
| --- | --- | --- |
| Backend | Go mit Standardbibliothek, HTTP über `net/http` | Kleine, verständliche Anwendung ohne Frameworkpflicht |
| Frontend | HTML, CSS und JavaScript ohne Framework | Direkter Browserzugriff und geringer Einrichtungsaufwand |
| Kommunikation | HTTP-API: JSON beim Lesen, für Ski und Ausleihen; Multipart für Personen | Stammdaten und Foto gemeinsam atomar validieren und speichern |
| Speicherung | In-Memory-Store mit Mutex | Entspricht dem Prototypumfang; keine Datenbank oder ORM |
| Tests | Go-Paket `testing`, HTTP-Tests mit `net/http/httptest` | Geschäftsregeln und API-Verhalten überprüfbar machen |
| Versionierung | Git; GitHub bei Bedarf | Nachvollziehbare Änderungen an Spezifikation und Code |

HTML/JavaScript wird als die im Template erlaubte Frontend-Variante gewählt.
Flutter ist nicht Teil dieses Entwurfs. Die Go-Version ist mit **1.27.3** in
`go.mod` und der README festgehalten. Zusätzliche Abhängigkeiten
erfordern vorherige Rückfrage gemäß Repository-Regeln.

Für die Phase-0-Abnahme wurde die offizielle Go-1.27.3-Toolchain für macOS/arm64
unter `/private/tmp/skirental-toolchain/go` eingerichtet und die SHA-256-Prüfsumme
gegen die [offiziellen Download-Metadaten](https://go.dev/dl/?mode=json) geprüft.
Sie ist temporär; die README beschreibt die PATH-Einrichtung und den Bedarf
einer dauerhaften Installation für spätere Entwicklung.

## Projektstruktur

Die Phasen 0 bis 4 verwenden die folgende Struktur:

```text
cmd/server/         Einstieg, Konfiguration und HTTP-Server
internal/domain/    Person, Ski, Ausleihe und Geschäftsregeln
internal/store/     Nebenläufigkeitssicherer In-Memory-Zustand
internal/handler/   HTTP-Eingaben, Validierung und Antworten
web/                HTML, CSS, JavaScript und statische Assets
specs/              Verfassung und spätere Feature-Spezifikationen
testdata/           Ausschließlich synthetische Foto-Prüfdaten
```

Tests liegen als `*_test.go` neben dem jeweiligen Go-Code. Der Go-Server liefert
auch das Frontend aus; ein separater Entwicklungsserver ist nicht erforderlich.
HTTP-Handler greifen über Geschäftsoperationen auf den Zustand zu. Das Frontend
kommuniziert ausschließlich über die API.

## Lokaler Start und Demomodus

Der Server ist unter `http://127.0.0.1:8080` erreichbar. Der normale Start erzeugt
einen leeren Store. Mit dem Startparameter `-demo` werden reproduzierbar zwei
bezeichnete Ski-Paare und eine synthetische Person mit manuellem Ausweisnachweis
angelegt; aktive Ausleihen und Ausweisfotos sind nicht enthalten. Die Initialisierung
erzeugt keine Duplikate. Nach einem Neustart werden vorherige Änderungen verworfen
und der gewählte Startzustand wiederhergestellt.

Vier Ansichten bieten Dashboard, Ski verwalten, Personen verwalten und Neue
Ausleihe. Phase 1 implementiert Anlegen, Listen, Details und Bearbeiten für Ski
und Personen. Phase 2 ergänzt Ausleihe, Rückgabe und Verlauf; Phase 3 ergänzt
konsistente Dashboard-Kennzahlen mit automatischer Aktualisierung. Speicherhinweise
und Demokennzeichnung sind auf allen Seiten sichtbar. Die Verwaltung liegt in
`web/assets/verwaltung.js`, Ausleihen in `web/assets/ausleihe.js`; Details und
Formulare werden im Browser aufgebaut. `web/assets/dashboard.js` aktualisiert
die vom Server bereits gerenderten Kennzahlen.

HTML, CSS und JavaScript sind mit `go:embed` in der ausführbaren Datei enthalten.
Ein mit `go build -o bin/skirental ./cmd/server` erzeugter Build benötigt beim
Start kein Repository und keinen Zugriff auf dessen Asset-Dateien. Phase 4 hat
den Start aus einem anderen Arbeitsverzeichnis in beiden Modi geprüft.

## MVP-Gesamtprüfung (Phase 4)

`TestMVPAcceptanceWorkflow` prüft den Gesamtfluss über die öffentliche
HTTP-Schnittstelle in sechs unabhängigen Varianten: Normal-/Demomodus jeweils
mit manuellem Nachweis, PNG und JPEG. Die PNG-Testdatei unter `testdata/` ist
synthetisch; JPEG entsteht daraus nur während des Tests im Arbeitsspeicher.
Registrierung, Dashboard, Ausleihe, Konflikt, Rückgabe, Wiederholung und erneute
Ausleihe werden zusammen geprüft. Die vorhandenen Fach-, HTTP- und Race-Tests
bleiben Teil der Prüfung. Neue Abhängigkeiten sind nicht hinzugekommen.

Der Browserprüfumfang und die bekannten Grenzen stehen im
[Phase-4-Prüfnachweis](04-mvp-abnahme.md). Technischer Abschluss und ausdrückliche
Auftraggeberabnahme werden getrennt dokumentiert.

## Verwaltungs-API (Phase 1)

`GET/POST /api/ski` und `GET/PUT /api/ski/{id}` verwenden JSON.
`GET /api/personen` liefert ausschließlich ID und Name; `GET /api/personen/{id}`
liefert den vollständigen Nachweis als manuelle Felder oder Foto-URL.
`GET /api/personen/{id}/foto` liefert das geprüfte Bild. Personen-Schreibzugriffe
(`POST /api/personen`, `PUT /api/personen/{id}`) verwenden **Multipart**, damit Name
und Nachweis zusammen validiert und atomar gespeichert werden. Dies präzisiert
den früher vorgesehenen separaten Foto-Upload. `proof=keep` erhält bei Änderungen
den bisherigen Nachweis; `manual` und `photo` ersetzen ihn vollständig.

Details zu Feldern und Fehlercodes: [01-verwaltung.md](01-verwaltung.md).
Multipart wird begrenzt und ohne temporäre Dateien eingelesen. Die tatsächliche
Bildgröße ist auf 5 MiB, die Dekodierung auf 20 Millionen Pixel begrenzt. JPEG/PNG,
MIME-Deklaration und Dekodierbarkeit werden geprüft. Alle Antworten verwenden
`Cache-Control: no-store` und `X-Content-Type-Options: nosniff`.

## Ausleih-API (Phase 2)

`GET/POST /api/ausleihen` listet Ausleihen beziehungsweise legt eine mit
`personID` und `skiID` an. `GET /api/ausleihen/{id}` liefert Details;
`PUT /api/ausleihen/{id}/rueckgabe` akzeptiert einen leeren Body und erfasst die
Rückgabe idempotent. `GET /api/ski/verfuegbar` liefert verfügbare Paare.
Listen und Details enthalten Namen/IDs und UTC-Zeitpunkte, keine Ausweisnachweise.
`returnedAt: null` kennzeichnet aktive Ausleihen; die Oberfläche formatiert
Zeitpunkte in der lokalen Browserzeitzone.

Der Store prüft Referenzen und Verfügbarkeit unter derselben Schreibsperre wie
die Anlage. Rückgaben betreffen ausschließlich die jeweilige Ausleih-ID.
Mehrere Ausleihen pro Person sind zulässig. Verfügbarkeit und Namenszuordnung
werden jeweils unter einer Lesesperre ermittelt; Ergebniswerte sind unabhängige
Kopien. Unbekannte Referenzen liefern 404, belegte Paare 409. Request-Felder und
Zeitpunkte sind strikt begrenzt; JSON-Requests maximal 64 KiB. Auswahl und Liste
werden nach erfolgreichen Aktionen neu geladen, veraltete Ski-Auswahl nach einem
Konflikt einschließlich Ausleihübersicht aktualisiert. Andere Tabs verwenden „Aktualisieren“; kein Push-Mechanismus.
Details und Fehlercodes: [02-ausleihe.md](02-ausleihe.md).

## Dashboard (Phase 3)

`GET /api/dashboard` liefert ausschließlich vier Ganzzahlen: `availableSkis`,
`rentedSkis`, `totalSkis`, `registeredPeople`. Der Store berechnet sie gemeinsam
unter einer Lesesperre aus Ski, Personen und unterschiedlichen aktiv verliehenen
Ski-IDs. Keine Personen- oder Bilddaten werden dafür kopiert oder ausgeliefert.
HEAD liefert dieselben Schutz-/Typheader ohne Antwortbody; andere Methoden 405.

SSR liefert beim Öffnen gültige Zahlen. Das Frontend fragt unmittelbar, alle
5 Sekunden nach der letzten abgeschlossenen Anfrage und bei Tab-/Fensterrückkehr
neu ab. Jeweils nur eine Anfrage, Timeout 5 Sekunden, Pause in verborgenen Tabs.
`pagehide` bricht ab; `pageshow` startet auch nach Browsercache-Rückkehr neu.
Antworten werden vor der Anzeige auf Ganzzahlen, Nichtnegativität und konsistente
Summe geprüft. Bei Fehlern bleiben letzte Werte mit Veraltet-Hinweis erhalten;
Intervall und manueller Button ermöglichen Erholung. Ohne JavaScript gilt der
SSR-Stand. Das Dashboard verwendet ebenso `no-store` und `nosniff`.
Details: [03-dashboard.md](03-dashboard.md).

## Daten und Konsistenz

- **Person:** automatisch erzeugte, innerhalb des laufenden Systems eindeutige
  ID, Name und Ausweisnachweis gemäß Mission. Bei manueller Erfassung sind
  Ausweisnummer und eine der vier festgelegten Ausweisarten erforderlich; für
  „Sonstiger Ausweis“ zusätzlich eine nach Entfernen von Leerraum nicht leere
  Bezeichnung.
- **Ski:** ein Paar mit eindeutiger ID und verständlicher Inventarbezeichnung.
  Verfügbarkeit und Dashboard-Zahlen beziehen sich auf Paare.
- **Ausleihe:** eindeutige ID, Personen-ID, Ski-ID, Ausleihzeitpunkt und optionaler
  Rückgabezeitpunkt. Ohne Rückgabezeitpunkt ist sie aktiv.
- Verfügbarkeit wird aus aktiven Ausleihen abgeleitet. Prüfung und Anlage einer
  Ausleihe erfolgen gemeinsam unter einer Sperre. Rückgaben werden ebenso atomar
  verarbeitet; wiederholte Rückgaben erzeugen keine weitere Bestandsänderung.
- Dashboard-Zahlen werden aus einem konsistenten Zustand berechnet. Name und
  manueller Ausweisnachweis dürfen nach Entfernen von Leerraum nicht leer sein.
- Änderungen und ID-Vergabe erfolgen unter einer Schreibsperre. Leseoperationen
  und Schreibantworten liefern unabhängige Bildkopien. Doppelte Namen sind erlaubt.
- Maps und Foto-Inhalte bleiben ausschließlich im Arbeitsspeicher. Neustarts
  verwerfen sämtliche Daten; die Oberfläche weist darauf hin.

## Fehlerbehandlung und Datenschutz

Das Backend prüft alle Eingaben unabhängig von Formularprüfungen. Die API
unterscheidet ungültige Eingaben, fehlende Datensätze und Ausleihkonflikte mit
passenden HTTP-Statuscodes. Technische Fehler werden mit Kontext und `%w`
weitergegeben; Nutzern werden verständliche Meldungen angezeigt.

Pro Person wird alternativ zur manuellen Ausweiserfassung ein JPEG- oder PNG-Foto
mit höchstens 5 MiB (5.242.880 Byte) akzeptiert. Das Backend prüft die tatsächliche
Dateigröße und den Bildinhalt; Dateiname und übermittelter Content-Type allein
reichen nicht zur Formatprüfung. Ungültige oder zu große Dateien werden abgelehnt.
Ausweisdaten erscheinen weder in Logs noch
in Dashboard- oder Listenansichten. Secrets und reale Ausweisdaten gehören nicht
ins Repository. Ohne Authentifizierung wird der Server standardmäßig nur an
Loopback gebunden; externer oder produktiver Betrieb benötigt eine eigene
Sicherheits- und Datenschutzspezifikation.

## Entwicklungs- und Qualitätsregeln

Structs und Methoden bilden das Domänenmodell ab. Interfaces werden nur bei
konkretem Bedarf eingeführt; kein Dependency-Injection-Framework. Go-Code wird
mit `go fmt ./...` formatiert. Generierte Dateien werden nicht manuell bearbeitet.

Mit eingerichteter Go-Toolchain gelten vom Repository-Hauptverzeichnis aus:

```sh
go run ./cmd/server       # Anwendung starten
go run ./cmd/server -demo # Mit synthetischen Beispieldaten starten
go build ./...           # Alle Pakete kompilieren
go test ./...            # Fachlogik und HTTP-Verhalten prüfen
go test -race ./...      # Nebenläufige Zugriffe prüfen
go vet ./...             # Statische Prüfung
go fmt ./...             # Go-Code formatieren
```

Für neue Funktionen müssen Akzeptanzkriterien und relevante Fehlerfälle geprüft
sein. Eine feste Coverage-Quote ist nicht vorgesehen. UI-Abläufe werden im Browser
überprüft; `golangci-lint` ist erst bei expliziter Einrichtung erforderlich.

## Erweiterung Phase 5 – Buchungen und Tarife

Die bisherigen Abschnitte beschreiben den abgenommenen MVP. Für Phase 5 werden
Ausleihen um Buchungsdaten, Preis in ganzen Cent, Tarifversion, Erstellungs- und
Stornierungszeitpunkt ergänzt. Ausgabe/Rückgabe bleiben serverseitige UTC-Ereignisse;
eine Buchung ohne Ausgabe zählt nicht als ausgeliehen. Kalenderdaten verwenden
YYYY-MM-DD und das Geschäftsdatum Europe/Vienna (eingebettete Go-Zeitzonendaten).
Tagesdifferenzen werden im UTC-Kalender berechnet, unabhängig von Zeitumstellungen.

Tarif-Lesezugriffe liefern Kopien. Tarifänderungen verwenden Versionsprüfung;
Buchungen prüfen Tarifversion, Referenzen und Terminüberschneidungen atomar unter
der Store-Sperre. Preise verwenden int64 mit Überlaufprüfung und sind auf den
exakt durch JavaScript darstellbaren Ganzzahlbereich begrenzt. Frontend-Vorschauen
werden vom Backend berechnet und nach Tarifkonflikten erneut bestätigt.

Neue Tarifansicht und API sowie Ausgabe-/Stornierungsaktionen ergänzen die
bestehende Architektur ohne Abhängigkeiten. Der neue Buchungs-Request benötigt
beide Kalenderdaten und Tarifversion; bisherige Clients müssen angepasst werden.
Da nur flüchtige Daten existieren, gibt es keine Datenmigration. Bestehende
Prüfszenarien werden auf Buchung plus Ausgabe umgestellt.
Verbindliche Schnittstellen und Fehlerfälle: [05-termine-preise.md](05-termine-preise.md).
