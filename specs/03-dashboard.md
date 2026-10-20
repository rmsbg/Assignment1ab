# Phase 3 – Dashboard und durchgängige Bedienung

## Status und Umfang

Spezifikation vor Implementierung erstellt, 21.10.2026. Phase 2 ist abgenommen.
**Aktueller Status: implementiert, geprüft und vom Auftraggeber am 21.10.2026 abgenommen.**
Diese Phase ersetzt Dashboard-Platzhalter durch echte Kennzahlen und prüft die
Bedienung über alle Ansichten. Die Auftraggeberabnahme ist getrennt von der
technischen Prüfung dokumentiert; der anschließende lokale Git-Commit sichert
den abgenommenen Stand.

## Kennzahlen und Konsistenz

Das Dashboard zählt Ski-Paare, keine einzelnen Ski:

- Verfügbare Ski: Paare ohne aktive Ausleihe.
- Ausgeliehene Ski: Anzahl unterschiedlicher Paare mit aktiver Ausleihe.
- Gesamtbestand Ski: alle vorhandenen Paare.
- Registrierte Personen: alle vorhandenen Personen, unabhängig von Ausleihen.

Verfügbare plus ausgeliehene Paare ergeben immer den Gesamtbestand. Beendete
Ausleihen zählen nicht als ausgeliehen; mehrere Ausleihen einer Person erhöhen
nicht die Personenanzahl. Alle vier Zahlen werden unter derselben Lesesperre
berechnet, ohne Personen- oder Bilddaten zu kopieren oder auszuliefern.
Normalstart liefert 0/0/0/0; Demostart 2/0/2/1 in obiger Reihenfolge.
Fehlgeschlagene Eingaben und wiederholte Rückgaben verändern keine Kennzahl.

## API und automatische Aktualisierung

`GET /api/dashboard` liefert JSON mit genau `availableSkis`, `rentedSkis`,
`totalSkis`, `registeredPeople` (nichtnegative Ganzzahlen), Status 200.
GET/HEAD sind erlaubt, andere Methoden liefern 405. Antworten verwenden
`Cache-Control: no-store` und `X-Content-Type-Options: nosniff`; keine Namen,
Personen-IDs oder Ausweisnachweise.

Beim Öffnen rendert der Server bereits einen konsistenten Zahlenstand in HTML.
JavaScript aktualisiert sofort sowie alle 5 Sekunden nach Abschluss der letzten
Abfrage und beim Zurückwechseln zum Tab/Fenster. Abfragen haben ein Timeout von
5 Sekunden und überlappen sich nicht. Verborgene Tabs pausieren; beim Verlassen
werden Abfragen abgebrochen, bei Rückkehr aus dem Browsercache neu gestartet.
Es gibt keine zusätzlichen Abhängigkeiten und keinen Push-Dienst.

Der sichtbare Status zeigt Aktualisierungszeitpunkt und Intervall. Bei Netzwerk-,
HTTP- oder Formatfehlern bleiben die letzten Zahlen erhalten und werden deutlich
als möglicherweise veraltet gekennzeichnet. Fehler werden nicht als Nullwerte
angezeigt. „Jetzt aktualisieren“ erlaubt einen erneuten Versuch; das Intervall
versucht es ebenfalls erneut. Ohne JavaScript bleiben die beim Öffnen ermittelten
Zahlen mit einem entsprechenden Hinweis nutzbar. Während fehlerhafter Anfragen
bleiben Navigation und Schnellzugriffe bedienbar.

## Durchgängige Bedienung

Die drei Schnellzugriffe führen zu Ski, Personen und neuer Ausleihe. Navigation,
Demokennzeichnung und Speicherhinweise bleiben erhalten. Leere Listen und fehlende
Personen/verfügbare Paare bieten verständliche nächste Schritte. Pflichtfelder,
Feldfehler, Abbrechen, Speicherbestätigungen und sichtbare Beschriftungen bleiben
vorhanden. Formulare, Auswahl, Rückgabe und Navigation sind per Tastatur erreichbar;
Fokus ist sichtbar und geht nach dynamischem Speichern nicht verloren.
Veraltete Ausleihauswahl wird nach einem Konflikt einschließlich Übersicht neu
abgerufen, ohne automatisch eine andere Ausleihe anzulegen.

## Aufgaben und Akzeptanzkriterien

1. Konsistente Store-Zählung und datensparsame Dashboard-API implementieren.
2. SSR-Kennzahlen, automatische Aktualisierung, Fehlerstatus und Wiederholung
   im bestehenden responsiven Layout ergänzen.
