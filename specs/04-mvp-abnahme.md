# Phase 4 – MVP-Abnahme und Dokumentation

## Spezifikation und Umfang

Vor Beginn der Abschlussarbeiten erstellt, 21.10.2026. Phasen 0 bis 3 sind vom
Auftraggeber abgenommen. Diese Phase konsolidiert den vorführbaren MVP und seinen
Prüfnachweis. Sie führt keine neuen Produktfunktionen oder Abhängigkeiten ein.
Gefundene Fehler innerhalb des bestehenden Umfangs werden behoben und geprüft.
Die abschließende Auftraggeberabnahme bleibt ein eigener Schritt; erst danach
folgt der vereinbarte lokale Git-Commit.

## Prüfablauf und erwartete Ergebnisse

Im frischen Normalmodus beginnt das Dashboard mit 0/0/0/0 (verfügbar, ausgeliehen,
gesamt, Personen). Der folgende Ablauf wird mit ausschließlich synthetischen Daten
für beide Nachweisarten durchgeführt:

1. Ski-Paar anlegen: automatisch erzeugte ID; Dashboard 1/0/1/0.
2. Person mit manuellem Nachweis registrieren: ID, vollständiger Nachweis nur im
   Detail; Dashboard 1/0/1/1. „Ski ausleihen“ übernimmt die Person.
3. Das eigene Paar ausleihen: Dashboard 0/1/1/1, aktive Ausleihe mit korrekter
   Person und Paar; ein zweiter Versuch darf nicht erfolgreich sein.
4. Rückgabe erfassen: Dashboard 1/0/1/1; Ausleihe steht mit Rückgabezeit im Verlauf.
5. Zweite Person mit synthetischem Ausweisfoto registrieren (JPEG/PNG bis 5 MiB),
   dasselbe nun verfügbare Paar ausleihen und zurückgeben. Erwartete Zahlen:
   nach Registrierung 1/0/1/2, bei Ausleihe 0/1/1/2, nach Rückgabe 1/0/1/2.
6. Detailansicht, Listen ohne Ausweisnachweise, Bestätigungen und automatische
   Dashboardaktualisierung ohne manuellen Reload prüfen.
7. Neustart im Normalmodus: 0/0/0/0 und leere Listen. Demostart: reproduzierbare
   synthetische Startdaten, Dashboard 2/0/2/1, keine Ausleihen.

Im automatisierten HTTP-Gesamtfluss werden zusätzlich beide Startmodi mit
manuellem Nachweis, PNG und JPEG geprüft. Jede Variante legt eigene Ski und
Personen an und prüft Zuordnung, Zahlen, Konflikt, Rückgabe-Wiederholung und
erneute Ausleihe. Bestehende Detailtests sichern Validierung, Bildkopien,
Nebenläufigkeit und Fehlerschutz ab.

## Aufgaben und Akzeptanzkriterien

- Gesamtfluss über die öffentliche HTTP-Schnittstelle automatisiert absichern.
- Beide Nachweisarten im Browser vollständig von Registrierung bis Rückgabe
  durchspielen; tatsächlichen Browserprüfumfang getrennt dokumentieren.
- Einen reproduzierbaren synthetischen Foto-Testdatensatz bereitstellen.
- `go build ./...`, `go test ./...`, `go test -race ./...` und `go vet ./...`
  bestehen. Go-Formatierung und JavaScript-Syntax prüfen.
- Start, Demomodus, Neustartverhalten und vorführbaren Build aus dem Repository
  mit eingebetteten Assets prüfen.
- Die sichtbare Phasenmarkierung der Oberfläche durch eine MVP-Kennzeichnung
  ersetzen; die Funktionen der abgenommenen Phasen bleiben unverändert.
- README, technische Verfassung, Roadmap und Repositoryhinweise auf den aktuellen
  Projektstand bringen. Setup, Befehle, Demoablauf und bekannte Grenzen erklären.
- Ergebnisse, Abweichungen und noch ausstehende Auftraggeberabnahme ausdrücklich
  dokumentieren. Kein MVP-Abnahmestatus allein aufgrund technischer Tests.

## Status und Prüfnachweis

**Implementiert, geprüft und vom Auftraggeber am 21.10.2026 abgenommen.**
Ausdrückliche Bestätigung im Projektgespräch: „phase 4 ist hiermit abgenommen“.
Damit ist der vereinbarte MVP einschließlich seiner dokumentierten Grenzen
abgenommen. Die Phase wird mit dem lokalen Commit
`Phase 4: MVP-Abnahme und Dokumentation abschließen` gesichert.

