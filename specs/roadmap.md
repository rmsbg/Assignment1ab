# SkiRental – SDD-Roadmap

## Vorgehen und aktueller Stand

Phase 0 ist vom Auftraggeber abgenommen; siehe dessen Bestätigung, auf die der
Phase-1-Implementierungsauftrag vom 20.10.2026 verweist. Phase 1 ist implementiert,
geprüft und am 20.10.2026 ausdrücklich vom Auftraggeber abgenommen. Phase 2 ist implementiert, geprüft
und am 21.10.2026 ausdrücklich vom Auftraggeber abgenommen. Phase 3 ist implementiert, geprüft
und am 21.10.2026 ausdrücklich vom Auftraggeber abgenommen. Phase 4 ist offen. Details und
Prüfnachweise stehen in [00-projektgeruest.md](00-projektgeruest.md),
[01-verwaltung.md](01-verwaltung.md), [02-ausleihe.md](02-ausleihe.md) und
[03-dashboard.md](03-dashboard.md). Diese Roadmap
ordnet Arbeit nach Abhängigkeiten; sie enthält keine zugesagten Termine.

Für jede Phase gilt: **Spezifizieren → Aufgaben ableiten → Implementieren →
Prüfen → Abnehmen**. Vor dem Code entsteht eine Feature-Spezifikation unter
`specs/`, für Phase 1 `specs/01-verwaltung.md`, mit Nutzerablauf, Daten,
Geschäftsregeln, API-Verhalten, Fehlerfällen und überprüfbaren Akzeptanzkriterien.
Die drei Verfassungsdateien bleiben die gemeinsame Grundlage.

Ab sofort folgt auf jede ausdrücklich bestätigte Auftraggeberabnahme ein lokaler
Git-Commit mit verständlicher Benennung von Phase und Ergebnis. Vor dem Commit
werden Abnahmestatus und Prüfnachweis aktualisiert. Phase 1 ist mit
`98354ce` (`Phase 1: Personen- und Skiverwaltung abschließen`) gesichert, Phase 2
mit `237dc0a` (`Phase 2: Ausleihe und Rückgabe abschließen`).

## Phase 0 – Fachliche Entscheidungen und Projektgerüst

**Ergebnis:** Startfähiges Go-Projekt mit ausgelieferter Browseroberfläche,
In-Memory-Store, navigierbarem Grundgerüst und dokumentiertem lokalen Start.

**Beschlossene fachliche Grundlagen:** Ein Inventareintrag entspricht einem Paar
Ski. Die manuelle Ausweiserfassung bietet Personalausweis, Reisepass, Führerschein
und „Sonstiger Ausweis“ mit zusätzlicher Pflichtbezeichnung an; eine Ausweisnummer
ist jeweils erforderlich. Alternativ ist ein JPEG-/PNG-Foto bis 5 MiB
(5.242.880 Byte) zulässig. Diese Regeln sind in Mission und technischer Verfassung
festgehalten und werden in den jeweiligen Feature-Spezifikationen konkretisiert.

**Toolchain:** Für die Abnahme wurde Go 1.27.3 temporär eingerichtet. Version und
PATH-Einrichtung sind in `go.mod`, technischer Verfassung und README dokumentiert.
Für spätere Entwicklung ist eine dauerhafte Go-Installation vorgesehen.

**Abnahme:**
- `go run ./cmd/server` stellt die Anwendung unter `http://127.0.0.1:8080` mit
  leerem Store bereit.
- `go run ./cmd/server -demo` lädt reproduzierbar zwei bezeichnete Ski-Paare
  und eine synthetische Person mit manuellem Ausweisnachweis, ohne aktive
  Ausleihe oder Ausweisfoto. Die Initialisierung erzeugt keine Duplikate.
- Dashboard, Ski verwalten, Personen verwalten und Neue Ausleihe sind als
  Platzhalteransichten erreichbar. Ausstehende Kennzahlen erscheinen nicht als
  Nullwerte. Navigation und Hinweise werden im Browser geprüft.
- Die Oberfläche erklärt den Datenverlust beim Neustart und kennzeichnet den
  Demomodus. Ein Neustart verwirft Änderungen und stellt den gewählten
  Startzustand wieder her.
- `go build ./...` und `go test ./...` bestehen. Tests prüfen den leeren und den
  Demo-Startzustand; nebenläufige Store-Zugriffe werden zusätzlich mit
  `go test -race ./...` geprüft.
- Die README dokumentiert Voraussetzungen, Startbefehle, Demomodus und Grenzen.

