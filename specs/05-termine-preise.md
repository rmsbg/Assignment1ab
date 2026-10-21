# Phase 5 – Verleihtermine, Buchungen und Preise

## Status und Regeln

Planung am 21.10.2026 abgeschlossen; Implementierung ausdrücklich beauftragt.
**Implementiert, technisch geprüft und am 21.10.2026 ausdrücklich vom
Auftraggeber abgenommen.**

- Beginn heute oder später, Ende mindestens Beginn. Beide Randtage zählen.
  Geschäftsdatum Europe/Vienna; Eingabe YYYY-MM-DD, Jahre 0001–9999.
- Zustände: booked, issued, returned, cancelled; expired ist ein abgeleiteter
  Zustand für nicht ausgegebene Buchungen nach dem Enddatum. overdue kennzeichnet
  ausgegebene Paare nach dem Enddatum, ohne sie automatisch zurückzunehmen.
- Offene Buchungen desselben Paars dürfen sich einschließlich Randtagen nicht
  überschneiden. Zurückgegebene und stornierte Buchungen blockieren nicht mehr.
  Folgetermine ab dem nächsten Tag bleiben trotz offener Ausgabe zulässig.
- Ausgabe nur im Zeitraum und ohne andere offene Ausgabe desselben Paars.
  Wiederholte Ausgabe erhält den Zeitstempel, auch nach Rückgabe; Stornierte
  können nicht ausgegeben werden. Rückgabe nur nach Ausgabe, wiederholt idempotent.
- Stornierung nur vor Ausgabe, auch bei abgelaufenen Buchungen; wiederholt
  idempotent. Änderungen durch Stornierung und Neubuchung. Keine Löschung.
- Tarif: lückenlose Liste von Gesamtpreisen ab 1 Tag plus Zusatztagspreis.
  Nichtnegative ganze Cent, EUR. Leere Listen sind kein speicherbarer Tarif.
  Für d > N: Preis[N] + (d-N) × Zusatztag. Überläufe werden abgelehnt.
- Gesamtpreis, Dauer und Tarifversion werden unveränderlich bei Buchung gespeichert.
  Fehlender Tarif verhindert Buchung; geänderte Vorschau muss erneut bestätigt werden.
- Normalstart ohne Tarif (Version 0), Demo Version 1 mit [2500,4500,6000] Cent
  und 1500 Cent je Zusatztag. Wiederholtes Demo-Seeding überschreibt keine Tarife.
- Dashboard: tatsächlich ausgegebene Paare, keine bloßen Buchungen; Hinweis auf
  Zeitraumprüfung im Formular. Alle Übersichten enthalten keine Ausweisnachweise.

## Schnittstellen

JSON, no-store, bestehende Schutzheader und 64-KiB-Schreiblimit gelten weiter.

| Route | Vertrag |
| --- | --- |
| GET /api/tarife | {version, pricesCents: [], extraDayCents}; Version 0 bedeutet nicht eingerichtet |
| PUT /api/tarife | Derselbe Vertrag mit erwarteter version; vollständiger atomarer Ersatz, neue Version |
| POST /api/ausleihen/preis | {startsOn, endsOn}; Antwort {durationDays, totalPriceCents, tariffVersion} |
| GET /api/ski/verfuegbar?startsOn=…&endsOn=… | Terminbezogen verfügbare Paare; beide Parameter gemeinsam erforderlich |
| GET /api/ski/verfuegbar | Tatsächlich nicht ausgegebene Paare |
| POST /api/ausleihen | {personID, skiID, startsOn, endsOn, tariffVersion}; 201 mit Location |
| GET /api/ausleihen und /api/ausleihen/{id} | Bisherige Referenzen/Namen plus createdAt, startsOn, endsOn, durationDays, totalPriceCents, tariffVersion, status, overdue, nullable rentedAt/returnedAt/cancelledAt |
| PUT /api/ausleihen/{id}/ausgabe, /rueckgabe, /stornierung | Leerer Body; aktualisierter Datensatz |

Fehler: 400 ungültige Eingaben/unbekannte Felder, 404 unbekannte Referenz,
409 Termin-, Zustands- oder Tarifversionskonflikt, 413 Größenlimit, 415 Medientyp,
405 Methode. Fehler enthalten deutsche Feldmeldungen in errors. Keine Fehleraktion
verändert Daten oder verbraucht IDs. Vorschau ohne Tarif liefert 400 mit Tarifhinweis.