Prüfumgebung: macOS/arm64, offizielle Go-Toolchain 1.27.3 und Chrome auf dem
Desktop. Nach einem zwischenzeitlichen Reset der temporären Prüfumgebung wurde
dieselbe Toolchain erneut anhand der offiziellen SHA-256-Metadaten geprüft und
der vollständige Browserablauf in einem frischen Serverlauf wiederholt.

### Automatisierte Prüfung

| Prüfung | Ergebnis |
| --- | --- |
| `go build ./...` | Bestanden |
| `go test ./...` | Bestanden, einschließlich aller sechs MVP-Varianten |
| `go test -race ./...` | Bestanden |
| `go vet ./...` | Bestanden |
| `gofmt -l cmd internal web/embed.go` | Keine unformatierten Dateien |
| `node --check` für alle drei JavaScript-Dateien | Bestanden |
| `git diff --check` | Bestanden |

Der neue HTTP-Gesamtflusstest legt in jeder Variante eigene Ski und Personen an,
prüft generierte IDs, Zuordnung, Detailnachweis und Listen ohne Ausweisdaten.
Fotos werden mit MIME-Typ und unverändertem Inhalt zurückgelesen. Ein zweiter
Ausleihversuch liefert 409 und verändert keine Kennzahlen. Rückgabe und deren
Wiederholung, erneute Ausleihe mit neuer ID sowie eine alte Rückgabe während der
neuen Ausleihe werden geprüft. Zwei abgeschlossene Einträge bleiben im Verlauf;
Dashboard-API und gerenderte HTML-Zahl stimmen. Ein neuer Store beginnt wieder
im jeweiligen Startzustand. Bestehende Tests sichern weiterhin Pflichtfelder,
ungültige Fotos, atomare Änderungen, Bildkopien und Nebenläufigkeit ab.

### Tatsächlich durchgeführte Browserprüfung

Normalmodus, ein durchgehender Lauf mit synthetischen Daten am 21.10.2026:

| Schritt | Verfügbar | Ausgeliehen | Gesamt | Personen |
| --- | ---: | ---: | ---: | ---: |
| Frischer Normalstart | 0 | 0 | 0 | 0 |
| „MVP Abnahmepaar“ gespeichert | 1 | 0 | 1 | 0 |
| „MVP Manuell“ mit Personalausweisnummer gespeichert | 1 | 0 | 1 | 1 |
| Paar an „MVP Manuell“ ausgeliehen | 0 | 1 | 1 | 1 |
| Erste Rückgabe gespeichert | 1 | 0 | 1 | 1 |
| „MVP Foto“ mit `testdata/ausweis-demo.png` gespeichert | 1 | 0 | 1 | 2 |
| Dasselbe Paar an „MVP Foto“ ausgeliehen | 0 | 1 | 1 | 2 |
| Zweite Rückgabe gespeichert | 1 | 0 | 1 | 2 |
| Neuer Normalstart | 0 | 0 | 0 | 0 |
| Neuer Demostart | 2 | 0 | 2 | 1 |

Nach beiden Registrierungen führte „Ski ausleihen“ zur korrekt vorausgewählten
Person. Speicher- und Rückgabebestätigungen waren sichtbar. Nach der ersten
Ausleihe war kein Paar mehr auswählbar. Nach Rückgabe konnte dasselbe Paar an
die zweite Person ausgeliehen werden. Beide Rückgaben erschienen mit Zeitpunkten
im Verlauf; anschließend gab es keine aktive Ausleihe. Das synthetische Foto war
im Personendetail sichtbar. Das bereits geöffnete Dashboard aktualisierte seine
Zahlen bei Tabwechsel ohne manuellen Reload.

Screenshots dieses Laufs:

- [Dashboard während der manuellen Ausleihe](screenshots/04-mvp-manuell-dashboard.png)
- [Personendetail mit synthetischem Foto](screenshots/04-mvp-fotodetail.png)
- [Dashboard nach beiden Rückgaben](screenshots/04-mvp-nach-rueckgaben.png)

JPEG wurde im automatisierten HTTP-Gesamtfluss geprüft; der Browser-Upload
dieser Phase verwendete PNG. Die mobile Darstellung bei 375 × 667 und die
Tastaturbedienung wurden in der abgenommenen Phase 3 geprüft, siehe
[03-dashboard.md](03-dashboard.md). Sie wurden in Phase 4 nicht erneut vollständig
durchlaufen. Kein zusätzlicher Safari-, Screenreader- oder Test auf einem echten
Mobilgerät. Diese Grenzen sind keine behaupteten erfolgreichen Prüfungen.

