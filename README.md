# Skiverleih System

## SkiRental – lokaler Prototyp

Phase 0 und Phase 1 sind vom Auftraggeber abgenommen. Phase 1 umfasst:
Personen und Ski-Paare können angelegt, aufgelistet, einzeln angezeigt und
bearbeitet werden. Die Abnahme erfolgte am 20.10.2026. Phase 2 ist implementiert,
geprüft und am 21.10.2026 vom Auftraggeber abgenommen: Ausleihen und Rückgaben
sind möglich. Phase 3 ist implementiert, geprüft und am 21.10.2026 vom Auftraggeber
abgenommen. Das Dashboard zeigt echte Kennzahlen und aktualisiert sich automatisch.
Phase 4 ist implementiert, geprüft und am 21.10.2026 ausdrücklich vom Auftraggeber
abgenommen. Damit ist der vereinbarte MVP abgeschlossen. Gesamtprüfnachweis und Abnahmeliste stehen in
[specs/04-mvp-abnahme.md](specs/04-mvp-abnahme.md).
Phase 5 ist implementiert, technisch geprüft und am 21.10.2026 ausdrücklich
vom Auftraggeber abgenommen: Terminbuchungen, ausdrückliche
Ausgabe, Stornierung und dauerabhängige Preise mit Tarifverwaltung. Die
Spezifikation, Prüfnachweis und Abnahme: [Phase 5](specs/05-termine-preise.md).
Phase 6 (Buchen und sofort ausgeben) ist implementiert, technisch geprüft und am
22.10.2026 ausdrücklich vom Auftraggeber abgenommen:
[Prüfnachweis und Abnahme](specs/06-buchen-und-ausgeben.md).

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

Für einen vorführbaren Build mit eingebetteten HTML-/CSS-/JavaScript-Dateien:

```sh
mkdir -p bin
go build -o bin/skirental ./cmd/server
./bin/skirental
# Alternativ:
./bin/skirental -demo
```

Die ausführbare Datei kann auch außerhalb des Repositorys gestartet werden;
zusätzliche Asset-Dateien sind nicht nötig. Der Build gilt für das jeweilige
Betriebssystem und die Prozessorarchitektur. `bin/` wird nicht versioniert.

### Startzustand und Grenzen

- Normalmodus: leerer Store einschließlich noch nicht eingerichtetem Tarif.
- Demomodus: zwei Ski-Paare und eine synthetische Person mit manuellem
  Ausweisnachweis, ohne Ausleihen oder Ausweisfoto, mit Beispieltarif. Die Verwaltung listet die
  Demodaten auf; der Modus wird sichtbar angezeigt.
- Alle Änderungen gehen beim Neustart verloren. Danach entsteht erneut der
  gewählte leere oder Demo-Startzustand.
- IDs sind innerhalb eines Serverlaufs eindeutig; nach Neustarts können sie
  erneut vergeben werden. Nach einem Moduswechsel Browserseiten neu laden.
- Das Dashboard zählt Ski-Paare und Personen aus dem aktuellen Store.
- Kennzahlen aktualisieren sich automatisch alle 5 Sekunden sowie bei Rückkehr
  zum Dashboard-Tab. Bei Fehlern bleibt der letzte Stand als veraltet markiert.
- Nur synthetische Kundendaten verwenden; kein produktiver Betrieb.

### Entwicklung und Prüfung

```sh
go build ./...
go test ./...
go test -race ./...
go vet ./...
go fmt ./...
```

Der automatisierte MVP-Gesamtfluss kann gezielt ausgeführt werden:

```sh
go test ./internal/handler -run TestMVPAcceptanceWorkflow -v
```

Er prüft Normal- und Demomodus jeweils mit manuellem Nachweis, PNG und JPEG,
einschließlich Tarifeinrichtung, Buchung, Ausgabe, Ausleihkonflikt, Rückgabe und erneuter Ausleihe. Für die manuelle
Browserprüfung liegt ein ausschließlich synthetisches Foto unter
[testdata/ausweis-demo.png](testdata/ausweis-demo.png). Herkunft und Nutzung:
[testdata/README.md](testdata/README.md). Den vollständigen Vorführablauf mit
erwarteten Kennzahlen enthält die Phase-4-Spezifikation.

`cmd/server/` enthält den Einstieg, `internal/domain/` das Datenmodell,
`internal/store/` den Speicher, `internal/handler/` die HTTP-Oberfläche und
`web/` die eingebetteten HTML-/CSS-/JavaScript-Dateien. Tests liegen neben dem Go-Code.
`testdata/` enthält synthetische Prüfdaten.
Nach Änderungen an eingebetteten Dateien den Server neu starten.

Die Verfassung liegt unter `specs/`; Details und Prüfnachweis zu Phase 0 stehen
in [specs/00-projektgeruest.md](specs/00-projektgeruest.md); Phase 1 ist in
[specs/01-verwaltung.md](specs/01-verwaltung.md) beschrieben. Phase 2 steht in
[specs/02-ausleihe.md](specs/02-ausleihe.md); Phase 3 mit Prüfnachweis und
Abnahmeliste in [specs/03-dashboard.md](specs/03-dashboard.md).
Die browserseitige Abschlussprüfung von Phase 4 erfolgte in Chrome auf dem
Desktop. Die in Phase 3 geprüfte mobile Darstellung und Tastaturbedienung bleiben
dokumentiert; ein eigener Screenreader- oder Gerätetest ist nicht erfolgt.

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

### Buchung, Ausgabe und Rückgabe bedienen (Phase 5)