## Umsetzung und Akzeptanz

1. Domain: kalenderbasierte Dauer und sichere Tarifrechnung; Ausgabe und Buchung trennen.
2. Store: atomare Buchung, Tarifversionierung, Terminabfrage, Ausgabe/Rückgabe/Storno.
3. API: strikte Eingaben, datensparsame Antworten und verständliche Konflikte.
4. Oberfläche: Person/Termine → verfügbare Paare und Preis → Buchung; danach
   ausdrückliche Ausgabe/Rückgabe/Storno. Vorschau nach Terminänderung ungültig.
   Bei Tarifänderung neue Vorschau zeigen und erneuten Speicherversuch verlangen.
5. Tarifverwaltung über Navigation/Dashboard: Tagespreise und Zusatztag bearbeiten;
   Konflikte erhalten Eingaben und verlangen erneutes Laden. Kein stilles Überschreiben.
6. Tests: Randtage, Schaltjahr, Zeitumstellung, Tarifgrenzen/Überlauf, Konflikte ohne
   Mutation, parallele Buchungen/Tarifänderungen, Folgeausgabe bei Überfälligkeit,
   Storno/Idempotenz, Dashboard, Datenschutz und bestehende Verwaltungsabläufe.
7. Build, Tests, Race, Vet, JavaScript-Syntax; Browser Desktop/Mobil einschließlich
   Normalstart ohne Tarif und Demo-Gesamtfluss. Prüfnachweis und Screenshots ergänzen.

## Grenzen

Keine Zahlungen, Rechnungen, Rabatte, Bearbeitung bestehender Buchungen, Benutzerkonten
oder dauerhafte Speicherung. Keine echte Kunden-/Ausweisdaten verwenden.

## Prüfnachweis – 21.10.2026

Umgebung: macOS/arm64, bestehende Go-1.27.3-Toolchain unter
`/private/tmp/skirental-toolchain/go`, Cache `/private/tmp/skirental-go-cache`,
Google Chrome. Keine neuen Abhängigkeiten. Ausschließlich synthetische Daten.

| Prüfung | Ergebnis |
| --- | --- |
| `go build ./...` | Bestanden; aktualisierter Demoserver zusätzlich neu kompiliert und gestartet |
| `go test ./...` | Bestanden einschließlich angepasster bisheriger Szenarien und neuer Phase-5-Tests |
| `go test -race ./...` | Bestanden; keine Datenrennen |
| `go vet ./...` | Bestanden |
| `node --check web/assets/ausleihe.js` und `tarife.js` | Bestanden |
| Kalender: Randtage, Schaltjahr, Jahreswechsel, Sommer-/Winterzeit, Wiener Geschäftsdatum, voller vierstelliger Jahresbereich | Domain-Tests bestanden |
| Tarifgrenzen, Zusatztage, Nullpreise, ungültige Werte und Überlauf | Domain-/HTTP-Tests bestanden |
| Terminüberschneidungen, Storno, frühe/späte Rückgabe, abgelaufene Buchung, gesperrte Ausgabe bei überfälligem Vorgänger | Store-Tests mit kontrolliertem Geschäftsdatum bestanden |
| Parallele gleiche Buchungen | 32 Store- und 24 HTTP-Versuche: jeweils genau eine erfolgreiche Buchung |
| Parallele Tarifänderungen und Buchungen | Versionskonflikte und konsistente gespeicherte Preise automatisiert einschließlich Race-Prüfung bestätigt |
| Ausgabe/Rückgabe/Storno, wiederholte Aktionen, unveränderte Zeitpunkte, Konflikte ohne Mutation | Store-/HTTP-Tests bestanden |
| Requestformat, Pflichtfelder, Nullwerte, unbekannte Felder/Referenzen, Statuscodes, Größenlimit, Schutzheader und Datenschutz | HTTP-Tests bestanden |
| Registrierung, Foto/manueller Nachweis, Buchung, Ausgabe, Dashboard, Rückgabe, erneute Ausleihe | Öffentlicher HTTP-Gesamtfluss in Normal-/Demomodus mit manuellem Nachweis, PNG und JPEG bestanden |
| Browser Desktop | Vier Tage zu 75 EUR gebucht, ausgegeben und vorzeitig zurückgegeben; Preis bleibt 75 EUR; Dashboard zählt nur Ausgabe |
| Preisänderung in zweitem Tab | Alte Bestätigung zu 25 EUR scheitert, neue Vorschau 26,50 EUR; erst erneute Auswahl/Bestätigung legt Buchung an |
| Browser Stornierung | Buchung vor Ausgabe storniert, im Verlauf mit Preis und Zeit erhalten |
| Mobile Ansicht 375 × 667 | Datumswahl, Zweitagestarif 45 EUR, zukünftige Buchung und Stornierung bedient; keine vorzeitige Ausgabe angeboten; Tarifansicht visuell geprüft |
| Normalstart ohne Tarif | Buchung gesperrt, Tarifeinrichtung erreichbar; negativer Preis abgelehnt, Zeilen hinzugefügt/entfernt, Zusatztag 15.50 als 15,50 EUR gespeichert |
| Vollständig gebuchter Zeitraum | Beide Paare derselben Person gebucht; weitere Auswahl/Speichern gesperrt, Hilfelink zur Skiverwaltung sichtbar |
| Fokus und Bedienbarkeit | Sichtbare Labels, Auswahl-/Datumsfelder und Fokus auf Fehlermeldung bzw. Speicherbestätigung im Browser kontrolliert |