Formulare, Upload-Verarbeitung, fachliche Verwaltungsoperationen, Ausleihen und
echte Dashboard-Kennzahlen sind nicht Teil von Phase 0. Sie folgen in den
nachstehenden Phasen.

## Phase 1 – Personen und Ski verwalten

**Status:** Implementiert, geprüft und vom Auftraggeber am 20.10.2026 abgenommen.
Bestätigung im Projektgespräch: „phase 1 ist hiermit abgenommen“.
Spezifikation, Schnittstellen und Prüfnachweis: [01-verwaltung.md](01-verwaltung.md).

**Ergebnis:** Personen und Ski können angelegt, angezeigt und bearbeitet werden
(M-01 und Verwaltungsgrundlage für M-04).

**Abnahme:**
- Neue Personen erhalten automatisch unterschiedliche IDs.
- Ein Name sowie entweder ein gültiges Foto oder Ausweisnummer und Ausweisart
  sind erforderlich; ungültige Eingaben verändern den Zustand nicht.
- Ski erhalten eindeutige IDs und verständliche Inventarbezeichnungen.
- Ausweisnachweise werden in Übersichten nicht offengelegt.

## Phase 2 – Ausleihe und Rückgabe

**Status:** Implementiert, geprüft und vom Auftraggeber am 21.10.2026 abgenommen.
Bestätigung im Projektgespräch: „phase 2 ist hiermit abgenommen“.
Spezifikation, Schnittstellen und Prüfnachweis: [02-ausleihe.md](02-ausleihe.md).

**Ergebnis:** Eine registrierte Person erhält einen verfügbaren Ski; die Rückgabe
beendet die Ausleihe (M-02 und ergänzende MVP-Regeln).

**Abnahme:**
- Nach einer Personenregistrierung ist die neue Ausleihe direkt erreichbar.
- Ausleihen referenzieren ausschließlich vorhandene Personen und Ski.
- Ein ausgeliehener Ski kann nicht erneut ausgeliehen werden. Bei zwei
  gleichzeitigen Ausleihversuchen für denselben Ski gelingt genau einer.
- Eine Rückgabe stellt die Verfügbarkeit wieder her. Eine erneute Rückgabe
  ändert den Bestand nicht.
- Fachlogik und HTTP-Fehlerfälle sind automatisiert geprüft; der Store besteht
  die relevanten Tests mit `go test -race ./...`.

## Phase 3 – Dashboard und durchgängige Bedienung

**Status:** Implementiert, geprüft und vom Auftraggeber am 21.10.2026 abgenommen.
Bestätigung im Projektgespräch: „phase 3 abgenommen“.
Spezifikation, Schnittstellen und Prüfnachweis: [03-dashboard.md](03-dashboard.md).

**Ergebnis:** Die Startseite zeigt die vier Kennzahlen und die drei
Schnellzugriffe aus M-03 und M-04.

**Abnahme:**
- Verfügbare Ski plus ausgeliehene Ski ergeben den Gesamtbestand.
- Registrierung, Ausleihe und Rückgabe aktualisieren die betroffenen Kennzahlen
  ohne manuellen Seitenneustart.
- Alle Schnellzugriffe führen zur passenden Ansicht. Leere Listen,
  fehlende verfügbare Ski und Eingabefehler werden verständlich dargestellt.
- Formulare besitzen sichtbare Beschriftungen und sind per Tastatur bedienbar.

## Phase 4 – MVP-Abnahme und Dokumentation

**Ergebnis:** Ein vorführbarer Prototyp mit reproduzierbarem Start und
nachvollziehbarem Prüfnachweis.

**Abnahme:** Mit synthetischen Daten wird im Browser ein vollständiger Ablauf
geprüft: Ski anlegen, Person registrieren, Ski ausleihen, Dashboard prüfen,
Ski zurücknehmen und Dashboard erneut prüfen. Beide Ausweisvarianten werden
erprobt. Build, Tests und Race-Prüfung bestehen. Die README dokumentiert Setup,
Start, Prüfkommandos und bekannte Grenzen. Offene Abweichungen werden ausdrücklich
festgehalten; ein Akzeptanzkriterium gilt erst mit Prüfnachweis als erfüllt.

## Spätere Erweiterungen

Dauerhafte Speicherung, Benutzerkonten, Reservierungen, Preise und Zahlungen
sowie ein Kundenportal benötigen eine eigene Priorisierung und Spezifikation.
Sie werden erst nach einer bewussten Erweiterung der Mission eingeplant.
