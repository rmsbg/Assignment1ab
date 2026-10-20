# Phase 1 – Personen und Ski verwalten

## Status und Umfang

Spezifikation vor Implementierung erstellt, 20.10.2026.
**Aktueller Status: implementiert, geprüft und vom Auftraggeber abgenommen
(20.10.2026).**

Personen und Ski-Paare können
angelegt, aufgelistet, gezielt angezeigt und bearbeitet werden. Löschen, Suche,
Ausleihe und echte Dashboard-Zahlen bleiben Folgephasen. Auftraggeberabnahme
bleibt nach Implementierung und Prüfung ein eigener Schritt.

## Abläufe und Regeln

Die Verwaltung zeigt ID und Name beziehungsweise Bezeichnung. „Anlegen“ öffnet
ein Formular; eine Detailansicht bietet „Bearbeiten“. IDs erzeugt der Store und
ändert sie nie. Doppelte Namen sind erlaubt. Namen und Bezeichnungen werden
getrimmt und müssen nicht leer sein. Abbrechen verwirft Formulareingaben;
erfolgreiches Speichern führt zur Detailansicht mit sichtbarer Bestätigung.

Personen benötigen genau einen Nachweis: JPEG-/PNG-Foto bis 5 MiB oder Nummer
mit Personalausweis, Reisepass, Führerschein oder Sonstiger Ausweis (zusätzlich
Bezeichnung). Das Backend prüft Größe, deklarierte Bildart und vollständige
Dekodierbarkeit. Eine Pixelgrenze von 20 Millionen schützt vor übermäßigem
Dekodierspeicher. Nur die Detailansicht zeigt Nummer oder Foto. Bei Bearbeitung
kann der Nachweis unverändert bleiben oder vollständig ersetzt werden. Alle
Eingaben werden vor der atomaren Änderung validiert; Fehler erhalten den alten
Datensatz. Bilddaten werden bei Schreib- und Leseoperationen kopiert.

## Schnittstellen

- `GET/POST /api/ski`, `GET/PUT /api/ski/{id}`: JSON mit `name`; Antworten
  enthalten `id`, `name`. Unbekannte Schreibfelder (auch IDs) sind ungültig.
- `GET /api/personen`: ausschließlich `id`, `name` je Person.
- `GET /api/personen/{id}`: Stammdaten und manueller Nachweis oder Foto-URL.
- `POST /api/personen`, `PUT /api/personen/{id}`: Multipart mit `name`,
  `proof` (`manual`, `photo`, bei PUT auch `keep`), `documentType`,
  `documentDescription`, `documentNumber`, `photo` (Datei). Textfelder sind auf jeweils 8 KiB begrenzt.
  `keep` erhält den Nachweis unverändert; widersprüchliche Nachweise sind Fehler.
- `GET /api/personen/{id}/foto`: Bild mit geprüftem MIME-Typ; ohne Foto 404.
- Erfolg: 200 beim Lesen/Ändern, 201 mit Location beim Anlegen. Fehler:
  400 ungültige Eingaben, 404 unbekannte ID, 405 Methode, 413 Größenlimit,
  415 falscher Request-Medientyp. JSON-Fehler enthalten `errors` mit Feldnamen.
- Personenbezogene Antworten und Fehler verwenden `Cache-Control: no-store`.
  Keine Ausweisdaten in Logs, URLs oder Listen. Multipart wird ohne temporäre
  Dateien eingelesen; begrenzte Request-Größe (5 MiB plus 64 KiB Formularhülle).

## Aufgaben und Akzeptanz

1. Domainvalidierung und Store-Operationen einschließlich Kopien und eindeutiger
   IDs unter Sperre implementieren.
2. API mit strikter Eingabeprüfung und Fehlerantworten implementieren.
3. Bestehendes Layout um Listen, Details, Formulare und Feldfehler ergänzen.
4. Pflichtfelder, alle Nachweisarten, Nachweiswechsel, unveränderten Nachweis,
   ungültige/zu große/falsch deklarierte Bilder und fehlende Datensätze testen.
5. Paralleles Anlegen/Lesen/Ändern sowie Isolation der Bildkopien prüfen.
6. Build, Tests, Race-Tests und Vet bestehen; Browser prüft beide Startmodi,
   Erfassung, Bearbeitung, Abbrechen, Fehler sowie Desktop und mobile Ansicht.
7. README, technische Verfassung, Roadmap und Prüfnachweis aktualisieren.

## Prüfnachweis – 20.10.2026