Im Normalmodus zuerst unter **Tarife verwalten** die gemeinsame Tarifstaffel
hinterlegen. Gesamtpreise gelten für 1 bis N Kalendertage; danach werden
Zusatztage zum letzten Gesamtpreis addiert. EUR-Beträge können mit Komma oder
Punkt und höchstens zwei Nachkommastellen eingegeben werden. Der Demomodus lädt
25/45/60 EUR für 1/2/3 Tage und 15 EUR je Zusatztag. Auch Tarife sind flüchtig.
Tarifänderungen wirken ausschließlich auf neue Buchungen. Bei gleichzeitiger
Bearbeitung muss der inzwischen geänderte Tarif neu geladen werden.

Unter **Neue Ausleihe** eine Person, Beginn (heute oder später) und geplante
Rückgabe wählen. Beide Kalendertage zählen: Montag bis Mittwoch sind drei Tage.
Maßgeblich ist Europe/Vienna. **Verfügbarkeit und Preis prüfen** lädt die für den
Zeitraum freien Paare und den Gesamtpreis. Ein Paar auswählen. Bei Beginn heute **Buchen und ausgeben** für die sofortige
Übergabe oder **Nur buchen** für eine Reservierung drücken. Bei zukünftigem Beginn
steht **Buchen** zur Verfügung. Alle Buchungsbuttons bestätigen den angezeigten Preis. Nach Datumsänderungen muss erneut geprüft werden. Ändert
sich der Tarif vor dem Speichern, wird der neue Preis angezeigt und muss erneut
bestätigt werden. Aus dem Personendetail und direkt nach Registrierung führt
**Ski ausleihen** weiterhin zum Formular mit vorausgewählter Person.

Eine reine Buchung reserviert das Paar, zählt aber noch nicht als tatsächliche Ausgabe.
**Buchen und ausgeben** speichert Buchung und Übergabe gemeinsam und zählt sofort
als ausgeliehen. Bei Fehlern, etwa einem noch nicht zurückgegebenen Paar, wird
keine Buchung gespeichert. Maßgeblich für „heute“ ist Europe/Vienna.
Bei einer reinen Buchung erfasst unter **Gebuchte Ausleihen** **Ski ausgeben** die Übergabe innerhalb des
gebuchten Zeitraums. **Rückgabe erfassen** beendet die tatsächliche Ausleihe.
Geplantes Ende und Tageswechsel lösen keine automatische Ausgabe/Rückgabe aus.
Wiederholte Aktionen verändern die ursprünglichen Zeitpunkte nicht. Eine Person
kann weiterhin mehrere unterschiedliche Paare ausleihen.

Offene Buchungen eines Paars dürfen sich nicht überschneiden; beide Randtage
sind belegt. Folgebuchungen ab dem nächsten Tag sind auch möglich, solange das
Paar noch ausgegeben ist. Eine verspätete Rückgabe sperrt deren Ausgabe bis zur
tatsächlichen Rückgabe. Überfällige Ausleihen werden markiert. Nicht ausgegebene
Buchungen nach dem Enddatum erscheinen als abgelaufen. Buchungen lassen sich vor
der Ausgabe stornieren; Korrekturen erfolgen durch Stornierung und Neubuchung.
Abgeschlossene und stornierte Vorgänge bleiben im Verlauf erhalten. Der vereinbarte
Preis bleibt bei früher/später Rückgabe und späterer Ausgabe unverändert.

**Abbrechen** öffnet die Übersicht und verwirft die Eingaben. **Aktualisieren**
lädt aktuelle Vorgänge und setzt die Vorschau zurück. Bei Konflikten werden die
verfügbaren Paare und der Preis erneut geprüft. Andere Tabs verwenden weiterhin
**Aktualisieren**; das Dashboard aktualisiert sich automatisch. Ausweisnachweise
werden in Buchungsübersichten nicht angezeigt. Die Oberfläche benötigt JavaScript.

Es gibt keine Zahlungen, Rechnungen, Rabatte oder dauerhafte Speicherung.
Schnittstellen, Regeln und Prüfnachweis: [Phase 5](specs/05-termine-preise.md).

### Dashboard und Bedienung

Die Startseite zeigt verfügbare und ausgeliehene Ski-Paare, Gesamtbestand und
registrierte Personen. Verfügbare plus ausgeliehene Paare ergeben den Gesamtbestand.
Nur tatsächlich ausgegebene, noch nicht zurückgegebene Paare zählen als
ausgeliehen. Bloße Buchungen ändern die vier Kennzahlen nicht. Die Kennzahl
„Verfügbare Ski“ bezeichnet aktuell nicht ausgegebene Paare; terminbezogene
Verfügbarkeit steht im Buchungsformular.

Der Server liefert die Zahlen bereits beim Öffnen. Mit JavaScript werden sie
sofort, alle 5 Sekunden nach der letzten Abfrage und bei Rückkehr zum Tab/Fenster
aktualisiert. In verborgenen Tabs pausieren Abfragen. Der Status nennt den letzten
Aktualisierungszeitpunkt; **Jetzt aktualisieren** lädt die Zahlen zusätzlich neu.
Bei Verbindungsfehlern bleiben die letzten Zahlen mit einem Veraltet-Hinweis
sichtbar. Sobald der Server wieder erreichbar ist, erholt sich die Anzeige
automatisch. Ohne JavaScript stehen die Zahlen vom Öffnen der Seite zur Verfügung.

Die drei Schnellzugriffe führen zur jeweiligen Verwaltung beziehungsweise zur
Ausleihe. Tabulator, Umschalt+Tabulator, Pfeiltasten und Eingabetaste bedienen Links,
Formulare und Auswahlfelder. „Zum Inhalt“ überspringt die Navigation; Fehler,
Speicherbestätigungen und neue Detailansichten erhalten den passenden Fokus.

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