3. Navigation, Leerzustände und Tastaturabläufe prüfen; gefundene Bedienprobleme
   beheben, ohne den fachlichen Umfang der Vorphasen zu erweitern.
4. Store-/HTTP-Tests für beide Startmodi, Ski-/Personenanlage, Ausleihe, Rückgabe,
   erneute Ausleihe, Fehler ohne Änderung, konsistente parallele Zugriffe und
   Antworten ohne Ausweisdaten.
5. Browser: sichtbares Dashboard in einem Tab, fachliche Änderungen in einem
   zweiten; automatische Aktualisierung ohne Reload bei Registrierung, Ski-Anlage,
   Ausleihe und Rückgabe. Auch Tab-Rückkehr, Fehler und Erholung prüfen.
6. Desktop/Mobil, alle Schnellzugriffe, leere Ansichten, Feldfehler und Bedienung
   der relevanten Formulare mit Tastatur prüfen und den Prüfumfang festhalten.
7. Build, Tests, Race-Tests und Vet bestehen; Dokumentation aktualisieren.

## Prüfnachweis – 21.10.2026

**Prüfergebnis: implementiert und geprüft; Auftraggeberabnahme am 21.10.2026 bestätigt.**
Prüfumgebung: macOS/arm64, Go 1.27.3, Apple Clang, Chrome 155.
Toolchain: `/private/tmp/skirental-toolchain/go`, Buildcache:
`/private/tmp/skirental-go-cache`. Keine zusätzlichen Abhängigkeiten.

| Prüfung | Ergebnis |
| --- | --- |
| `go build ./...` | Bestanden |
| `go test ./...` | Bestanden einschließlich Tests der Vorphasen |
| `go test -race ./...` | Bestanden, keine Datenrennen |
| `go vet ./...` | Bestanden |
| `node --check` für Dashboard-, Verwaltungs- und Ausleihskript | Bestanden; Node ist nur Entwicklungsprüfung |
| Leer-/Demostart, Personen-/Ski-Anlage, Ausleihe, Rückgabe, wiederholte Rückgabe, erneute Ausleihe | Store-/HTTP-Tests bestanden; exakte Zahlen geprüft |
| Fehlerhafte Operationen und Umbenennung verändern die Zählung nicht | Store-/HTTP-Tests bestanden |
| Konsistente parallele Zählung | 12 parallele Abläufe mit je 30 Ausleihen/Rückgaben; verfügbare + ausgeliehene = gesamte Paare, keine negativen Werte |
| JSON-Felder, GET/HEAD, Methoden, unbekannte Route, Header, SSR | HTTP-Tests bestanden |
| Keine Namen/Personen-IDs/Ausweisnachweise im Dashboard | HTTP-Tests für HTML und JSON bestanden |
| Automatische Aktualisierung im sichtbaren Dashboard | Lokale API legt synthetisches Paar an; nach Intervall ohne Browseraktion 2 → 3 verfügbare Paare und Gesamtbestand 2 → 3 |
| Registrierung im zweiten Tab → Dashboardrückkehr | In Chrome ohne Reload Personen 1 → 2 |
| Ausleihe im zweiten Tab → Dashboardrückkehr | In Chrome ohne Reload verfügbar 3 → 2, ausgeliehen 0 → 1, Gesamtbestand 3, Personen 2 |
| Rückgabe im zweiten Tab → Dashboardrückkehr | In Chrome ohne Reload verfügbar 2 → 3, ausgeliehen 1 → 0 |
| Unterbrechung der Serververbindung | In Chrome: letzter Stand 4/0/4/2 bleibt erhalten; sichtbarer Fehler- und Veraltet-Hinweis |
| Erholung nach Serverneustart | In Chrome ohne Reload: Fehler verschwindet, neuer Demostand 2/0/2/1 erscheint |
| Manuelle Aktualisierung | Auf mobilem Viewport bedient; neuer Aktualisierungszeitpunkt, Fokus bleibt auf Schaltfläche |
| Alle drei Schnellzugriffe und Browser-Zurück | In Chrome geprüft; passende Ansichten und bei Rückkehr laufende Dashboardaktualisierung |
| Tastatur: Personenanlage, Auswahl, Ausleihe und Rückgabe | Mit Tabulator, Pfeil- und Eingabetaste bedient; Bestätigung/Detail erhält Fokus |
| Tastatur: Ski-Anlage, Feldfehler und Abbrechen einer Bearbeitung | In Chrome geprüft; Fehlerfokus, gespeicherte Bezeichnung und verworfene Änderung korrekt |
| Sprunglink und Fokus der Schnellzugriffe | In Chrome per Tastatur geprüft |
| Normalstart und leere Ansichten | In Chrome 0/0/0/0, kein Demohinweis; leere Personen-/Skilisten mit Anlegen-Link, Ausleihe mit Hinweisen und deaktiviertem Speichern |
| Veraltete Ausleihauswahl | Lokale API verleiht das im Browser gewählte Paar; Browserversuch scheitert mit Feldfehler und aktualisiert sowohl Auswahl als auch aktive Ausleihen |
| Desktop und 375 × 667 Pixel | Chrome-Sichtprüfung: vier Kennzahlen, Aktualisierungsstatus und Schaltfläche lesbar, mobile Schaltfläche bedienbar |
| Dashboard ohne JavaScript | In Chrome temporär deaktiviert und neu geladen: korrekte SSR-Zahlen, Hinweis statt funktionsloser Aktualisierung; danach JavaScript wieder aktiviert und laufende Aktualisierung verifiziert |

