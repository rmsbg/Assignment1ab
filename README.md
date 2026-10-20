# Skiverleih System

## SkiRental – lokaler Prototyp

Phase 0 und Phase 1 sind vom Auftraggeber abgenommen. Phase 1 umfasst:
Personen und Ski-Paare können angelegt, aufgelistet, einzeln angezeigt und
bearbeitet werden. Die Abnahme erfolgte am 20.10.2026. Phase 2 ist implementiert,
geprüft und am 21.10.2026 vom Auftraggeber abgenommen: Ausleihen und Rückgaben
sind möglich. Echte Dashboard-Kennzahlen folgen in Phase 3.

### Voraussetzungen und Start

Go **1.27.3 oder neuer**, für Race-Tests zusätzlich ein C-Compiler (unter macOS
die Xcode Command Line Tools). Es werden keine zusätzlichen Go-Pakete, keine
Datenbank und keine Frontend-Buildwerkzeuge benötigt.

Die zur Abnahme verwendete Toolchain ist Go 1.27.3 für macOS/arm64 aus den
[offiziellen Go-Downloads](https://go.dev/dl/). In dieser Arbeitsumgebung liegt
sie temporär unter `/private/tmp/skirental-toolchain/go`. Für die aktuelle
Shell kann sie so verfügbar gemacht werden:

```sh
export PATH="/private/tmp/skirental-toolchain/go/bin:$PATH"
```

Dieses temporäre Verzeichnis ist keine dauerhafte Installation. Für spätere
Entwicklung Go regulär installieren und mit `go version` prüfen.

Aus dem Repository-Hauptverzeichnis starten:

```sh
go run ./cmd/server
# Alternativ mit synthetischen Beispieldaten:
go run ./cmd/server -demo
```

Anschließend **http://127.0.0.1:8080** im Browser öffnen. Der Browser wird nicht
automatisch gestartet. Beenden mit `Ctrl+C`. Ist Port 8080 belegt, zuerst den
anderen Dienst beenden. Der Server bindet ausschließlich an die lokale
Loopback-Adresse; es gibt noch keine Benutzerkonten.

### Startzustand und Grenzen

- Normalmodus: leerer Store.
- Demomodus: zwei Ski-Paare und eine synthetische Person mit manuellem
  Ausweisnachweis, ohne Ausleihen oder Ausweisfoto. Die Verwaltung listet die
  Demodaten auf; der Modus wird sichtbar angezeigt.
- Alle Änderungen gehen beim Neustart verloren. Danach entsteht erneut der
  gewählte leere oder Demo-Startzustand.
- Kennzahlen sind ausdrücklich Platzhalter (`—`), keine aktuellen Bestandswerte.
- Nur synthetische Kundendaten verwenden; kein produktiver Betrieb.

### Entwicklung und Prüfung

```sh
go build ./...
go test ./...
go test -race ./...
go vet ./...
go fmt ./...
```

`cmd/server/` enthält den Einstieg, `internal/domain/` das Datenmodell,
`internal/store/` den Speicher, `internal/handler/` die HTTP-Oberfläche und
`web/` die eingebetteten HTML-/CSS-/JavaScript-Dateien. Tests liegen neben dem Go-Code.
Nach Änderungen an eingebetteten Dateien den Server neu starten.

Die Verfassung liegt unter `specs/`; Details und Prüfnachweis zu Phase 0 stehen
in [specs/00-projektgeruest.md](specs/00-projektgeruest.md); Phase 1 ist in
[specs/01-verwaltung.md](specs/01-verwaltung.md) beschrieben. Phase 2 steht in
[specs/02-ausleihe.md](specs/02-ausleihe.md).

### Verwaltung bedienen

Unter **Ski verwalten** beziehungsweise **Personen verwalten** einen Eintrag
anlegen oder über die Liste öffnen. In der Detailansicht führt „Bearbeiten“ zum
Formular. IDs entstehen automatisch und bleiben unverändert; gleiche Namen sind
erlaubt. „Abbrechen“ verwirft Eingaben, „Speichern“ zeigt eine Bestätigung.

Personen benötigen Name und Ausweisnachweis: entweder eine Ausweisnummer mit
Ausweisart (bei „Sonstiger Ausweis“ zusätzlich Bezeichnung) oder ein JPEG-/PNG-Foto
bis 5 MiB und 20 Millionen Pixel. Die Personenliste enthält nur ID und Name;
der vollständige Nachweis erscheint gezielt in der Detailansicht. Bei Änderungen
kann der Nachweis beibehalten oder ersetzt werden. Fehlerhafte Eingaben ändern
keine gespeicherten Daten. Die Verwaltung benötigt JavaScript.

Die API verwendet JSON für Lesezugriffe und Ski-Schreibzugriffe. Personen werden
mit Multipart-Formularen einschließlich Foto atomar gespeichert. Endpunkte,
Feldnamen und Fehlercodes stehen in der Phase-1-Spezifikation. Foto-Inhalte werden
weder auf Datenträger geschrieben noch protokolliert. Es gibt weiterhin keine
Suche, Löschfunktion oder dauerhafte Speicherung.

### Ausleihe und Rückgabe bedienen

Unter **Neue Ausleihe** eine Person und ein verfügbares Ski-Paar auswählen und
„Ausleihe speichern“ drücken. Aus dem Personendetail (auch unmittelbar nach einer
Registrierung) führt **Ski ausleihen** zum Formular mit vorausgewählter Person.
Eine Person darf mehrere unterschiedliche Paare ausleihen. IDs und Zeitpunkte
vergibt der Server; dasselbe Paar kann nur einmal gleichzeitig verliehen sein.

Unter dem Formular stehen **Aktive Ausleihen** mit **Rückgabe erfassen** und
**Abgeschlossene Ausleihen** mit Rückgabezeitpunkt. Rückgabe macht das Paar wieder
verfügbar. Eine wiederholte Rückgabe verändert weder den Zeitpunkt noch eine
spätere Ausleihe desselben Paars. Namen in der Übersicht entsprechen den aktuellen
Stammdaten; die Zuordnung bleibt über IDs erhalten.

**Abbrechen** öffnet die Übersicht und verwirft die Auswahl. **Aktualisieren**
lädt die Daten neu. Wenn ein anderer Mitarbeiter das ausgewählte Paar inzwischen
verliehen hat, erscheint ein verständlicher Fehler und die Ski-Auswahl wird
aktualisiert. Bei fehlenden Personen oder Paaren helfen Links zur Verwaltung.
Die Oberfläche benötigt JavaScript; es gibt keine automatische Synchronisierung
zwischen mehreren Browser-Tabs. Ausweisnachweise werden hier nicht angezeigt.

## Ursprüngliche Produktideen

Der Auftraggeber wünscht sich ein Skiverleihsystem.

## Wünsche:
- as System soll einfach, übersichtlich und leicht bedienbar sein.
- Benutzerfreundlichkeit steht im Vordergrund
- Benutzer sind zunächst Mitarbeiter des Skiverleihs

## erste Funktionen:

### Ausleihe:

- Mitarbeiter legt eine neue Person an:
  - ID (soll automatisch generiert werden)
  - Name
  - Scan (=Foto des Ausweises), alternativ menuelle Eingabe einer Ausweisnummer (bei manueller Eingabe Auswahl der Ausweisart über ein Dropdownmenü)
- Skiverleih: dem neuen Kunden wird im System ein gerade verfügbarer Ski zugewiesen

### Dashboard: auf der Startseite soll ein Dashboard mit folgenden Informationen sichtbar sein:
- Verfügbare Ski
- Ausgeliehene Ski
- Gesamtbestand Ski
- Registrierte Personen

- unter diesen Informationen Schnellzugriff zu:
  - Ski verwalten
  - Personen verwalten
  - Neue Ausleihe