Die Browserprüfung verwendete für den Demo-/Normalmodus temporäre Go-Overlays mit
Ports 8085/8086, da auf 8080 bereits ein früherer Server läuft. Anwendungscode und
Standardstart bleiben auf Port 8080. Der Normal-Prüfserver wurde beendet.
Der aktuelle Demostand auf 8085 enthält zur Nachprüfung eine heutige Buchung und
eine tatsächlich ausgegebene Ausleihe; diese sind ausschließlich Prüfdaten.
Nach Neustart lädt der Demomodus wieder keine Buchungen.

Screenshots:
- [Aktuelle Übersicht Desktop](screenshots/05-uebersicht-desktop.png)
- [Tarifkonflikt Desktop](screenshots/05-tarifkonflikt-desktop.png)
- [Rückgabe und Stornierung](screenshots/05-verlauf-desktop.png)
- [Buchungsformular mobil](screenshots/05-buchung-mobil.png)
- [Tarifverwaltung mobil](screenshots/05-tarife-mobil.png)
- [Tarifersteinrichtung Normalmodus](screenshots/05-tarife-normal.png)

Überfälligkeit und Tageswechsel wurden mit kontrollierter Zeit automatisiert
geprüft; die Systemuhr wurde für Browserprüfungen nicht geändert. Kein gesonderter
Safari-, Screenreader- oder physischer Mobilgerätetest. Keine bekannten offenen
Abweichungen von den festgelegten Regeln.

## Auftraggeberabnahme – 21.10.2026

Der Auftraggeber hat Phase 5 nach Bereitstellung der Implementierung, des
technischen Prüfnachweises und des Demostands im Projektgespräch ausdrücklich
mit „phase 5 ist hiermit abgenommen“ bestätigt. Damit ist Phase 5 abgeschlossen.
Der oben dokumentierte Prüfnachweis bleibt unverändert erhalten. Der abgenommene
Stand wird anschließend mit dem lokalen Commit
`Phase 5: Verleihtermine und Tarifverwaltung abschließen` gesichert.

Die folgende Liste bleibt als Abnahmeleitfaden erhalten; einzelne manuelle
Prüfschritte des Auftraggebers wurden nicht gesondert protokolliert.

Abnahmeliste:
- [ ] Verleihbeginn und geplante Rückgabe einschließlich Tagesanzahl sind nachvollziehbar.
- [ ] Tarifstaffel und Zusatztage ergeben den erwarteten Gesamtpreis.
- [ ] Terminüberschneidungen werden verhindert; Folgetermine sind möglich.
- [ ] Ausgabe und Rückgabe erfolgen ausdrücklich; Dashboard zählt tatsächliche Ausgabe.
- [ ] Buchungen können vor Ausgabe storniert werden und bleiben im Verlauf sichtbar.
- [ ] Tarifänderungen verlangen erneute Preisbestätigung und ändern keine bestehenden Preise.
- [ ] Frühe/späte Rückgabe ändert den vereinbarten Preis nicht.
- [ ] Normal-/Demostart, Mobilansicht und bekannte Grenzen sind nachvollziehbar dokumentiert.