Screenshots: [Desktop](screenshots/03-dashboard-desktop.png),
[mobil](screenshots/03-dashboard-mobil.png),
[Verbindungsfehler](screenshots/03-dashboard-fehler.png).
Alle Daten sind synthetisch. Browserabläufe und automatisierte Tests sind in der
Tabelle getrennt ausgewiesen. Die technische Prüfung ersetzt keine Auftraggeberabnahme.

## Auftraggeberabnahme – 21.10.2026

Der Auftraggeber hat Phase 3 im Projektgespräch ausdrücklich mit
„phase 3 abgenommen“ bestätigt. Die Abnahme erfolgte nach Bereitstellung des
Demostands, des technischen Prüfnachweises und der Abnahmeliste. Damit ist Phase 3
abgeschlossen. Die folgende Liste bleibt als Abnahmeleitfaden erhalten; einzelne
Prüfschritte des Auftraggebers wurden nicht gesondert protokolliert.

## Abnahmeliste

- [ ] Demostart zeigt 2 verfügbare, 0 ausgeliehene, 2 gesamte Paare und 1 Person.
- [ ] Eine neue Person erhöht die Personenzahl; ein neues Paar erhöht Gesamtbestand und Verfügbarkeit.
- [ ] Ausleihe vermindert Verfügbarkeit und erhöht ausgeliehene Paare; Gesamtbestand bleibt gleich.
- [ ] Rückgabe stellt die Zahlen wieder her; vergangene Ausleihen werden nicht als aktiv gezählt.
- [ ] Dashboard im zweiten Tab aktualisiert sich bei Rückkehr ohne manuellen Reload.
- [ ] Verfügbare plus ausgeliehene Paare ergeben den Gesamtbestand.
- [ ] Alle drei Schnellzugriffe führen zur richtigen Ansicht.
- [ ] Leere Listen, fehlende Auswahl und Feldfehler erklären die nächsten Schritte.
- [ ] Formulare, Abbrechen und Rückgabe sind mit Tastatur bedienbar; Fokus bleibt nachvollziehbar.
- [ ] Dashboard ist auf schmalem Bildschirm lesbar und „Jetzt aktualisieren“ bedienbar.

## Bekannte Grenzen

- Daten bleiben flüchtig; Neustarts verwerfen den bisherigen Store.
- Aktualisierung erfolgt per Intervall, nicht per Push. Eine Hintergrundänderung
  erscheint nach der nächsten erfolgreichen Abfrage; verborgene Tabs pausieren.
- Der Zahlenstand wird automatisch aktualisiert. Navigation, Modus- und
  Speicherhinweise stammen aus dem HTML beim Öffnen. Nach Wechsel des Startmodus
  den Tab neu öffnen oder laden, damit auch die Demokennzeichnung dazu passt.
- Ohne JavaScript stehen ausschließlich die beim Öffnen gerenderten Zahlen zur
  Verfügung; Verwaltungsformulare benötigen weiterhin JavaScript.
- Browserprüfung dieser Phase in Chrome mit Tastatur und Geräteemulation;
  keine gesonderte Safari-, Screenreader- oder echte Mobilgeräteprüfung.
- Timeout und ungültige Antwortformate werden im Code abgefangen; diese beiden
  Fehlerarten wurden nicht zusätzlich separat im Browser provoziert. Der echte
  Verbindungsabbruch und die automatische Erholung wurden im Browser geprüft.
- Keine offenen Abweichungen vom beschriebenen Phase-3-Umfang. Die
  Auftraggeberabnahme von Phase 3 ist oben dokumentiert; Phase 4 steht aus.
  Der lokale Commit sichert den abgenommenen Stand.