**Prüfergebnis: implementiert und geprüft.**
Prüfumgebung: macOS/arm64, Go 1.27.3 aus
`/private/tmp/skirental-toolchain/go`, Apple Clang, Safari 26.3.1.
Der Go-Buildcache lag wegen der Sandbox unter `/private/tmp/skirental-go-cache`.
Keine neuen Abhängigkeiten.

| Prüfung | Ergebnis |
| --- | --- |
| `go build ./...` | Bestanden |
| `go test ./...` | Bestanden; Domain-, Store- und HTTP-Tests |
| `go test -race ./...` | Bestanden, keine Datenrennen |
| `go vet ./...` | Bestanden |
| `node --check web/assets/verwaltung.js` | Bestanden (nur Entwicklungsprüfung; Node ist keine Laufzeitvoraussetzung) |
| Pflichtfelder, Trimmen, alle vier Ausweisarten, gleiche Namen | Automatisiert bestanden |
| Anlegen, Lesen, Ändern, unveränderliche IDs, fehlende Datensätze | Automatisiert bestanden |
| Nachweis beibehalten, Foto ↔ manuell, atomare Ablehnung | Automatisiert bestanden |
| Eingabe-, Rückgabe-, Detail- und Snapshot-Bildkopien | Automatisiert bestanden |
| Paralleles Anlegen und Lesen/Ändern | 24 Abläufe mit je 15 Personen und Ski; keine verlorenen Datensätze oder doppelten IDs |
| Gleichzeitige Änderungen derselben Person | 12 Abläufe mit je 30 Änderungen; vollständiger Nachweis bleibt erhalten |
| JPEG/PNG, beschädigte, abgeschnittene, falsch deklarierte und zu große Fotos | Automatisiert bestanden |
| Multipart: doppelte/unbekannte Felder, widersprüchliche Nachweise, Größenlimit | Automatisiert bestanden; unveränderter Zustand bei Fehlern |
| Personenlisten ausschließlich ID und Name; no-store | Automatisiert bestanden |
| Demo- und Normalstart in Safari | Bestanden; Demo-Person und zwei Ski sichtbar, Normalstart leer |
| Personenanlage und Pflichtfeldfehler | In Safari bestanden; Personalausweis und sonstiger Ausweis mit Zusatzbezeichnung |
| Fotoersatz und Wechsel zurück zur manuellen Erfassung | In Safari mit synthetischem PNG bestanden; Detail zeigt jeweils den neuen Nachweis |
| Abbrechen | In Safari bestanden; verworfener Name erscheint nicht im Detail |
| Ski anlegen und bearbeiten; Speicherbestätigungen | In Safari bestanden |
| Desktop und 390 × 844 Pixel | In Safari und Responsive-Design-Modus geprüft; Listen, Formular und Detail lesbar und bedienbar |
| Neustart | Nach Demo-Bearbeitungen im Normalmodus neu gestartet: Liste leer, Demokennzeichnung entfernt |

Screenshots mit ausschließlich synthetischen Daten:
[Desktopliste](screenshots/01-personen-desktop.png),
[mobile Liste](screenshots/01-personen-mobil.png).
Der Fototest verwendet ein erzeugtes Farbmuster, keinen echten Ausweis.

## Auftraggeberabnahme – 20.10.2026

Der Auftraggeber hat Phase 1 im Projektgespräch ausdrücklich mit
„phase 1 ist hiermit abgenommen“ bestätigt. Die Abnahme erfolgte nach Bereitstellung
der Abnahmeliste und der Klarstellung, welche Fälle im Browser beziehungsweise
automatisiert geprüft wurden. Damit ist Phase 1 abgeschlossen.

Zur Einordnung des Prüfnachweises: Abbrechen einer Ski-Bearbeitung, gleichnamige
Einträge und sämtliche Upload-Fehlerfälle wurden nicht zusätzlich einzeln im
Browser durchgespielt. Die oben beschriebenen automatisierten Prüfungen und
Browserdurchläufe bleiben der dokumentierte technische Prüfumfang.

## Bekannte Grenzen

- Sämtliche Daten einschließlich Fotos gehen beim Neustart verloren.
- Lokaler Prototyp ohne Benutzerkonten, Suche, Löschen oder Ausleihe;
  Dashboard-Kennzahlen bleiben Platzhalter.
- Die Verwaltung benötigt JavaScript. Die Browserprüfung erfolgte in Safari;
  andere Browser wurden nicht gesondert geprüft.
- Zum Schutz des Arbeitsspeichers gelten zusätzlich zum 5-MiB-Dateilimit eine
  Grenze von 20 Millionen Bildpixeln und 8 KiB je Textfeld.
- Keine offenen funktionalen Abweichungen vom hier spezifizierten Phase-1-Umfang.
  Die technische Prüfung ersetzt keine Auftraggeberabnahme.