### Build, Start und Neustart

Mit `go build -o /private/tmp/skirental-phase4 ./cmd/server` wurde eine ausführbare
Datei gebaut. Sie wurde aus `/private/tmp` außerhalb des Repositorys gestartet;
Seiten, Styles und JavaScript wurden erfolgreich ausgeliefert. Normal- und
Demomodus wurden mit diesem Build im Browser geprüft. Beenden mit `Ctrl+C`
funktionierte. Nach dem Normalneustart lieferten Personen, Ski und Ausleihen
jeweils `[]`; die Dashboard-API und der Browser zeigten 0/0/0/0. Der abschließende
Demostart zeigt 2/0/2/1 und keine Ausleihen. Es wurden keine Go-Abhängigkeiten
hinzugefügt und keine echten Ausweisdaten verwendet.

README und technische Verfassung dokumentieren Setup, Einzeldatei-Build,
Startmodi, Testbefehle, Testdaten und Grenzen. Die Roadmap unterscheidet den
technischen Abschluss von der anschließend ausdrücklich bestätigten Auftraggeberabnahme.

## Bekannte Grenzen

- Alle Stammdaten, Nachweise und Ausleihen liegen nur im Arbeitsspeicher.
  Neustarts verwerfen Änderungen; IDs können erneut vergeben werden.
- Lokaler Prototyp ohne Benutzerkonten, dauerhafte Speicherung, Suche, Löschen,
  Reservierungen, Preise oder Zahlungen. Ausschließlich synthetische Daten.
- Formulare benötigen JavaScript. Ohne JavaScript zeigt das Dashboard nur den
  beim Öffnen gerenderten Stand. Die automatische Aktualisierung erfolgt in
  sichtbaren Tabs alle fünf Sekunden nach Abschluss der letzten Anfrage.
- Ein Wechsel des Servermodus benötigt einen Seitenreload für den Modushinweis.
  Andere Verwaltungs- und Ausleihtabs werden über „Aktualisieren“ erneuert.
- Ausleihübersichten zeigen aktuelle Namen der Stammdaten, keine historischen
  Namensstände. Die Zuordnung bleibt über IDs erhalten.
- Der temporäre Go-Toolchain- und Binary-Pfad kann durch Systembereinigung
  verschwinden; eine dauerhafte Go-Installation und eigener Build sind empfohlen.

Keine offene funktionale Abweichung von den Phase-4-Akzeptanzkriterien gefunden.
Die abschließende MVP-Abnahme wurde vom Auftraggeber ausdrücklich bestätigt.

## Liste für die Auftraggeberabnahme

Bei der Kennzahlenprüfung gilt die Reihenfolge verfügbar/ausgeliehen/gesamt/Personen.
Für den vollständigen Ablauf im Normalmodus starten; im Demomodus vorhandene
Startdaten zu den erwarteten Zahlen hinzuzählen.

- [ ] Starten: Speicherhinweis, Navigation und vier korrekte Kennzahlen sichtbar.
- [ ] Ein Ski-Paar anlegen und die erzeugte ID sowie 1/0/1/0 prüfen.
- [ ] Person mit manuellem Nachweis anlegen; Detail vollständig, Liste nur ID/Name.
- [ ] Über „Ski ausleihen“ die vorausgewählte Person und das verfügbare Paar
  ausleihen; Bestätigung und Dashboard 0/1/1/1 prüfen.
- [ ] Rückgabe erfassen; Verlauf mit Zeitpunkt und Dashboard 1/0/1/1 prüfen.
- [ ] Zweite Person mit dem synthetischen PNG anlegen; Foto im Detail prüfen.
- [ ] Dasselbe Paar an diese Person ausleihen und zurückgeben; Kennzahlen
  0/1/1/2 und anschließend 1/0/1/2, zwei abgeschlossene Ausleihen prüfen.
- [ ] Normalneustart: Daten leer. Demostart: 2/0/2/1, keine Ausleihen.
- [x] Dokumentierte Grenzen akzeptieren und Phase 4/MVP ausdrücklich abnehmen
  (Bestätigung am 21.10.2026). Die übrigen Punkte dienen als wiederholbare
  Prüfliste; tatsächlich durchgeführte Prüfungen sind oben dokumentiert.
