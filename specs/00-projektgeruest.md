# Phase 0 – Projektgerüst

## Ziel und Umfang

Ein lokaler Go-Server liefert vier deutschsprachige, navigierbare Ansichten aus.
Ein In-Memory-Store stellt den leeren oder synthetischen Startzustand bereit.
Personenverwaltung, Uploads, Ausleihen und echte Kennzahlen sind Folgephasen.

## Start und Datenfluss

- `go run ./cmd/server` bindet ausschließlich `127.0.0.1:8080` und erzeugt einen
  leeren Store. `-demo` lädt zwei Ski-Paare und eine synthetische Person.
- Die Demo-Person heißt „Demo Person“, verwendet die Ausweisart „Sonstiger
  Ausweis“, die Bezeichnung „Demoausweis“ und die Nummer `DEMO-0001`.
  Die Ski-Paare heißen „Demo Ski-Paar 01“ und „Demo Ski-Paar 02“.
- Demo-IDs sind stabil; wiederholtes Laden erzeugt keine Duplikate. Es gibt
  keine aktiven Ausleihen oder Ausweisfotos. Ein neuer Store übernimmt keine
  Änderungen eines alten Stores.
- Maps sind privat und per Mutex geschützt. Lesezugriffe liefern sortierte
  Kopien statt veränderbarer Referenzen auf internen Zustand.
- Der Server liefert HTML und CSS aus eingebetteten Dateien. Die Ansichten
  benötigen keine Frontend-Buildwerkzeuge oder externen Ressourcen. Das Backend
  übergibt lediglich den Demomodus an die Oberfläche; personenbezogene Daten
  und Bestandszahlen werden in Phase 0 nicht ausgeliefert.

## Oberfläche und HTTP-Verhalten

| Route | Ansicht | Inhalt |
| --- | --- | --- |
| `/` | Dashboard | Vier Kennzahl-Platzhalter und drei Schnellzugriffe |
| `/ski` | Ski verwalten | Hinweis auf die spätere Verwaltung von Ski-Paaren |
| `/personen` | Personen verwalten | Hinweis auf die spätere Registrierung und Verwaltung |
| `/ausleihe` | Neue Ausleihe | Hinweis auf die spätere Ausleihe und Rückgabe |

Jede Ansicht enthält die vollständige Navigation, kennzeichnet die aktuelle
Seite und erklärt den Datenverlust beim Neustart. Der Demomodus ist zusätzlich
sichtbar markiert. Ausstehende Zahlen erscheinen als „—“ mit erläuterndem Text.
Es gibt keine funktionslosen Formular- oder Aktionsbuttons.

Unbekannte Routen liefern 404; nicht unterstützte HTTP-Methoden 405.
Fehlgeschlagener Serverstart wird mit Fehlerstatus beendet. Beim Beenden über
SIGINT/SIGTERM wird der Server geordnet heruntergefahren. Der Browser wird nicht
automatisch geöffnet.

## Abnahmekriterien

- Build, Standardtests und Race-Tests bestehen ohne zusätzliche Go-Abhängigkeiten.
- Store-Tests prüfen leeren Start, exakte Demodaten, wiederholte und parallele
  Initialisierung, isolierte Lesekopien und einen frischen Zustand nach Neustart.
- HTTP-Tests prüfen alle Ansichten in beiden Modi, Navigation, Modus- und
  Speicherhinweise, Platzhalter, statische Assets sowie 404/405.
- Ein Browserdurchlauf prüft Navigation, sichtbare Hinweise und das Layout auf
  Desktop und einem schmalen Bildschirm. Beide Startmodi werden geprüft.
- README und Prüfnachweis dokumentieren Toolchain, Befehle und bekannte Grenzen.

## Prüfnachweis – 20.10.2026

Phase 0 ist implementiert und vom Auftraggeber abgenommen. Grundlage ist die
Bestätigung des Auftraggebers, auf die der freigegebene Phase-1-Implementierungsplan
ausdrücklich verweist (Implementierungsauftrag vom 20.10.2026). Diese fachliche
Abnahme ist getrennt von den folgenden technischen Prüfungen dokumentiert.
Prüfumgebung: macOS/arm64, Go 1.27.3
aus `/private/tmp/skirental-toolchain/go`, Apple Clang und Safari.

| Prüfung | Ergebnis |
| --- | --- |
| `go build ./...` | Erfolgreich |
| `go test ./...` | Erfolgreich; Store- und HTTP-Tests bestanden |
| `go test -race ./...` | Erfolgreich; keine Datenrennen gemeldet |
| Leerer und Demo-Store, Wiederholung, Lesekopien, frischer Store | Automatisiert bestanden |
| Paralleles Demo-Laden und Lesen | 24 parallele Abläufe mit je 100 Wiederholungen bestanden |
| Vier Ansichten in beiden Modi, 404/405, HEAD und CSS | Automatisiert bestanden |
| Keine Ausweisdaten in ausgelieferten Ansichten | Automatisiert bestanden |
| Lokaler Demo- und Normalstart | In Safari geprüft; Kennzeichnung jeweils korrekt |
| Navigation zwischen allen vier Ansichten und zurück | In Safari geprüft |
| Desktop und 390 × 844 Pixel | Sichtprüfung in Safari und Responsive-Design-Modus bestanden |

Die Prüfung des Datenverlusts erfolgt am Store: Ein veränderter Store beeinflusst
keine neue Instanz. Fachliche Änderungen sind über die Oberfläche erst in späteren
Phasen möglich. In Phase 0 gibt es bewusst noch keine fachlichen API-Endpunkte,
Formulare oder echten Bestandskennzahlen. Es bestehen keine offenen Abweichungen
von den Phase-0-Akzeptanzkriterien.
