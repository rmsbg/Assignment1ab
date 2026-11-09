# Codex conversation

## User

starte den server

## Assistant

Ich prüfe den Startbefehl im Projekt und starte den Server.

## Activity

    $ pwd; rg --files -g 'README*' -g 'go.mod' -g 'AGENTS.md' -g 'main.go' -g 'package.json'
    /Users/michael/Documents/Uni/_08_WS26_27/VO Software Engineering/Assignment1/Assignment1ab
    AGENTS.md
    README.md
    go.mod
    testdata/README.md
    cmd/server/main.go
    ✓ • 0ms

## Activity

    $ cat README.md
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
    Zeitraum freien Paare und den Gesamtpreis. Ein Paar auswählen und **Zum angezeigten
    Preis buchen** drücken. Nach Datumsänderungen muss erneut geprüft werden. Ändert
    sich der Tarif vor dem Speichern, wird der neue Preis angezeigt und muss erneut
    bestätigt werden. Aus dem Personendetail und direkt nach Registrierung führt
    **Ski ausleihen** weiterhin zum Formular mit vorausgewählter Person.
    
    Die Buchung reserviert das Paar, zählt aber noch nicht als tatsächliche Ausgabe.
    Unter **Gebuchte Ausleihen** erfasst **Ski ausgeben** die Übergabe innerhalb des
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
    ✓ • 0ms

## Activity

    $ env GOCACHE=/private/tmp/skirental-go-cache /private/tmp/skirental-toolchain/go/bin/go run ./cmd/server
    env: /private/tmp/skirental-toolchain/go/bin/go: No such file or directory
    ✗ (127) • 0ms

## Activity

    $ command -v go; ls bin; cat go.mod; sed -n '1,120p' cmd/server/main.go
    ls: bin: No such file or directory
    module skirental
    
    go 1.27.3
    package main
    
    import (
        "context"
        "errors"
        "flag"
        "fmt"
        "log"
        "net"
        "net/http"
        "os"
        "os/signal"
        "syscall"
        "time"
    
        "skirental/internal/handler"
        "skirental/internal/store"
    )
    
    func main() {
        demo := flag.Bool("demo", false, "Synthetische Beispieldaten laden")
        flag.Parse()
        if flag.NArg() != 0 {
            log.Fatal("Unbekannte Argumente. Verwendung: go run ./cmd/server [-demo]")
        }
        ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
        defer stop()
        if err := run(ctx, *demo); err != nil {
            log.Fatal(err)
        }
    }
    
    func run(ctx context.Context, demo bool) error {
        app, err := handler.New(store.New(demo))
        if err != nil {
            return err
        }
        listener, err := net.Listen("tcp", "127.0.0.1:8080")
        if err != nil {
            return fmt.Errorf("Server starten: %w", err)
        }
        server := &http.Server{
            Handler: app, ReadHeaderTimeout: 5 * time.Second,
            ReadTimeout: 15 * time.Second, WriteTimeout: 15 * time.Second,
            IdleTimeout: 60 * time.Second,
        }
        done := make(chan error, 1)
        go func() { done <- server.Serve(listener) }()
        log.Printf("SkiRental: http://127.0.0.1:8080 (Demomodus: %t). Beenden mit Ctrl+C.", demo)
        select {
        case err := <-done:
            if !errors.Is(err, http.ErrServerClosed) {
                return fmt.Errorf("HTTP-Server: %w", err)
            }
            return nil
        case <-ctx.Done():
            shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
            defer cancel()
            if err := server.Shutdown(shutdownCtx); err != nil {
                _ = server.Close()
                return fmt.Errorf("Server beenden: %w", err)
            }
            return nil
        }
    }
    ✓ • 0ms

## Activity

    $ ls /private/tmp; ls /opt/homebrew/bin/go /usr/local/go/bin/go /Users/michael/sdk
    Visual Studio Code-60076bee-7da1-4d31-aa1e-f56c0c007e6b.sock
    codex-daemon-501
    com.apple.launchd.zQIpqkWJFM
    powerlog
    ls: /Users/michael/sdk: No such file or directory
    ls: /opt/homebrew/bin/go: No such file or directory
    ls: /usr/local/go/bin/go: No such file or directory
    ✗ (1) • 0ms

## Assistant

Die im README angegebene temporäre Go-Installation ist nicht mehr vorhanden. Ich lade die benötigte Toolchain erneut und starte anschließend den Server.

## Activity

    $ curl -L --fail https://go.dev/dl/go1.27.3.darwin-arm64.tar.gz -o /private/tmp/skirental-go.tar.gz
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    
    
    ✓ • 10.95s

## Activity

    $ mkdir -p /private/tmp/skirental-toolchain
         tar -xzf /private/tmp/skirental-go.tar.gz -C /private/tmp/skirental-toolchain
    ✓ • 1.60s

## Activity

    $ curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080
    200
    ✓ • 0ms

## Assistant

Der Server läuft unter [http://127.0.0.1:8080](http://127.0.0.1:8080) im Normalmodus ohne Demodaten. Erreichbarkeit geprüft: HTTP 200.

## Activity

    $ env GOCACHE=/private/tmp/skirental-go-cache /private/tmp/skirental-toolchain/go/bin/go run ./cmd/server
    2026/10/22 18:38:17 SkiRental: http://127.0.0.1:8080 (Demomodus: false). Beenden mit Ctrl+C.
    ✗ (1) • 3m 27s

## User

starte den server im demomodus

## Assistant

Ich starte den Server mit Beispieldaten neu. Dabei wird der bisherige flüchtige Datenbestand zurückgesetzt.

## Activity

    $ curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080
    200
    ✓ • 0ms

## Assistant

Der Server läuft im Demomodus unter [http://127.0.0.1:8080](http://127.0.0.1:8080). Bitte die Browserseite neu laden.

## Activity

    $ env GOCACHE=/private/tmp/skirental-go-cache /private/tmp/skirental-toolchain/go/bin/go run ./cmd/server -demo
    2026/10/22 18:41:44 SkiRental: http://127.0.0.1:8080 (Demomodus: true). Beenden mit Ctrl+C.
    ✗ (1) • 9m 50s

## User

die ausleihe funktioniert noch nicht ideal: wenn man eine buchung für den aktuellen tag ausgibt, soll es die möglichkeit geben, den ski gleich auch auszugeben. ansonsten kann es leicht passieren, dass die mitarbeiter die buchung beim verleihvorgang zwar ausgeben, aber dann vergessen, auch auf "ski ausgeben" zu klicken. beispielsweise mit einem popup-fenster mit 2 buttons ("buchen und ausgeben" und "nur buchen"). gerne auch eine andere lösung, die sich leicht implementieren lässt.

## Assistant

Ich schaue mir den Buchungsablauf und die Ausgabe an, um eine einfache Lösung für Buchungen mit Beginn heute zu planen.

## Activity

    $ rg -n 'Zum angezeigten|Ski ausgeben|issue|checkout|dispatch|book' web internal/handler internal/store internal/domain
    internal/handler/acceptance_test.go:107:                input := []byte(bookingBody(person.ID, ski.ID, 1))
    internal/handler/acceptance_test.go:118:                    return issueHTTP(t, app, rental.ID)
    web/assets/ausleihe.js:32: const stateNames={booked:'Gebucht',expired:'Abgelaufen · nicht ausgegeben',issued:'Ausgegeben',returned:'Zurückgegeben',cancelled:'Storniert'};
    web/assets/ausleihe.js:35:  return `<ul class="rental-list">${list.map(r=>`<li class="rental-card"><p class="record-id">${esc(r.id)}</p><h3>${esc(r.skiName)}</h3><p>Ski-ID: ${esc(r.skiID)}<br>Person: <a href="/personen#${encodeURIComponent(r.personID)}">${esc(r.personName)}</a> · ${esc(r.personID)}</p><p>${calendar(r.startsOn)} – ${calendar(r.endsOn)} · ${r.durationDays} ${r.durationDays===1?'Tag':'Tage'}<br><strong>Vereinbarter Preis: ${money(r.totalPriceCents)}</strong></p><p>Gebucht: ${date(r.createdAt)}${r.rentedAt?`<br>Ausgegeben: ${date(r.rentedAt)}`:''}${r.returnedAt?`<br>Zurückgegeben: ${date(r.returnedAt)}`:''}${r.cancelledAt?`<br>Storniert: ${date(r.cancelledAt)}`:''}</p><span class="returned-badge ${r.overdue?'overdue':''}">${esc(stateNames[r.status])}${r.overdue?' · Überfällig':''}</span><div class="actions">${r.status==='booked'&&r.startsOn<=today()?`<button data-action="ausgabe" data-id="${esc(r.id)}">Ski ausgeben</button>`:''}${r.status==='booked'||r.status==='expired'?`<button class="secondary" data-action="stornierung" data-id="${esc(r.id)}">Buchung stornieren</button>`:''}${r.status==='issued'?`<button data-action="rueckgabe" data-id="${esc(r.id)}">Rückgabe erfassen</button>`:''}</div></li>`).join('')}</ul>`;
    web/assets/ausleihe.js:44:   content.innerHTML=`<div class="section-heading"><h2>${overview?'Buchungen, Ausgabe und Rückgabe':'Ausleihe buchen'}</h2><div class="actions compact"><button class="secondary" id="refresh-rentals">Aktualisieren</button>${overview?'<a class="button" href="#neu">Neue Ausleihe</a>':''}</div></div><p id="rental-error" class="field-error" role="alert" tabindex="-1"></p>${!overview?`<form id="rental-form" class="record-panel" novalidate><p>Beginn und geplante Rückgabe zählen beide als Verleihtag. Nach der Buchung die tatsächliche Ausgabe separat erfassen.</p>${!people.length?'<p>Noch keine Personen vorhanden. <a href="/personen#neu">Person anlegen</a></p>':''}${!tariff.version?'<p class="field-error">Noch kein Tarif eingerichtet. <a href="/tarife">Tarife verwalten</a></p>':''}${field('personID','Person (Pflichtfeld)',`<select id="personID" aria-describedby="rental-error-personID"><option value="">Bitte Person wählen</option>${options(people)}</select>`)}<div class="date-fields">${field('startsOn','Verleihbeginn (Pflichtfeld)',`<input type="date" id="startsOn" min="${today()}" value="${esc(saved.startsOn)}" aria-describedby="rental-error-startsOn">`)}${field('endsOn','Geplante Rückgabe (Pflichtfeld)',`<input type="date" id="endsOn" min="${today()}" value="${esc(saved.endsOn)}" aria-describedby="rental-error-endsOn">`)}</div><button type="button" class="secondary" id="check-period" ${!tariff.version?'disabled':''}>Verfügbarkeit und Preis prüfen</button><p id="price-preview" role="status">Bitte den Zeitraum prüfen.</p>${field('skiID','Verfügbares Ski-Paar im Zeitraum (Pflichtfeld)','<select id="skiID" disabled aria-describedby="rental-error-skiID"><option value="">Bitte zuerst Zeitraum prüfen</option></select>')}<p id="no-skis" hidden>Keine Paare im Zeitraum verfügbar. Einen anderen Zeitraum wählen, eine Rückgabe erfassen oder <a href="/ski#neu">ein Ski-Paar anlegen</a>.</p><div class="actions"><button type="submit" disabled>Zum angezeigten Preis buchen</button><a class="button secondary" href="#uebersicht">Abbrechen</a></div></form>`:''}${[['Gebuchte Ausleihen',['booked','expired']],['Ausgegebene Ausleihen',['issued']],['Abgeschlossene Ausleihen',['returned']],['Stornierte Buchungen',['cancelled']]].map(([title,statuses],i)=>`<section class="rental-section" aria-labelledby="rental-title-${i}"><h2 id="rental-title-${i}">${title}</h2>${rentalList(rentals.filter(r=>statuses.includes(r.status)))}</section>`).join('')}`;
    internal/domain/rental_test.go:20:        t.Fatal("booking counted as issued")
    internal/domain/rental_test.go:24:        t.Fatal("issued rental inactive")
    internal/handler/dashboard_test.go:81:    body := bookingBody("demo-person-01", "demo-ski-01", 1)
    internal/handler/dashboard_test.go:85:    issueHTTP(t, app, rental.ID)
    internal/domain/rental.go:22:// BlocksPeriod remains true for issued rentals until actual return.
    internal/domain/rental.go:33:        return "issued"
    internal/domain/rental.go:38:    return "booked"
    internal/handler/phase5_helpers_test.go:11:func bookingBody(person, ski string, version uint64) string {
    internal/handler/phase5_helpers_test.go:16:func issueHTTP(t *testing.T, app http.Handler, id string) rentalResponse {
    internal/handler/rental_test.go:22:    body := bookingBody("demo-person-01", "demo-ski-01", 1)
    internal/handler/rental_test.go:59:    issueHTTP(t, app, rental.ID)
    internal/handler/rental_test.go:69:    issueHTTP(t, app, secondRental.ID)
    internal/handler/rental_test.go:87:    issueHTTP(t, app, replacementRental.ID)
    internal/handler/rental_test.go:115:            r := httptest.NewRequest(http.MethodPost, "/api/ausleihen", strings.NewReader(bookingBody("demo-person-01", "demo-ski-01", 1)))
    internal/domain/models.go:24:// Rental separates the agreed calendar period from actual issue and return.
    internal/store/phase5_helpers_test.go:5:// Preserve the original lifecycle scenarios using the new book-then-issue workflow.
    internal/store/booking_test.go:18:func book(t *testing.T, s *Store, ski, start, end string) RentalDetails {
    internal/store/booking_test.go:28:    first := book(t, s, "demo-ski-01", "2026-10-21", "2026-10-23")
    internal/store/booking_test.go:29:    if first.Rental.Active() || first.Rental.TotalPriceCents != 6000 || first.Rental.Status(first.Today) != "booked" {
    internal/store/booking_test.go:30:        t.Fatal("wrong booking")
    internal/store/booking_test.go:47:        t.Fatal("return before issue accepted")
    internal/store/booking_test.go:49:    issued, err := s.IssueRental(first.Rental.ID)
    internal/store/booking_test.go:50:    if err != nil || !issued.Rental.Active() {
    internal/store/booking_test.go:54:    if err != nil || !issued.Rental.RentedAt.Equal(repeated.Rental.RentedAt) {
    internal/store/booking_test.go:55:        t.Fatal("issue is not idempotent")
    internal/store/booking_test.go:58:        t.Fatal("issued booking cancelled")
    internal/store/booking_test.go:61:    next := book(t, s, "demo-ski-01", "2026-10-24", "2026-10-25")
    internal/store/booking_test.go:63:        t.Fatal("early issue accepted")
    internal/store/booking_test.go:68:        t.Fatal("late predecessor did not block issue")
    internal/store/booking_test.go:80:        t.Fatal("old return released new issue")
    internal/store/booking_test.go:85:        t.Fatal("repeated issue after return changed timestamp")
    internal/store/booking_test.go:90:    r := book(t, s, "demo-ski-01", "2026-10-21", "2026-10-22")
    internal/store/booking_test.go:100:        t.Fatal("cancelled booking issued")
    internal/store/booking_test.go:102:    replacement := book(t, s, "demo-ski-01", "2026-10-21", "2026-10-22")
    internal/store/booking_test.go:110:    expired := book(t, s, "demo-ski-01", "2026-10-21", "2026-10-21")
    internal/store/booking_test.go:114:        t.Fatal("booking did not expire")
    internal/store/booking_test.go:117:        t.Fatal("expired booking issued")
    internal/store/booking_test.go:125:    r := book(t, s, "demo-ski-01", "2026-10-21", "2026-10-24")
    internal/store/booking_test.go:259:        t.Fatal("lost bookings")
    internal/handler/booking_test.go:56:    body := bookingBody("demo-person-01", "demo-ski-01", 1)
    internal/handler/booking_test.go:58:    var booked rentalResponse
    internal/handler/booking_test.go:59:    _ = json.Unmarshal(created.Body.Bytes(), &booked)
    internal/handler/booking_test.go:60:    if booked.Status != "booked" || booked.RentedAt != nil || booked.TotalPriceCents != 2500 || booked.DurationDays != 1 {
    internal/handler/booking_test.go:61:        t.Fatal("wrong booked response")
    internal/handler/booking_test.go:64:        t.Fatal("booking counted as issue")
    internal/handler/booking_test.go:72:    unissued := call(t, app, "GET", "/api/ski/verfuegbar", "", nil, 200)
    internal/handler/booking_test.go:73:    if !strings.Contains(unissued.Body.String(), "demo-ski-01") {
    internal/handler/booking_test.go:76:    path := "/api/ausleihen/" + booked.ID
    internal/handler/booking_test.go:90:    _ = json.Unmarshal(created.Body.Bytes(), &booked)
    internal/handler/booking_test.go:91:    path = "/api/ausleihen/" + booked.ID
    internal/handler/booking_test.go:92:    issued := issueHTTP(t, app, booked.ID)
    internal/handler/booking_test.go:93:    if issued.Status != "issued" || issued.RentedAt == nil || s.Dashboard().RentedSkis != 1 {
    internal/handler/booking_test.go:94:        t.Fatal("wrong issue state")
    internal/handler/booking_test.go:96:    repeat := issueHTTP(t, app, booked.ID)
    internal/handler/booking_test.go:97:    if !reflect.DeepEqual(issued, repeat) {
    internal/handler/booking_test.go:98:        t.Fatal("issue changed timestamp")
    internal/handler/booking_test.go:102:    staleBody := bookingBody("demo-person-01", "demo-ski-02", 1)
    internal/handler/booking_test.go:112:        t.Fatal("return changed booked price")
    internal/handler/booking_test.go:117:    // A future booking can be cancelled, but never issued before its first date.
    ✓ • 0ms

## Activity

    $ cat web/assets/ausleihe.js; cat internal/store/rentals.go; cat internal/handler/rental.go
    'use strict';
    (() => {
     if (!document.querySelector('#ausleihe')) return;
     const content=document.querySelector('#rental-content'),message=document.querySelector('#rental-message');
     const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
     const money=value=>new Intl.NumberFormat('de-AT').format(BigInt(value)/100n)+','+(BigInt(value)%100n).toString().padStart(2,'0')+' €';
     const date=value=>value?esc(new Date(value).toLocaleString('de-AT')):'';
     const calendar=value=>esc(value.split('-').reverse().join('.'));
     const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Vienna',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
     const initialPerson=new URLSearchParams(location.search).get('person')||'';
     let generation=0;
     document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();document.querySelector('main').focus();});
     async function request(url,options) {
      const response=await fetch(url,{cache:'no-store',...options});const result=await response.json();
      if(!response.ok)throw {errors:result.errors,status:response.status};return result;
     }
     const post=(url,data)=>request(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
     function notice(text){message.textContent=text;message.className=text?'success':'';}
     function showErrors(error){
      content.querySelectorAll('.field-error').forEach(el=>el.textContent='');
      content.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
      const errors=error.errors||{form:'Die Verbindung ist fehlgeschlagen. Bitte erneut versuchen.'};
      const summary=content.querySelector('#rental-error');summary.textContent=Object.values(errors).join(' ');
      for(const [key,text]of Object.entries(errors)){
       const field=document.getElementById('rental-error-'+key);if(field)field.textContent=text;
       document.getElementById(key)?.setAttribute('aria-invalid','true');
      }
      summary.focus();
     }
     const field=(id,label,input)=>`<div class="field"><label for="${id}">${label}</label>${input}<small class="field-error" id="rental-error-${id}"></small></div>`;
     const options=list=>list.map(v=>`<option value="${esc(v.id)}">${esc(v.name)} · ${esc(v.id)}</option>`).join('');
     const stateNames={booked:'Gebucht',expired:'Abgelaufen · nicht ausgegeben',issued:'Ausgegeben',returned:'Zurückgegeben',cancelled:'Storniert'};
     function rentalList(list){
      if(!list.length)return '<p>Noch keine Einträge.</p>';
      return `<ul class="rental-list">${list.map(r=>`<li class="rental-card"><p class="record-id">${esc(r.id)}</p><h3>${esc(r.skiName)}</h3><p>Ski-ID: ${esc(r.skiID)}<br>Person: <a href="/personen#${encodeURIComponent(r.personID)}">${esc(r.personName)}</a> · ${esc(r.personID)}</p><p>${calendar(r.startsOn)} – ${calendar(r.endsOn)} · ${r.durationDays} ${r.durationDays===1?'Tag':'Tage'}<br><strong>Vereinbarter Preis: ${money(r.totalPriceCents)}</strong></p><p>Gebucht: ${date(r.createdAt)}${r.rentedAt?`<br>Ausgegeben: ${date(r.rentedAt)}`:''}${r.returnedAt?`<br>Zurückgegeben: ${date(r.returnedAt)}`:''}${r.cancelledAt?`<br>Storniert: ${date(r.cancelledAt)}`:''}</p><span class="returned-badge ${r.overdue?'overdue':''}">${esc(stateNames[r.status])}${r.overdue?' · Überfällig':''}</span><div class="actions">${r.status==='booked'&&r.startsOn<=today()?`<button data-action="ausgabe" data-id="${esc(r.id)}">Ski ausgeben</button>`:''}${r.status==='booked'||r.status==='expired'?`<button class="secondary" data-action="stornierung" data-id="${esc(r.id)}">Buchung stornieren</button>`:''}${r.status==='issued'?`<button data-action="rueckgabe" data-id="${esc(r.id)}">Rückgabe erfassen</button>`:''}</div></li>`).join('')}</ul>`;
     }
     function headingFocus(){const h=content.querySelector('h2');if(h){h.tabIndex=-1;h.focus();}}
     async function render(saved={personID:initialPerson,startsOn:today(),endsOn:today()}){
      const own=++generation;content.innerHTML='<p>Ausleihen werden geladen …</p>';
      try{
       const [people,rentals,tariff]=await Promise.all([request('/api/personen'),request('/api/ausleihen'),request('/api/tarife')]);
       if(own!==generation)return;
       const overview=location.hash==='#uebersicht';
       content.innerHTML=`<div class="section-heading"><h2>${overview?'Buchungen, Ausgabe und Rückgabe':'Ausleihe buchen'}</h2><div class="actions compact"><button class="secondary" id="refresh-rentals">Aktualisieren</button>${overview?'<a class="button" href="#neu">Neue Ausleihe</a>':''}</div></div><p id="rental-error" class="field-error" role="alert" tabindex="-1"></p>${!overview?`<form id="rental-form" class="record-panel" novalidate><p>Beginn und geplante Rückgabe zählen beide als Verleihtag. Nach der Buchung die tatsächliche Ausgabe separat erfassen.</p>${!people.length?'<p>Noch keine Personen vorhanden. <a href="/personen#neu">Person anlegen</a></p>':''}${!tariff.version?'<p class="field-error">Noch kein Tarif eingerichtet. <a href="/tarife">Tarife verwalten</a></p>':''}${field('personID','Person (Pflichtfeld)',`<select id="personID" aria-describedby="rental-error-personID"><option value="">Bitte Person wählen</option>${options(people)}</select>`)}<div class="date-fields">${field('startsOn','Verleihbeginn (Pflichtfeld)',`<input type="date" id="startsOn" min="${today()}" value="${esc(saved.startsOn)}" aria-describedby="rental-error-startsOn">`)}${field('endsOn','Geplante Rückgabe (Pflichtfeld)',`<input type="date" id="endsOn" min="${today()}" value="${esc(saved.endsOn)}" aria-describedby="rental-error-endsOn">`)}</div><button type="button" class="secondary" id="check-period" ${!tariff.version?'disabled':''}>Verfügbarkeit und Preis prüfen</button><p id="price-preview" role="status">Bitte den Zeitraum prüfen.</p>${field('skiID','Verfügbares Ski-Paar im Zeitraum (Pflichtfeld)','<select id="skiID" disabled aria-describedby="rental-error-skiID"><option value="">Bitte zuerst Zeitraum prüfen</option></select>')}<p id="no-skis" hidden>Keine Paare im Zeitraum verfügbar. Einen anderen Zeitraum wählen, eine Rückgabe erfassen oder <a href="/ski#neu">ein Ski-Paar anlegen</a>.</p><div class="actions"><button type="submit" disabled>Zum angezeigten Preis buchen</button><a class="button secondary" href="#uebersicht">Abbrechen</a></div></form>`:''}${[['Gebuchte Ausleihen',['booked','expired']],['Ausgegebene Ausleihen',['issued']],['Abgeschlossene Ausleihen',['returned']],['Stornierte Buchungen',['cancelled']]].map(([title,statuses],i)=>`<section class="rental-section" aria-labelledby="rental-title-${i}"><h2 id="rental-title-${i}">${title}</h2>${rentalList(rentals.filter(r=>statuses.includes(r.status)))}</section>`).join('')}`;
       const form=content.querySelector('#rental-form');let quote=null,previewGeneration=0;
       const values=()=>form?{personID:document.querySelector('#personID').value,startsOn:document.querySelector('#startsOn').value,endsOn:document.querySelector('#endsOn').value}:saved;
       if(form){
        const person=form.querySelector('#personID'),ski=form.querySelector('#skiID'),submit=form.querySelector('[type="submit"]'),check=form.querySelector('#check-period'),preview=form.querySelector('#price-preview');
        person.value=people.some(p=>p.id===saved.personID)?saved.personID:'';
        if(saved.personID&&!person.value)showErrors({errors:{personID:'Die vorausgewählte Person wurde nicht gefunden. Bitte eine vorhandene Person auswählen.'}});
        function invalidate(){quote=null;previewGeneration++;ski.innerHTML='<option value="">Bitte zuerst Zeitraum prüfen</option>';ski.disabled=true;submit.disabled=true;check.disabled=!tariff.version;form.querySelector('#no-skis').hidden=true;preview.textContent='Zeitraum geändert. Bitte Verfügbarkeit und Preis erneut prüfen.';}
        for(const id of ['startsOn','endsOn'])form.querySelector('#'+id).addEventListener('input',invalidate);
        async function loadPreview(){
         const attempt=++previewGeneration;quote=null;submit.disabled=true;ski.disabled=true;check.disabled=true;preview.textContent='Verfügbarkeit und Preis werden geprüft …';
         const selected=values();
         try{
          const [price,pairs]=await Promise.all([post('/api/ausleihen/preis',{startsOn:selected.startsOn,endsOn:selected.endsOn}),request('/api/ski/verfuegbar?'+new URLSearchParams({startsOn:selected.startsOn,endsOn:selected.endsOn}))]);
          if(own!==generation||attempt!==previewGeneration)return;
          quote=price;form.querySelector('#no-skis').hidden=!!pairs.length;ski.innerHTML='<option value="">Bitte Ski-Paar wählen</option>'+options(pairs);ski.disabled=!pairs.length;
          preview.textContent=`${price.durationDays} ${price.durationDays===1?'Tag':'Tage'} · Gesamtpreis ${money(price.totalPriceCents)}${pairs.length?'':'. Keine Ski-Paare im Zeitraum verfügbar.'}`;
          submit.disabled=!pairs.length||!people.length;
         }catch(error){if(own!==generation||attempt!==previewGeneration)return;preview.textContent='Der Zeitraum konnte nicht geprüft werden.';showErrors(error);}
         finally{if(own===generation&&attempt===previewGeneration)check.disabled=false;}
        }
        check.addEventListener('click',loadPreview);
        form.addEventListener('submit',async event=>{
         event.preventDefault();if(!quote)return;
         const current=values();submit.disabled=true;
         try{
          await post('/api/ausleihen',{...current,skiID:ski.value,tariffVersion:quote.tariffVersion});
          if(own!==generation)return;notice('Buchung gespeichert. Die tatsächliche Ausgabe bitte separat erfassen.');await render(current);message.focus();
         }catch(error){
          if(own!==generation)return;
          if(error.status===409){await loadPreview();if(own!==generation)return;}
          else submit.disabled=!quote;
          showErrors(error);
         }
        });
       }
       content.querySelector('#refresh-rentals').addEventListener('click',()=>{notice('');render(values()).then(headingFocus);});
       content.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',async()=>{
        button.disabled=true;
        try{
         await request('/api/ausleihen/'+encodeURIComponent(button.dataset.id)+'/'+button.dataset.action,{method:'PUT'});
         if(own!==generation)return;
         notice({ausgabe:'Ausgabe gespeichert.',rueckgabe:'Rückgabe gespeichert.',stornierung:'Buchung storniert.'}[button.dataset.action]);
         await render(values());message.focus();
        }catch(error){if(own!==generation)return;showErrors(error);button.disabled=false;}
       }));
      }catch(error){
       if(own!==generation)return;
       content.innerHTML='<p id="rental-error" class="field-error" role="alert" tabindex="-1"></p><button id="retry-rentals">Erneut laden</button>';
       showErrors(error);content.querySelector('#retry-rentals').addEventListener('click',()=>render(saved));
      }
     }
     window.addEventListener('hashchange',()=>{notice('');render().then(headingFocus);});
     render();
    })();
    cat: internal/store/rentals.go: No such file or directory
    package handler
    
    import (
        "encoding/json"
        "errors"
        "io"
        "mime"
        "net/http"
        "time"
    
        "skirental/internal/domain"
        "skirental/internal/store"
    )
    
    type rentalResponse struct {
        ID              string     `json:"id"`
        PersonID        string     `json:"personID"`
        SkiID           string     `json:"skiID"`
        PersonName      string     `json:"personName"`
        SkiName         string     `json:"skiName"`
        CreatedAt       time.Time  `json:"createdAt"`
        StartsOn        string     `json:"startsOn"`
        EndsOn          string     `json:"endsOn"`
        DurationDays    int        `json:"durationDays"`
        TotalPriceCents int64      `json:"totalPriceCents"`
        TariffVersion   uint64     `json:"tariffVersion"`
        Status          string     `json:"status"`
        Overdue         bool       `json:"overdue"`
        RentedAt        *time.Time `json:"rentedAt"`
        ReturnedAt      *time.Time `json:"returnedAt"`
        CancelledAt     *time.Time `json:"cancelledAt"`
    }
    
    func optionalTime(t time.Time) *time.Time {
        if t.IsZero() {
            return nil
        }
        return &t
    }
    func exposeRental(d store.RentalDetails) rentalResponse {
        r := d.Rental
        return rentalResponse{ID: r.ID, PersonID: r.PersonID, SkiID: r.SkiID, PersonName: d.PersonName, SkiName: d.SkiName,
            CreatedAt: r.CreatedAt, StartsOn: r.StartsOn, EndsOn: r.EndsOn, DurationDays: r.DurationDays, TotalPriceCents: r.TotalPriceCents,
            TariffVersion: r.TariffVersion, Status: r.Status(d.Today), Overdue: r.Active() && r.EndsOn < d.Today,
            RentedAt: optionalTime(r.RentedAt), ReturnedAt: optionalTime(r.ReturnedAt), CancelledAt: optionalTime(r.CancelledAt)}
    }
    
    // readJSON bounds all writes and rejects fields the endpoint does not own.
    func readJSON(w http.ResponseWriter, r *http.Request, input any) bool {
        media, _, _ := mime.ParseMediaType(r.Header.Get("Content-Type"))
        if media != "application/json" {
            writeJSON(w, 415, map[string]any{"errors": domain.ValidationErrors{"form": "JSON erwartet."}})
            return false
        }
        r.Body = http.MaxBytesReader(w, r.Body, 64*1024)
        dec := json.NewDecoder(r.Body)
        dec.DisallowUnknownFields()
        if err := dec.Decode(input); err != nil {
            apiError(w, err)
            return false
        }
        if err := dec.Decode(new(any)); err != io.EOF {
            if err == nil {
                err = errors.New("extra JSON")
            }
            apiError(w, err)
            return false
        }
        return true
    }
    func registerRentals(mux *http.ServeMux, s *store.Store) {
        mux.HandleFunc("GET /api/tarife", func(w http.ResponseWriter, r *http.Request) { writeJSON(w, 200, s.Tariff()) })
        mux.HandleFunc("PUT /api/tarife", func(w http.ResponseWriter, r *http.Request) {
            var input struct {
                Version       *uint64  `json:"version"`
                PricesCents   []*int64 `json:"pricesCents"`
                ExtraDayCents *int64   `json:"extraDayCents"`
            }
            if !readJSON(w, r, &input) {
                return
            }
            if input.Version == nil || input.ExtraDayCents == nil {
                apiError(w, domain.ValidationErrors{"form": "Tarifversion und Zusatztagspreis sind erforderlich."})
                return
            }
            tariff := domain.Tariff{Version: *input.Version, ExtraDayCents: *input.ExtraDayCents}
            for _, price := range input.PricesCents {
                if price == nil {
                    apiError(w, domain.ValidationErrors{"pricesCents": "Jeder Tagespreis muss eine ganze Centzahl sein."})
                    return
                }
                tariff.PricesCents = append(tariff.PricesCents, *price)
            }
            result, err := s.SaveTariff(tariff)
            if err != nil {
                apiError(w, err)
                return
            }
            writeJSON(w, 200, result)
        })
        mux.HandleFunc("POST /api/ausleihen/preis", func(w http.ResponseWriter, r *http.Request) {
            var input struct {
                StartsOn string `json:"startsOn"`
                EndsOn   string `json:"endsOn"`
            }
            if !readJSON(w, r, &input) {
                return
            }
            result, err := s.Quote(input.StartsOn, input.EndsOn)
            if err != nil {
                apiError(w, err)
                return
            }
            writeJSON(w, 200, result)
        })
        mux.HandleFunc("GET /api/ski/verfuegbar", func(w http.ResponseWriter, r *http.Request) {
            q := r.URL.Query()
            if q.Has("startsOn") || q.Has("endsOn") {
                result, err := s.AvailableFor(q.Get("startsOn"), q.Get("endsOn"))
                if err != nil {
                    apiError(w, err)
                    return
                }
                writeJSON(w, 200, result)
            } else {
                writeJSON(w, 200, s.AvailableSkis())
            }
        })
        mux.HandleFunc("GET /api/ausleihen", func(w http.ResponseWriter, r *http.Request) {
            result := []rentalResponse{}
            for _, detail := range s.Rentals() {
                result = append(result, exposeRental(detail))
            }
            writeJSON(w, 200, result)
        })
        mux.HandleFunc("GET /api/ausleihen/{id}", func(w http.ResponseWriter, r *http.Request) {
            result, err := s.Rental(r.PathValue("id"))
            if err != nil {
                apiError(w, err)
                return
            }
            writeJSON(w, 200, exposeRental(result))
        })
        mux.HandleFunc("POST /api/ausleihen", func(w http.ResponseWriter, r *http.Request) {
            var input struct {
                PersonID      string  `json:"personID"`
                SkiID         string  `json:"skiID"`
                StartsOn      string  `json:"startsOn"`
                EndsOn        string  `json:"endsOn"`
                TariffVersion *uint64 `json:"tariffVersion"`
            }
            if !readJSON(w, r, &input) {
                return
            }
            if _, _, err := domain.ValidateRentalReferences(input.PersonID, input.SkiID); err != nil {
                apiError(w, err)
                return
            }
            if input.TariffVersion == nil {
                apiError(w, domain.ValidationErrors{"tariffVersion": "Bitte zuerst den Preis prüfen und bestätigen."})
                return
            }
            result, err := s.CreateRental(input.PersonID, input.SkiID, input.StartsOn, input.EndsOn, *input.TariffVersion)
            if err != nil {
                apiError(w, err)
                return
            }
            w.Header().Set("Location", "/api/ausleihen/"+result.Rental.ID)
            writeJSON(w, 201, exposeRental(result))
        })
        for action, operation := range map[string]func(string) (store.RentalDetails, error){"ausgabe": s.IssueRental, "rueckgabe": s.ReturnRental, "stornierung": s.CancelRental} {
            mux.HandleFunc("PUT /api/ausleihen/{id}/"+action, func(w http.ResponseWriter, r *http.Request) {
                body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 64*1024))
                if err != nil {
                    apiError(w, err)
                    return
                }
                if len(body) != 0 {
                    apiError(w, errors.New("unexpected action body"))
                    return
                }
                result, err := operation(r.PathValue("id"))
                if err != nil {
                    apiError(w, err)
                    return
                }
                writeJSON(w, 200, exposeRental(result))
            })
        }
    }
    ✓ • 0ms

## Assistant

Zwei direkte Buttons im Formular wären hier einfach: Bei Beginn heute erscheint „Buchen und ausgeben“ als Hauptaktion und „Nur buchen“ daneben. Für spätere Termine bleibt es bei „Buchen“. Buchung und sofortige Ausgabe würde ich gemeinsam speichern, damit bei einem Ausgabekonflikt keine ungewollte Buchung zurückbleibt.

## Activity

    $ rg -n 'func .*CreateRental|func .*IssueRental|func .*available|func .*Available|mu.Lock' internal/store; rg --files tools specs; cat internal/store/booking.go
    internal/store/pricing.go:22:    s.mu.Lock()
    internal/store/rental.go:29:func (s *Store) availablePeriodLocked(skiID, start, end string) bool {
    internal/store/rental.go:37:func (s *Store) AvailableSkis() []domain.Ski {
    internal/store/rental.go:58:func (s *Store) CreateRental(personID, skiID, start, end string, version uint64) (RentalDetails, error) {
    internal/store/rental.go:63:    s.mu.Lock()
    internal/store/rental.go:89:func (s *Store) AvailableFor(start, end string) ([]domain.Ski, error) {
    internal/store/rental.go:104:func (s *Store) IssueRental(id string) (RentalDetails, error) {
    internal/store/rental.go:105:    s.mu.Lock()
    internal/store/rental.go:131:    s.mu.Lock()
    internal/store/rental.go:147:    s.mu.Lock()
    internal/store/store.go:59:    s.mu.Lock()
    internal/store/store.go:133:    s.mu.Lock()
    internal/store/store.go:149:    s.mu.Lock()
    internal/store/store_test.go:44:    s.mu.Lock()
    rg: tools: No such file or directory (os error 2)
    specs/03-dashboard.md
    specs/02-ausleihe.md
    specs/04-mvp-abnahme.md
    specs/01-verwaltung.md
    specs/roadmap.md
    specs/tech-stack.md
    specs/05-termine-preise.md
    specs/screenshots/04-mvp-nach-rueckgaben.png
    specs/screenshots/05-tarife-mobil.png
    specs/screenshots/05-buchung-mobil.png
    specs/screenshots/05-verlauf-desktop.png
    specs/screenshots/05-uebersicht-desktop.png
    specs/screenshots/05-tarife-normal.png
    specs/screenshots/04-mvp-manuell-dashboard.png
    specs/screenshots/02-ausleihe-desktop.png
    specs/screenshots/01-personen-mobil.png
    specs/screenshots/03-dashboard-fehler.png
    specs/screenshots/03-dashboard-desktop.png
    specs/screenshots/03-dashboard-mobil.png
    specs/screenshots/05-tarifkonflikt-desktop.png
    specs/screenshots/02-ausleihe-mobil.png
    specs/screenshots/01-personen-desktop.png
    specs/screenshots/04-mvp-fotodetail.png
    specs/00-projektgeruest.md
    specs/mission.md
    cat: internal/store/booking.go: No such file or directory
    ✗ (1) • 0ms

## Activity

    $ cat internal/store/rental.go; cat internal/store/pricing.go; cat AGENTS.md
    package store
    
    import (
        "errors"
        "fmt"
        "sort"
    
        "skirental/internal/domain"
    )
    
    var ErrUnavailable = errors.New("Das Ski-Paar ist im gewählten Zeitraum bereits gebucht. Bitte ein anderes Paar oder einen anderen Zeitraum auswählen.")
    
    type MissingReference struct{ Field string }
    
    func (e MissingReference) Error() string { return "Der ausgewählte Datensatz wurde nicht gefunden." }
    func (e MissingReference) Unwrap() error { return ErrNotFound }
    
    // RentalDetails joins current names under the same lock without identity evidence.
    type RentalDetails struct {
        Today      string
        Rental     domain.Rental
        PersonName string
        SkiName    string
    }
    
    func (s *Store) rentalDetailsLocked(r domain.Rental) RentalDetails {
        return RentalDetails{Today: domain.Today(s.now()), Rental: r, PersonName: s.people[r.PersonID].Name, SkiName: s.skis[r.SkiID].Name}
    }
    func (s *Store) availablePeriodLocked(skiID, start, end string) bool {
        for _, r := range s.rentals {
            if r.SkiID == skiID && r.BlocksPeriod() && r.StartsOn <= end && start <= r.EndsOn {
                return false
            }
        }
        return true
    }
    func (s *Store) AvailableSkis() []domain.Ski {
        s.mu.RLock()
        defer s.mu.RUnlock()
        // Build once rather than scanning the rental history for every pair.
        active := make(map[string]bool)
        for _, r := range s.rentals {
            if r.Active() {
                active[r.SkiID] = true
            }
        }
        result := make([]domain.Ski, 0, len(s.skis))
        for id, ski := range s.skis {
            if !active[id] {
                result = append(result, ski)
            }
        }
        sort.Slice(result, func(i, j int) bool { return result[i].ID < result[j].ID })
        return result
    }
    
    // CreateRental validates price, references and overlap in one atomic operation.
    func (s *Store) CreateRental(personID, skiID, start, end string, version uint64) (RentalDetails, error) {
        personID, skiID, err := domain.ValidateRentalReferences(personID, skiID)
        if err != nil {
            return RentalDetails{}, err
        }
        s.mu.Lock()
        defer s.mu.Unlock()
        if _, ok := s.people[personID]; !ok {
            return RentalDetails{}, MissingReference{Field: "personID"}
        }
        if _, ok := s.skis[skiID]; !ok {
            return RentalDetails{}, MissingReference{Field: "skiID"}
        }
        quote, err := s.quoteLocked(start, end)
        if err != nil {
            return RentalDetails{}, err
        }
        if version != quote.TariffVersion {
            return RentalDetails{}, Conflict{"tariffVersion", "Der Tarif wurde geändert. Bitte den neuen Preis prüfen und erneut bestätigen."}
        }
        if !s.availablePeriodLocked(skiID, start, end) {
            return RentalDetails{}, ErrUnavailable
        }
        s.nextRental++
        r := domain.Rental{ID: fmt.Sprintf("ausleihe-%06d", s.nextRental), PersonID: personID, SkiID: skiID,
            CreatedAt: s.now().UTC(), StartsOn: start, EndsOn: end, DurationDays: quote.DurationDays,
            TotalPriceCents: quote.TotalPriceCents, TariffVersion: quote.TariffVersion}
        s.rentals[r.ID] = r
        return s.rentalDetailsLocked(r), nil
    }
    
    func (s *Store) AvailableFor(start, end string) ([]domain.Ski, error) {
        s.mu.RLock()
        defer s.mu.RUnlock()
        if _, err := domain.PeriodDays(start, end, domain.Today(s.now())); err != nil {
            return nil, err
        }
        result := []domain.Ski{}
        for id, ski := range s.skis {
            if s.availablePeriodLocked(id, start, end) {
                result = append(result, ski)
            }
        }
        sort.Slice(result, func(i, j int) bool { return result[i].ID < result[j].ID })
        return result, nil
    }
    func (s *Store) IssueRental(id string) (RentalDetails, error) {
        s.mu.Lock()
        defer s.mu.Unlock()
        r, ok := s.rentals[id]
        if !ok {
            return RentalDetails{}, ErrNotFound
        }
        if !r.CancelledAt.IsZero() {
            return RentalDetails{}, Conflict{"form", "Eine stornierte Buchung kann nicht ausgegeben werden."}
        }
        if !r.RentedAt.IsZero() {
            return s.rentalDetailsLocked(r), nil
        }
        today := domain.Today(s.now())
        if today < r.StartsOn || today > r.EndsOn {
            return RentalDetails{}, Conflict{"form", "Die Ausgabe ist nur innerhalb des gebuchten Zeitraums möglich."}
        }
        for _, other := range s.rentals {
            if other.SkiID == r.SkiID && other.Active() {
                return RentalDetails{}, Conflict{"form", "Das Ski-Paar wurde aus einer vorherigen Ausleihe noch nicht zurückgegeben."}
            }
        }
        r.RentedAt = s.now().UTC()
        s.rentals[id] = r
        return s.rentalDetailsLocked(r), nil
    }
    func (s *Store) CancelRental(id string) (RentalDetails, error) {
        s.mu.Lock()
        defer s.mu.Unlock()
        r, ok := s.rentals[id]
        if !ok {
            return RentalDetails{}, ErrNotFound
        }
        if !r.RentedAt.IsZero() {
            return RentalDetails{}, Conflict{"form", "Eine bereits ausgegebene Ausleihe kann nicht storniert werden."}
        }
        if r.CancelledAt.IsZero() {
            r.CancelledAt = s.now().UTC()
            s.rentals[id] = r
        }
        return s.rentalDetailsLocked(r), nil
    }
    func (s *Store) ReturnRental(id string) (RentalDetails, error) {
        s.mu.Lock()
        defer s.mu.Unlock()
        r, ok := s.rentals[id]
        if !ok {
            return RentalDetails{}, ErrNotFound
        }
        if r.RentedAt.IsZero() {
            return RentalDetails{}, Conflict{"form", "Eine Rückgabe ist erst nach der Ausgabe möglich."}
        }
        if r.Active() {
            r.ReturnedAt = s.now().UTC()
            s.rentals[id] = r
        }
        return s.rentalDetailsLocked(r), nil
    }
    func (s *Store) Rental(id string) (RentalDetails, error) {
        s.mu.RLock()
        defer s.mu.RUnlock()
        r, ok := s.rentals[id]
        if !ok {
            return RentalDetails{}, ErrNotFound
        }
        return s.rentalDetailsLocked(r), nil
    }
    func (s *Store) Rentals() []RentalDetails {
        s.mu.RLock()
        defer s.mu.RUnlock()
        result := make([]RentalDetails, 0, len(s.rentals))
        for _, r := range s.rentals {
            result = append(result, s.rentalDetailsLocked(r))
        }
        sort.Slice(result, func(i, j int) bool { return result[i].Rental.ID < result[j].Rental.ID })
        return result
    }
    package store
    
    import "skirental/internal/domain"
    
    type Conflict struct{ Field, Message string }
    
    func (e Conflict) Error() string { return e.Message }
    
    func cloneTariff(t domain.Tariff) domain.Tariff {
        t.PricesCents = append([]int64{}, t.PricesCents...)
        return t
    }
    func (s *Store) Tariff() domain.Tariff {
        s.mu.RLock()
        defer s.mu.RUnlock()
        return cloneTariff(s.tariff)
    }
    func (s *Store) SaveTariff(t domain.Tariff) (domain.Tariff, error) {
        if err := t.Validate(); err != nil {
            return domain.Tariff{}, err
        }
        s.mu.Lock()
        defer s.mu.Unlock()
        if t.Version != s.tariff.Version {
            return domain.Tariff{}, Conflict{"version", "Der Tarif wurde inzwischen geändert. Bitte neu laden und erneut prüfen."}
        }
        t.Version++
        s.tariff = cloneTariff(t)
        return cloneTariff(t), nil
    }
    func (s *Store) quoteLocked(start, end string) (domain.Quote, error) {
        days, err := domain.PeriodDays(start, end, domain.Today(s.now()))
        if err != nil {
            return domain.Quote{}, err
        }
        if s.tariff.Version == 0 {
            return domain.Quote{}, domain.ValidationErrors{"tariffVersion": "Bitte zuerst einen Tarif einrichten."}
        }
        return s.tariff.Price(days)
    }
    func (s *Store) Quote(start, end string) (domain.Quote, error) {
        s.mu.RLock()
        defer s.mu.RUnlock()
        return s.quoteLocked(start, end)
    }
    # Repository Guidelines
    
    ## Project Structure & Module Organization
    
    This repository currently contains planning documents for a staff-operated ski rental system:
    - `README.md`: German requirements for customer registration, ski assignment, inventory, and dashboard shortcuts.
    - `Template CLAUDE.rtf`: prototype architecture and development conventions.
    
    No application, tests, or assets exist yet. When implementing the prototype, follow the template’s intended layout: `main.go` or `cmd/server/` for startup, `internal/domain/` for business logic, `internal/store/` for storage, and `internal/handler/` for HTTP handlers. Keep Go tests beside their implementation as `*_test.go`. Choose either plain HTML/JavaScript or Flutter/Dart for the frontend and document its location in `README.md`.
    
    ## Build, Test, and Development Commands
    
    There is no initialized Go module or runnable application yet. Once the Go backend exists, run commands from its module root:
    - `go run .` or `go run ./cmd/server`: start the server, depending on the entry point.
    - `go build ./...`: compile all packages.
    - `go test ./...`: run all Go tests.
    - `go fmt ./...`: format Go source.
    - `golangci-lint run`: lint only if configured.
    
    For a Flutter frontend, use `flutter run` from its project directory. Update the README with the actual startup commands when implementation begins.
    
    ## Coding Style & Naming Conventions
    
    Use standard Go formatting, including tab indentation from `gofmt`. Use lowercase package names, exported `PascalCase` identifiers, and unexported `camelCase` identifiers. Prefer structs with methods; introduce interfaces only when needed. Keep the prototype simple: no ORM, external database, or dependency injection framework. Ask before adding dependencies. Wrap errors with context and preserve their causes using `%w`.
    
    ## Testing Guidelines
    
    Use Go’s standard `testing` package with `TestXxx` functions. Cover customer ID generation, availability checks, rental assignment, and dashboard counts. Ensure the in-memory store is thread-safe; run `go test -race ./...` for concurrent storage changes. No coverage threshold is currently configured.
    
    ## Commit & Pull Request Guidelines
    
    Nach jeder ausdrücklich vom Auftraggeber abgenommenen Phase einen lokalen Git-Commit erstellen. Zuerst die Abnahme und den Prüfnachweis dokumentieren, dann die zugehörigen Änderungen committen. Commit-Nachrichten sollen Phase und Ergebnis verständlich benennen, z. B. `Phase 1: Personen- und Skiverwaltung abschließen`. Implementierung oder bestandene Tests allein gelten nicht als Auftraggeberabnahme.
    
    This directory has no Git history to establish conventions. Follow the template’s guidance: short, imperative commit subjects, such as `Add ski availability checks`. Pull requests should describe the behavior changed, reference relevant requirements or issues, and report validation performed. Include screenshots for frontend changes.
    
    ## Security & Configuration
    
    Never commit secrets, real identity-document scans, or customer identifiers. Use synthetic customer data in fixtures and demonstrations.
    ✓ • 0ms

## Plan

## Buchung mit sofortiger Ski-Ausgabe

### Bedienung

- Bei Verleihbeginn **heute** zeigt das Formular zwei Buttons: **„Buchen und ausgeben“** als Hauptaktion und **„Nur buchen“** daneben.
- Bei zukünftigem Beginn erscheint ausschließlich **„Buchen“**.
- Beide Aktionen bestätigen den zuvor angezeigten Preis. Ein Hinweis beim Preis erklärt dies.
- Nach erfolgreicher Sofortausgabe erscheint „Buchung und Ausgabe gespeichert.“ Der Eintrag steht direkt unter „Ausgegebene Ausleihen“.
- „Nur buchen“ speichert weiterhin eine Reservierung mit späterer separater Ausgabe.

### Umsetzung

- `POST /api/ausleihen` erhält das optionale boolesche Feld `issueImmediately`; fehlend bedeutet `false`. Antwortformat und bestehende Ausgabe-Endpunkte bleiben erhalten.
- Buchung und Sofortausgabe erfolgen unter derselben Store-Sperre. Vor dem Speichern werden Preis, Termin, Verfügbarkeit und eine noch offene vorherige Ausgabe geprüft.
- Sofortausgabe ist ausschließlich bei Beginn heute in **Europe/Vienna** erlaubt. Der Server entscheidet verbindlich.
- Bei einem Fehler wird weder Buchung noch Ausgabe gespeichert. Eine noch nicht zurückgegebene vorherige Ausleihe erzeugt einen verständlichen Konflikthinweis.
- Während des Speicherns werden beide Buchungsbuttons gesperrt. Datumsänderungen verwerfen wie bisher die Preisprüfung; Tarifkonflikte erfordern erneute Preisbestätigung.
- Formularhinweise und README werden an den neuen Ablauf angepasst. Keine neuen Abhängigkeiten.

### Prüfung und Abnahme

- Store- und HTTP-Tests: Sofortausgabe für heute, reine Buchung, Zukunftsbuchung sowie Ablehnung einer zukünftigen Sofortausgabe.
- Fehlerfälle: veralteter Tarif, Terminüberschneidung und noch ausgegebenes Ski-Paar; jeweils ohne zurückbleibende Buchung.
- Dashboard zählt eine Sofortausgabe unmittelbar als ausgeliehen; reine Buchungen verändern den Ausleihzähler nicht.
- Gleichzeitige Buchungsversuche dürfen keine doppelte Ausgabe erzeugen.
- `go build ./...`, `go test ./...`, `go test -race ./...` und `go vet ./...` ausführen.
- Browserprüfung auf Desktop und schmalem Bildschirm einschließlich Tastaturbedienung, Datumswechsel und beider Buttons; Screenshots dokumentieren.
- Nach Umsetzung im Demomodus zur Prüfung bereitstellen. Prüfnachweis dokumentieren; ein Phasenabschluss-Commit erfolgt erst nach ausdrücklicher Abnahme.

## User

Implement the plan.

## Assistant

Ich setze die beiden Buchungsaktionen um und prüfe, dass Buchung und sofortige Ausgabe gemeinsam gespeichert werden.

## Activity

    $ git status --short; cat internal/store/booking_test.go; cat internal/handler/booking_test.go
    package store
    
    import (
        "errors"
        "reflect"
        "sync"
        "testing"
        "time"
    
        "skirental/internal/domain"
    )
    
    func datedStore() *Store {
        s := New(true)
        s.now = func() time.Time { return time.Date(2026, 10, 21, 9, 0, 0, 0, time.UTC) }
        return s
    }
    func book(t *testing.T, s *Store, ski, start, end string) RentalDetails {
        t.Helper()
        r, err := s.CreateRental("demo-person-01", ski, start, end, s.Tariff().Version)
        if err != nil {
            t.Fatal(err)
        }
        return r
    }
    func TestBookingOverlapAndLifecycle(t *testing.T) {
        s := datedStore()
        first := book(t, s, "demo-ski-01", "2026-10-21", "2026-10-23")
        if first.Rental.Active() || first.Rental.TotalPriceCents != 6000 || first.Rental.Status(first.Today) != "booked" {
            t.Fatal("wrong booking")
        }
        assertCounts(t, s, DashboardCounts{AvailableSkis: 2, TotalSkis: 2, RegisteredPeople: 1})
        available, _ := s.AvailableFor("2026-10-23", "2026-10-24")
        if len(available) != 1 {
            t.Fatal("inclusive availability failed")
        }
        before := s.Snapshot()
        for _, period := range [][2]string{{"2026-10-21", "2026-10-21"}, {"2026-10-22", "2026-10-24"}, {"2026-10-23", "2026-10-23"}, {"2026-10-21", "2026-10-30"}} {
            if _, err := s.CreateRental("demo-person-01", "demo-ski-01", period[0], period[1], 1); !errors.Is(err, ErrUnavailable) {
                t.Fatalf("overlap accepted: %v", err)
            }
        }
        if !reflect.DeepEqual(before, s.Snapshot()) {
            t.Fatal("conflict changed state")
        }
        if _, err := s.ReturnRental(first.Rental.ID); err == nil {
            t.Fatal("return before issue accepted")
        }
        issued, err := s.IssueRental(first.Rental.ID)
        if err != nil || !issued.Rental.Active() {
            t.Fatal(err)
        }
        repeated, err := s.IssueRental(first.Rental.ID)
        if err != nil || !issued.Rental.RentedAt.Equal(repeated.Rental.RentedAt) {
            t.Fatal("issue is not idempotent")
        }
        if _, err := s.CancelRental(first.Rental.ID); err == nil {
            t.Fatal("issued booking cancelled")
        }
        assertCounts(t, s, DashboardCounts{AvailableSkis: 1, RentedSkis: 1, TotalSkis: 2, RegisteredPeople: 1})
        next := book(t, s, "demo-ski-01", "2026-10-24", "2026-10-25")
        if _, err := s.IssueRental(next.Rental.ID); err == nil {
            t.Fatal("early issue accepted")
        }
        // The previous pair is still out, even beyond its scheduled end.
        s.now = func() time.Time { return time.Date(2026, 10, 25, 12, 0, 0, 0, time.UTC) }
        if _, err := s.IssueRental(next.Rental.ID); err == nil {
            t.Fatal("late predecessor did not block issue")
        }
        returned, err := s.ReturnRental(first.Rental.ID)
        if err != nil || returned.Rental.TotalPriceCents != 6000 {
            t.Fatal("late return changed price")
        }
        actual, err := s.IssueRental(next.Rental.ID)
        if err != nil {
            t.Fatal(err)
        }
        _, _ = s.ReturnRental(first.Rental.ID)
        if len(s.AvailableSkis()) != 1 {
            t.Fatal("old return released new issue")
        }
        _, _ = s.ReturnRental(next.Rental.ID)
        again, err := s.IssueRental(next.Rental.ID)
        if err != nil || !actual.Rental.RentedAt.Equal(again.Rental.RentedAt) {
            t.Fatal("repeated issue after return changed timestamp")
        }
    }
    func TestCancellationExpiryAndEarlyReturn(t *testing.T) {
        s := datedStore()
        r := book(t, s, "demo-ski-01", "2026-10-21", "2026-10-22")
        cancelled, err := s.CancelRental(r.Rental.ID)
        if err != nil {
            t.Fatal(err)
        }
        again, err := s.CancelRental(r.Rental.ID)
        if err != nil || !reflect.DeepEqual(cancelled, again) {
            t.Fatal("cancel not idempotent")
        }
        if _, err := s.IssueRental(r.Rental.ID); err == nil {
            t.Fatal("cancelled booking issued")
        }
        replacement := book(t, s, "demo-ski-01", "2026-10-21", "2026-10-22")
        if _, err := s.IssueRental(replacement.Rental.ID); err != nil {
            t.Fatal(err)
        }
        returned, _ := s.ReturnRental(replacement.Rental.ID)
        if returned.Rental.TotalPriceCents != 4500 {
            t.Fatal("early return changed price")
        }
        expired := book(t, s, "demo-ski-01", "2026-10-21", "2026-10-21")
        s.now = func() time.Time { return time.Date(2026, 10, 22, 12, 0, 0, 0, time.UTC) }
        detail, _ := s.Rental(expired.Rental.ID)
        if detail.Rental.Status(detail.Today) != "expired" {
            t.Fatal("booking did not expire")
        }
        if _, err := s.IssueRental(expired.Rental.ID); err == nil {
            t.Fatal("expired booking issued")
        }
        if _, err := s.CancelRental(expired.Rental.ID); err != nil {
            t.Fatal(err)
        }
    }
    func TestTariffSnapshotsAndConflicts(t *testing.T) {
        s := datedStore()
        r := book(t, s, "demo-ski-01", "2026-10-21", "2026-10-24")
        tariff := s.Tariff()
        tariff.PricesCents[0] = 999
        if s.Tariff().PricesCents[0] != 2500 {
            t.Fatal("tariff aliased")
        }
        saved, err := s.SaveTariff(tariff)
        if err != nil || saved.Version != 2 {
            t.Fatal(err)
        }
        saved.PricesCents[0] = 777
        if s.Tariff().PricesCents[0] != 999 {
            t.Fatal("saved tariff aliased")
        }
        s.SeedDemo()
        if s.Tariff().Version != 2 {
            t.Fatal("seeding overwrote tariff")
        }
        before := s.Snapshot()
        oldTariff := s.Tariff()
        if _, err := s.CreateRental("demo-person-01", "demo-ski-02", "2026-10-21", "2026-10-21", 1); err == nil {
            t.Fatal("stale price accepted")
        }
        if _, err := s.SaveTariff(tariff); err == nil {
            t.Fatal("stale tariff edit accepted")
        }
        if !reflect.DeepEqual(before, s.Snapshot()) || !reflect.DeepEqual(oldTariff, s.Tariff()) {
            t.Fatal("conflict mutated state")
        }
        existing, _ := s.Rental(r.Rental.ID)
        if existing.Rental.TotalPriceCents != 7500 || existing.Rental.TariffVersion != 1 {
            t.Fatal("stored quote changed")
        }
        normal := New(false)
        if normal.Tariff().Version != 0 {
            t.Fatal("normal mode inherited tariff")
        }
        if _, err := normal.Quote("9999-01-01", "9999-01-01"); err == nil {
            t.Fatal("missing tariff quoted")
        }
    }
    func TestConcurrentBookingsAndTariffEdits(t *testing.T) {
        s := datedStore()
        var wg sync.WaitGroup
        results := make(chan error, 32)
        for range 32 {
            wg.Go(func() {
                _, err := s.CreateRental("demo-person-01", "demo-ski-01", "2026-10-21", "2026-10-23", 1)
                results <- err
            })
        }
        wg.Wait()
        close(results)
        success := 0
        for err := range results {
            if err == nil {
                success++
            } else if !errors.Is(err, ErrUnavailable) {
                t.Fatal(err)
            }
        }
        if success != 1 {
            t.Fatalf("success=%d", success)
        }
        edits := make(chan error, 16)
        for range 16 {
            wg.Go(func() {
                _, err := s.SaveTariff(domain.Tariff{Version: 1, PricesCents: []int64{100}, ExtraDayCents: 50})
                edits <- err
            })
        }
        wg.Wait()
        close(edits)
        success = 0
        for err := range edits {
            if err == nil {
                success++
            }
        }
        if success != 1 || s.Tariff().Version != 2 {
            t.Fatal("tariff update lost concurrency control")
        }
    }
    
    func TestAtomicPriceSnapshotDuringEdits(t *testing.T) {
        s := datedStore()
        // Every tariff version has a distinct, predictable daily price.
        tariff := s.Tariff()
        tariff.PricesCents = []int64{200}
        tariff.ExtraDayCents = 0
        if _, err := s.SaveTariff(tariff); err != nil {
            t.Fatal(err)
        }
        var wg sync.WaitGroup
        wg.Go(func() {
            for range 50 {
                current := s.Tariff()
                current.PricesCents = []int64{int64(current.Version+1) * 100}
                if _, err := s.SaveTariff(current); err != nil {
                    t.Error(err)
                }
            }
        })
        for range 24 {
            wg.Go(func() {
                ski, err := s.SaveSki("", "Price test pair")
                if err != nil {
                    t.Error(err)
                    return
                }
                for {
                    q, err := s.Quote("2026-10-21", "2026-10-21")
                    if err != nil {
                        t.Error(err)
                        return
                    }
                    r, err := s.CreateRental("demo-person-01", ski.ID, "2026-10-21", "2026-10-21", q.TariffVersion)
                    if err != nil {
                        var conflict Conflict
                        if errors.As(err, &conflict) {
                            continue
                        }
                        t.Error(err)
                        return
                    }
                    if r.Rental.TotalPriceCents != int64(r.Rental.TariffVersion)*100 {
                        t.Error("mixed tariff snapshot")
                    }
                    return
                }
            })
        }
        wg.Wait()
        if len(s.Rentals()) != 24 {
            t.Fatal("lost bookings")
        }
    }
    package handler
    
    import (
        "encoding/json"
        "fmt"
        "reflect"
        "strings"
        "testing"
        "time"
    
        "skirental/internal/domain"
        "skirental/internal/store"
    )
    
    func TestPhase5HTTPContracts(t *testing.T) {
        s := store.New(false)
        app, err := New(s)
        if err != nil {
            t.Fatal(err)
        }
        empty := call(t, app, "GET", "/api/tarife", "", nil, 200)
        if !strings.Contains(empty.Body.String(), `"version":0`) || !strings.Contains(empty.Body.String(), `"pricesCents":[]`) {
            t.Fatal("invalid empty tariff")
        }
        today := domain.Today(time.Now())
        dates := fmt.Sprintf(`{"startsOn":%q,"endsOn":%q}`, today, today)
        call(t, app, "POST", "/api/ausleihen/preis", "application/json", strings.NewReader(dates), 400)
        for _, body := range []string{`null`, `{}`, `{"version":0,"pricesCents":[],"extraDayCents":1}`, `{"version":0,"pricesCents":[-1],"extraDayCents":1}`, `{"version":0,"pricesCents":[1.5],"extraDayCents":1}`, `{"version":0,"pricesCents":[null],"extraDayCents":1}`, `{"version":0,"pricesCents":[1],"extraDayCents":null}`, `{"version":0,"pricesCents":[1],"extraDayCents":1,"surprise":2}`} {
            call(t, app, "PUT", "/api/tarife", "application/json", strings.NewReader(body), 400)
            if s.Tariff().Version != 0 {
                t.Fatal("invalid tariff changed store")
            }
        }
        tariff := `{"version":0,"pricesCents":[2500,4500,6000],"extraDayCents":1500}`
        call(t, app, "PUT", "/api/tarife", "application/json", strings.NewReader(tariff), 200)
        call(t, app, "PUT", "/api/tarife", "application/json", strings.NewReader(tariff), 409)
        quote := call(t, app, "POST", "/api/ausleihen/preis", "application/json", strings.NewReader(dates), 200)
        var price domain.Quote
        _ = json.Unmarshal(quote.Body.Bytes(), &price)
        if price.TotalPriceCents != 2500 || price.DurationDays != 1 || price.TariffVersion != 1 {
            t.Fatal("wrong quote")
        }
        call(t, app, "GET", "/api/ski/verfuegbar?startsOn="+today, "", nil, 400)
        call(t, app, "GET", "/api/ski/verfuegbar?startsOn=&endsOn=", "", nil, 400)
        call(t, app, "POST", "/api/ausleihen/preis", "application/json", strings.NewReader(`{"startsOn":"2020-01-01","endsOn":"2020-01-02"}`), 400)
        call(t, app, "POST", "/api/ausleihen/preis", "text/plain", strings.NewReader(dates), 415)
        call(t, app, "POST", "/api/ausleihen/preis", "application/json", strings.NewReader(`{"startsOn":"`+strings.Repeat("x", 70000)+`"}`), 413)
        call(t, app, "POST", "/api/tarife", "", nil, 405)
    }
    func TestPhase5BookingHTTPFlow(t *testing.T) {
        s := store.New(true)
        app, err := New(s)
        if err != nil {
            t.Fatal(err)
        }
        body := bookingBody("demo-person-01", "demo-ski-01", 1)
        created := call(t, app, "POST", "/api/ausleihen", "application/json", strings.NewReader(body), 201)
        var booked rentalResponse
        _ = json.Unmarshal(created.Body.Bytes(), &booked)
        if booked.Status != "booked" || booked.RentedAt != nil || booked.TotalPriceCents != 2500 || booked.DurationDays != 1 {
            t.Fatal("wrong booked response")
        }
        if s.Dashboard().RentedSkis != 0 {
            t.Fatal("booking counted as issue")
        }
        today := domain.Today(time.Now())
        query := "/api/ski/verfuegbar?startsOn=" + today + "&endsOn=" + today
        available := call(t, app, "GET", query, "", nil, 200)
        if strings.Contains(available.Body.String(), "demo-ski-01") {
            t.Fatal("reserved pair offered for same date")
        }
        unissued := call(t, app, "GET", "/api/ski/verfuegbar", "", nil, 200)
        if !strings.Contains(unissued.Body.String(), "demo-ski-01") {
            t.Fatal("physical availability includes reservation")
        }
        path := "/api/ausleihen/" + booked.ID
        before := s.Snapshot()
        call(t, app, "PUT", path+"/rueckgabe", "", nil, 409)
        call(t, app, "PUT", path+"/ausgabe", "application/json", strings.NewReader(`{}`), 400)
        if !reflect.DeepEqual(before, s.Snapshot()) {
            t.Fatal("bad actions changed state")
        }
        cancelled := call(t, app, "PUT", path+"/stornierung", "", nil, 200)
        again := call(t, app, "PUT", path+"/stornierung", "", nil, 200)
        if cancelled.Body.String() != again.Body.String() {
            t.Fatal("cancel not idempotent")
        }
        call(t, app, "PUT", path+"/ausgabe", "", nil, 409)
        created = call(t, app, "POST", "/api/ausleihen", "application/json", strings.NewReader(body), 201)
        _ = json.Unmarshal(created.Body.Bytes(), &booked)
        path = "/api/ausleihen/" + booked.ID
        issued := issueHTTP(t, app, booked.ID)
        if issued.Status != "issued" || issued.RentedAt == nil || s.Dashboard().RentedSkis != 1 {
            t.Fatal("wrong issue state")
        }
        repeat := issueHTTP(t, app, booked.ID)
        if !reflect.DeepEqual(issued, repeat) {
            t.Fatal("issue changed timestamp")
        }
        call(t, app, "PUT", path+"/stornierung", "", nil, 409)
        call(t, app, "PUT", "/api/tarife", "application/json", strings.NewReader(`{"version":1,"pricesCents":[3000],"extraDayCents":1000}`), 200)
        staleBody := bookingBody("demo-person-01", "demo-ski-02", 1)
        before = s.Snapshot()
        call(t, app, "POST", "/api/ausleihen", "application/json", strings.NewReader(staleBody), 409)
        if !reflect.DeepEqual(before, s.Snapshot()) {
            t.Fatal("stale tariff created rental")
        }
        returned := call(t, app, "PUT", path+"/rueckgabe", "", nil, 200)
        var done rentalResponse
        _ = json.Unmarshal(returned.Body.Bytes(), &done)
        if done.Status != "returned" || done.TotalPriceCents != 2500 || done.TariffVersion != 1 || s.Dashboard().RentedSkis != 0 {
            t.Fatal("return changed booked price")
        }
        for _, action := range []string{"ausgabe", "rueckgabe", "stornierung"} {
            call(t, app, "PUT", "/api/ausleihen/missing/"+action, "", nil, 404)
        }
        // A future booking can be cancelled, but never issued before its first date.
        tomorrow := time.Now().AddDate(0, 0, 1)
        future := domain.Today(tomorrow)
        futureBody := fmt.Sprintf(`{"personID":"demo-person-01","skiID":"demo-ski-01","startsOn":%q,"endsOn":%q,"tariffVersion":2}`, future, future)
        response := call(t, app, "POST", "/api/ausleihen", "application/json", strings.NewReader(futureBody), 201)
        var futureRental rentalResponse
        _ = json.Unmarshal(response.Body.Bytes(), &futureRental)
        call(t, app, "PUT", "/api/ausleihen/"+futureRental.ID+"/ausgabe", "", nil, 409)
    }
    ✓ • 0ms

## Activity

    $ python3 - <<'PY'
        from pathlib import Path
        p=Path('internal/store/rental.go')
        s=p.read_text().replace('personID, skiID, err := domain.ValidateRentalReferences(personID, skiID)','return s.createRental(personID, skiID, start, end, version, false)\n}\n\n// CreateAndIssueRental books and records the handover together, or changes nothing.\nfunc (s *Store) CreateAndIssueRental(personID, skiID, start, end string, version uint64) (RentalDetails, error) {\n\treturn s.createRental(personID, skiID, start, end, version, true)\n}\n\nfunc (s *Store) createRental(personID, skiID, start, end string, version uint64, issueImmediately bool) (RentalDetails, error) {\n\tpersonID, skiID, err := domain.ValidateRentalReferences(personID, skiID)',1)
        s=s.replace('\ts.nextRental++\n', '''\tif issueImmediately {
        		if start != domain.Today(s.now()) {
        			return RentalDetails{}, Conflict{"startsOn", "Buchen und ausgeben ist nur bei Verleihbeginn heute möglich."}
        		}
        		if err := s.checkHandoverLocked(skiID); err != nil {
        			return RentalDetails{}, err
        		}
        	}
        	s.nextRental++
        ''',1).replace('\ts.rentals[r.ID] = r\n', '\tif issueImmediately {\n\t\tr.RentedAt = r.CreatedAt\n\t}\n\ts.rentals[r.ID] = r\n',1)
        a=s.index('\tfor _, other := range s.rentals {',s.index('func (s *Store) IssueRental'))
        b=s.index('\tr.RentedAt = ',a)
        s=s[:a]+'''\tif err := s.checkHandoverLocked(r.SkiID); err != nil {
        		return RentalDetails{}, err
        	}
        '''+s[b:]
        pos=s.index('func (s *Store) CancelRental')
        s=s[:pos]+'''// checkHandoverLocked also catches overdue rentals outside the booked period.
        func (s *Store) checkHandoverLocked(skiID string) error {
        	for _, other := range s.rentals {
        		if other.SkiID == skiID && other.Active() {
        			return Conflict{"form", "Das Ski-Paar wurde aus einer vorherigen Ausleihe noch nicht zurückgegeben. Es wurde nichts gespeichert."}
        		}
        	}
        	return nil
        }
        
        '''+s[pos:];p.write_text(s)
        p=Path('internal/handler/rental.go');s=p.read_text().replace('TariffVersion *uint64 `json:"tariffVersion"`','TariffVersion *uint64 `json:"tariffVersion"`\n\t\t\tIssueImmediately bool `json:"issueImmediately"`');s=s.replace('result, err := s.CreateRental(input.PersonID, input.SkiID, input.StartsOn, input.EndsOn, *input.TariffVersion)','create := s.CreateRental\n\t\tif input.IssueImmediately {\n\t\t\tcreate = s.CreateAndIssueRental\n\t\t}\n\t\tresult, err := create(input.PersonID, input.SkiID, input.StartsOn, input.EndsOn, *input.TariffVersion)');p.write_text(s)
        p=Path('web/assets/ausleihe.js');s=p.read_text().replace('Nach der Buchung die tatsächliche Ausgabe separat erfassen.','Bei Beginn heute können Buchung und tatsächliche Ausgabe gemeinsam gespeichert werden. Mit den Buchungsbuttons bestätigen Sie den angezeigten Preis.').replace('<button type="submit" disabled>Zum angezeigten Preis buchen</button>','<button type="submit" id="book-issue" disabled>Buchen und ausgeben</button><button type="submit" id="book-only" class="secondary" disabled>Nur buchen</button>')
        s=s.replace("submit=form.querySelector('[type=\"submit\"]')", "submit=form.querySelector('#book-only'),issue=form.querySelector('#book-issue')")
        s=s.replace("    function invalidate()", "    let saving=false;\n    function buttons(disabled){\n     const sameDay=form.querySelector('#startsOn').value===today();\n     issue.hidden=!sameDay;issue.disabled=disabled||saving||!sameDay;\n     submit.disabled=disabled||saving;submit.textContent=sameDay?'Nur buchen':'Buchen';\n     submit.classList.toggle('secondary',sameDay);\n    }\n    buttons(true);\n    function invalidate()")
        s=s.replace('submit.disabled=true;', 'buttons(true);').replace('submit.disabled=!pairs.length||!people.length;', 'buttons(!pairs.length||!people.length);').replace('else submit.disabled=!quote;', 'else buttons(!quote);')
        s=s.replace('event.preventDefault();if(!quote)return;','event.preventDefault();if(!quote||saving)return;\n     const issueImmediately=event.submitter===issue;\n     saving=true;')
        s=s.replace('tariffVersion:quote.tariffVersion}', 'tariffVersion:quote.tariffVersion,issueImmediately}')
        s=s.replace("notice('Buchung gespeichert. Die tatsächliche Ausgabe bitte separat erfassen.');", "notice(issueImmediately?'Buchung und Ausgabe gespeichert.':'Buchung gespeichert. Die tatsächliche Ausgabe bitte separat erfassen.');")
        s=s.replace('      if(error.status===409)', '      saving=false;\n      if(error.status===409)')
        s=s.replace('      showErrors(error);\n     }\n    });', '      showErrors(error);\n     }finally{saving=false;}\n    });')
        p.write_text(s)
        PY
        /private/tmp/skirental-toolchain/go/bin/gofmt -w internal/store/rental.go internal/handler/rental.go
    ✓ • 226ms

## Activity

    $ sed -n '45,110p' web/assets/ausleihe.js; rg -n 'api/ausleihen|tariffVersion' specs/05-termine-preise.md; ls /Users/michael/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright
       const form=content.querySelector('#rental-form');let quote=null,previewGeneration=0;
       const values=()=>form?{personID:document.querySelector('#personID').value,startsOn:document.querySelector('#startsOn').value,endsOn:document.querySelector('#endsOn').value}:saved;
       if(form){
        const person=form.querySelector('#personID'),ski=form.querySelector('#skiID'),submit=form.querySelector('#book-only'),issue=form.querySelector('#book-issue'),check=form.querySelector('#check-period'),preview=form.querySelector('#price-preview');
        person.value=people.some(p=>p.id===saved.personID)?saved.personID:'';
        if(saved.personID&&!person.value)showErrors({errors:{personID:'Die vorausgewählte Person wurde nicht gefunden. Bitte eine vorhandene Person auswählen.'}});
        let saving=false;
        function buttons(disabled){
         const sameDay=form.querySelector('#startsOn').value===today();
         issue.hidden=!sameDay;issue.disabled=disabled||saving||!sameDay;
         submit.disabled=disabled||saving;submit.textContent=sameDay?'Nur buchen':'Buchen';
         submit.classList.toggle('secondary',sameDay);
        }
        buttons(true);
        function invalidate(){quote=null;previewGeneration++;ski.innerHTML='<option value="">Bitte zuerst Zeitraum prüfen</option>';ski.disabled=true;buttons(true);check.disabled=!tariff.version;form.querySelector('#no-skis').hidden=true;preview.textContent='Zeitraum geändert. Bitte Verfügbarkeit und Preis erneut prüfen.';}
        for(const id of ['startsOn','endsOn'])form.querySelector('#'+id).addEventListener('input',invalidate);
        async function loadPreview(){
         const attempt=++previewGeneration;quote=null;buttons(true);ski.disabled=true;check.disabled=true;preview.textContent='Verfügbarkeit und Preis werden geprüft …';
         const selected=values();
         try{
          const [price,pairs]=await Promise.all([post('/api/ausleihen/preis',{startsOn:selected.startsOn,endsOn:selected.endsOn}),request('/api/ski/verfuegbar?'+new URLSearchParams({startsOn:selected.startsOn,endsOn:selected.endsOn}))]);
          if(own!==generation||attempt!==previewGeneration)return;
          quote=price;form.querySelector('#no-skis').hidden=!!pairs.length;ski.innerHTML='<option value="">Bitte Ski-Paar wählen</option>'+options(pairs);ski.disabled=!pairs.length;
          preview.textContent=`${price.durationDays} ${price.durationDays===1?'Tag':'Tage'} · Gesamtpreis ${money(price.totalPriceCents)}${pairs.length?'':'. Keine Ski-Paare im Zeitraum verfügbar.'}`;
          buttons(!pairs.length||!people.length);
         }catch(error){if(own!==generation||attempt!==previewGeneration)return;preview.textContent='Der Zeitraum konnte nicht geprüft werden.';showErrors(error);}
         finally{if(own===generation&&attempt===previewGeneration)check.disabled=false;}
        }
        check.addEventListener('click',loadPreview);
        form.addEventListener('submit',async event=>{
         event.preventDefault();if(!quote||saving)return;
         const issueImmediately=event.submitter===issue;
         saving=true;
         const current=values();buttons(true);
         try{
          await post('/api/ausleihen',{...current,skiID:ski.value,tariffVersion:quote.tariffVersion,issueImmediately});
          if(own!==generation)return;notice(issueImmediately?'Buchung und Ausgabe gespeichert.':'Buchung gespeichert. Die tatsächliche Ausgabe bitte separat erfassen.');await render(current);message.focus();
         }catch(error){
          if(own!==generation)return;
          saving=false;
          if(error.status===409){await loadPreview();if(own!==generation)return;}
          else buttons(!quote);
          showErrors(error);
         }finally{saving=false;}
        });
       }
       content.querySelector('#refresh-rentals').addEventListener('click',()=>{notice('');render(values()).then(headingFocus);});
       content.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',async()=>{
        button.disabled=true;
        try{
         await request('/api/ausleihen/'+encodeURIComponent(button.dataset.id)+'/'+button.dataset.action,{method:'PUT'});
         if(own!==generation)return;
         notice({ausgabe:'Ausgabe gespeichert.',rueckgabe:'Rückgabe gespeichert.',stornierung:'Buchung storniert.'}[button.dataset.action]);
         await render(values());message.focus();
        }catch(error){if(own!==generation)return;showErrors(error);button.disabled=false;}
       }));
      }catch(error){
       if(own!==generation)return;
       content.innerHTML='<p id="rental-error" class="field-error" role="alert" tabindex="-1"></p><button id="retry-rentals">Erneut laden</button>';
       showErrors(error);content.querySelector('#retry-rentals').addEventListener('click',()=>render(saved));
      }
     }
     window.addEventListener('hashchange',()=>{notice('');render().then(headingFocus);});
     render();
    })();
    40:| POST /api/ausleihen/preis | {startsOn, endsOn}; Antwort {durationDays, totalPriceCents, tariffVersion} |
    43:| POST /api/ausleihen | {personID, skiID, startsOn, endsOn, tariffVersion}; 201 mit Location |
    44:| GET /api/ausleihen und /api/ausleihen/{id} | Bisherige Referenzen/Namen plus createdAt, startsOn, endsOn, durationDays, totalPriceCents, tariffVersion, status, overdue, nullable rentedAt/returnedAt/cancelledAt |
    45:| PUT /api/ausleihen/{id}/ausgabe, /rueckgabe, /stornierung | Leerer Body; aktualisierter Datensatz |
    LICENSE
    NOTICE
    README.md
    ThirdPartyNotices.txt
    cli.js
    index.d.ts
    index.js
    index.mjs
    jsx-runtime.js
    jsx-runtime.mjs
    lib
    node_modules
    package.json
    test.d.ts
    test.js
    test.mjs
    types
    ✓ • 0ms

## Activity

    $ rg -n 'hidden|\.actions|button' web/assets/style*; cat internal/domain/calendar.go
    56:.welcome-panel { position: relative; margin: 26px 0 30px; display: flex; overflow: hidden; border-radius: 10px; background: #e3e9dc; min-height: 238px; }
    115:[hidden] { display: none !important; }
    133:.actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 25px; }
    134:button, .button { display: inline-block; border: 1px solid var(--green); border-radius: 5px; background: var(--green); color: white; padding: 12px 18px; font: inherit; font-size: 13px; text-decoration: none; cursor: pointer; }
    135:button:disabled { opacity: .6; cursor: wait; }
    137:button:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid #a34e25; outline-offset: 3px; }
    149:.actions.compact { margin-top: 0; }
    157:.dashboard-update button { flex-shrink: 0; }
    164:#tariff-form .actions { margin-bottom: 24px; }
    cat: internal/domain/calendar.go: No such file or directory
    ✗ (1) • 0ms

## Assistant

Die beiden Aktionen sind eingebaut. „Buchen und ausgeben“ prüft zusätzlich, ob das Paar noch aus einer früheren Ausleihe unterwegs ist; bei einem Konflikt wird nichts gespeichert. Ich ergänze jetzt die Tests und prüfe anschließend die Bedienung im Browser.

## Activity

    $ cat >> internal/store/booking_test.go <<'EOF'
        
        func TestImmediateIssueAtomicity(t *testing.T) {
         for _, scenario := range []string{"today", "future", "stale tariff", "overlap", "overdue", "Vienna midnight"} {
          t.Run(scenario, func(t *testing.T) {
           s := datedStore()
           start, end, version := "2026-10-21", "2026-10-21", uint64(1)
           switch scenario {
           case "future": start, end = "2026-10-22", "2026-10-22"
           case "stale tariff": version = 0
           case "overlap": book(t,s,"demo-ski-01",start,end)
           case "overdue":
            r := book(t,s,"demo-ski-01",start,end)
            if _,err:=s.IssueRental(r.Rental.ID);err!=nil {t.Fatal(err)}
            s.now=func() time.Time{return time.Date(2026,10,22,9,0,0,0,time.UTC)}
            start,end="2026-10-22","2026-10-22"
           case "Vienna midnight":
            s.now=func() time.Time{return time.Date(2026,10,21,22,30,0,0,time.UTC)}
            start,end="2026-10-22","2026-10-22"
           }
           before, next := s.Snapshot(), s.nextRental
           r,err:=s.CreateAndIssueRental("demo-person-01","demo-ski-01",start,end,version)
           if scenario=="today" || scenario=="Vienna midnight" {
            if err!=nil {t.Fatal(err)}
            if !r.Rental.Active() || !r.Rental.RentedAt.Equal(r.Rental.CreatedAt) || r.Rental.TotalPriceCents!=2500 {t.Fatal("wrong immediate issue")}
            assertCounts(t,s,DashboardCounts{AvailableSkis:1,RentedSkis:1,TotalSkis:2,RegisteredPeople:1})
           } else {
            if err==nil {t.Fatal("invalid immediate issue accepted")}
            if !reflect.DeepEqual(before,s.Snapshot()) || next!=s.nextRental {t.Fatal("failed operation changed state")}
            if scenario=="overdue" {
             // A reservation remains possible even when the previous handover is overdue.
             book(t,s,"demo-ski-01",start,end)
            }
           }
          })
         }
        }
        
        func TestConcurrentImmediateIssues(t *testing.T) {
         s:=datedStore()
         var wg sync.WaitGroup
         results:=make(chan error,32)
         for range 32 {wg.Go(func(){_,err:=s.CreateAndIssueRental("demo-person-01","demo-ski-01","2026-10-21","2026-10-21",1);results<-err})}
         wg.Wait();close(results)
         success:=0
         for err:=range results {if err==nil {success++} else if !errors.Is(err,ErrUnavailable) {t.Fatal(err)}}
         if success!=1 || len(s.Rentals())!=1 || s.Dashboard().RentedSkis!=1 {t.Fatal("duplicate immediate issue")}
        }
        EOF
        cat >> internal/handler/booking_test.go <<'EOF'
        
        func TestImmediateIssueHTTP(t *testing.T) {
         for _, mode:=range []string{"true","false","omitted","future","stale","invalid"} {
          t.Run(mode,func(t *testing.T){
           s:=store.New(true)
           app,err:=New(s);if err!=nil {t.Fatal(err)}
           date:=domain.Today(time.Now())
           if mode=="future" {date=domain.Today(time.Now().AddDate(0,0,1))}
           body:=fmt.Sprintf(`{"personID":"demo-person-01","skiID":"demo-ski-01","startsOn":%q,"endsOn":%q,"tariffVersion":1`,date,date)
           switch mode {
           case "omitted":
           case "invalid":body+=`,"issueImmediately":"true"`
           case "false":body+=`,"issueImmediately":false`
           default:body+=`,"issueImmediately":true`
           }
           body+="}"
           expected:=201
           if mode=="future" || mode=="stale" {expected=409}
           if mode=="invalid" {expected=400}
           if mode=="stale" {body=strings.Replace(body,`"tariffVersion":1`,`"tariffVersion":0`,1)}
           before:=s.Snapshot()
           response:=call(t,app,"POST","/api/ausleihen","application/json",strings.NewReader(body),expected)
           if expected!=201 {
            if !reflect.DeepEqual(before,s.Snapshot()) {t.Fatal("failed request changed state")};return
           }
           var r rentalResponse
           if err:=json.Unmarshal(response.Body.Bytes(),&r);err!=nil {t.Fatal(err)}
           if mode=="true" {
            if r.Status!="issued" || r.RentedAt==nil || s.Dashboard().RentedSkis!=1 {t.Fatal("immediate issue missing")}
            call(t,app,"GET",response.Header().Get("Location"),"",nil,200)
            // A second attempt must fail without creating a second booking.
            call(t,app,"POST","/api/ausleihen","application/json",strings.NewReader(body),409)
            if len(s.Rentals())!=1 {t.Fatal("duplicate booking")}
           } else if r.Status!="booked" || r.RentedAt!=nil || s.Dashboard().RentedSkis!=0 {t.Fatal("reservation unexpectedly issued")}
          })
         }
        }
        EOF
        /private/tmp/skirental-toolchain/go/bin/gofmt -w internal/store/booking_test.go internal/handler/booking_test.go
    ✓ • 0ms

## Activity

    $ env GOCACHE=/private/tmp/skirental-go-cache /private/tmp/skirental-toolchain/go/bin/go build ./...
    ✓ • 1.19s

## Activity

    $ env GOCACHE=/private/tmp/skirental-go-cache /private/tmp/skirental-toolchain/go/bin/go vet ./...
    ✓ • 1.43s

## Activity

    $ ls '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; command -v node; rg -n 'dashboard|api/' internal/handler/dashboard.go
    /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
    /opt/homebrew/opt/node@24/bin/node
    rg: internal/handler/dashboard.go: IO error for operation on internal/handler/dashboard.go: No such file or directory (os error 2)
    ✗ (2) • 0ms

## Activity

    $ env GOCACHE=/private/tmp/skirental-go-cache /private/tmp/skirental-toolchain/go/bin/go test -race ./...
    ?       skirental/cmd/server    [no test files]
    ok      skirental/internal/domain    1.754s
    ok      skirental/internal/handler    3.871s
    ok      skirental/internal/store    5.294s
    ?       skirental/web    [no test files]
    ✓ • 12.75s

## Activity

    $ env GOCACHE=/private/tmp/skirental-go-cache /private/tmp/skirental-toolchain/go/bin/go test ./...
    ?       skirental/cmd/server    [no test files]
    ok      skirental/internal/domain    0.304s
    ok      skirental/internal/handler    0.876s
    ok      skirental/internal/store    0.611s
    ?       skirental/web    [no test files]
    ✓ • 1.92s

## Activity

    $ cat > /private/tmp/skirental-immediate-browser.cjs <<'EOF'
        const {chromium}=require('/Users/michael/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
        const assert=require('node:assert/strict');
        (async()=>{
         const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
         const page=await browser.newPage({viewport:{width:1280,height:1000}});
         const errors=[];page.on('pageerror',e=>errors.push(e.message));
         await page.goto('http://127.0.0.1:8080/ausleihe');
         await page.locator('#personID').selectOption('demo-person-01');
         const today=await page.locator('#startsOn').inputValue();
         const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+1);const tomorrow=d.toISOString().slice(0,10);
         await page.locator('#endsOn').fill(tomorrow);
         await page.locator('#startsOn').fill(tomorrow);
         await page.getByRole('button',{name:'Buchen',exact:true}).waitFor();
         assert.equal(await page.locator('#book-issue').isVisible(),false);
         await page.locator('#startsOn').fill(today);await page.locator('#endsOn').fill(today);
         assert.equal(await page.locator('#book-issue').isDisabled(),true);
         await page.locator('#check-period').click();await page.locator('#skiID').selectOption('demo-ski-01');
         await page.screenshot({path:process.cwd()+'/specs/screenshots/06-buchen-ausgeben-desktop.png',fullPage:true});
         await page.locator('#book-issue').focus();await page.keyboard.press('Enter');
         await page.getByText('Buchung und Ausgabe gespeichert.',{exact:true}).waitFor();
         let rentals=await (await page.request.get('http://127.0.0.1:8080/api/ausleihen')).json();
         assert.equal(rentals.length,1);assert.equal(rentals[0].status,'issued');
         await page.setViewportSize({width:390,height:844});
         await page.locator('#check-period').click();await page.locator('#skiID').selectOption('demo-ski-02');
         await page.screenshot({path:process.cwd()+'/specs/screenshots/06-buchen-ausgeben-mobil.png',fullPage:true});
         assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
         await page.locator('#book-only').click();await page.getByText('Buchung gespeichert. Die tatsächliche Ausgabe bitte separat erfassen.',{exact:true}).waitFor();
         rentals=await (await page.request.get('http://127.0.0.1:8080/api/ausleihen')).json();
         assert.equal(rentals.length,2);assert.equal(rentals.find(r=>r.skiID==='demo-ski-02').status,'booked');
         assert.deepEqual(errors,[]);
         console.log('Browser checks passed: dates, desktop/mobile, keyboard immediate issue, reservation, no overflow/errors.');
         await browser.close();
        })().catch(e=>{console.error(e);process.exit(1)});
        EOF
        node /private/tmp/skirental-immediate-browser.cjs
    browserType.launch: Target page, context or browser has been closed
    Browser logs:
    
    <launching> /Applications/Google Chrome.app/Contents/MacOS/Google Chrome --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,BlockOriginHeaderModificationOnRedirect,Translate,AutoDeElevate,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --disable-updater-scheduler --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/var/folders/yd/ttwfmyq97lg89bt6xd9b2q600000gn/T/playwright_chromiumdev_profile-nvDJc7 --remote-debugging-pipe --no-startup-window
    <launched> pid=6516
    Call log:
      - <launching> /Applications/Google Chrome.app/Contents/MacOS/Google Chrome --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,BlockOriginHeaderModificationOnRedirect,Translate,AutoDeElevate,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --disable-updater-scheduler --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/var/folders/yd/ttwfmyq97lg89bt6xd9b2q600000gn/T/playwright_chromiumdev_profile-nvDJc7 --remote-debugging-pipe --no-startup-window
      - <launched> pid=6516
      - [pid=6516] <gracefully close start>
      - [pid=6516] <kill>
      - [pid=6516] <will force kill>
      - [pid=6516] exception while trying to kill process: Error: kill EPERM
      - [pid=6516] <process did exit: exitCode=null, signal=SIGABRT>
      - [pid=6516] starting temporary directories cleanup
      - [pid=6516] finished temporary directories cleanup
      - [pid=6516] <gracefully close end>
    
        at /private/tmp/skirental-immediate-browser.cjs:4:31
        at Object.<anonymous> (/private/tmp/skirental-immediate-browser.cjs:33:3) {
      log: [
        '  - <launching> /Applications/Google Chrome.app/Contents/MacOS/Google Chrome --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,BlockOriginHeaderModificationOnRedirect,Translate,AutoDeElevate,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --disable-updater-scheduler --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/var/folders/yd/ttwfmyq97lg89bt6xd9b2q600000gn/T/playwright_chromiumdev_profile-nvDJc7 --remote-debugging-pipe --no-startup-window',
        '  - <launched> pid=6516',
        '  - [pid=6516] <gracefully close start>',
        '  - [pid=6516] <kill>',
        '  - [pid=6516] <will force kill>',
        '  - [pid=6516] exception while trying to kill process: Error: kill EPERM',
        '  - [pid=6516] <process did exit: exitCode=null, signal=SIGABRT>',
        '  - [pid=6516] starting temporary directories cleanup',
        '  - [pid=6516] finished temporary directories cleanup',
        '  - [pid=6516] <gracefully close end>'
      ]
    }
    ✗ (1) • 3.91s

## Assistant

Build, Race-Tests und statische Prüfung sind bestanden. Ich prüfe gerade beide Buttons im Browser, einschließlich Tastaturbedienung und mobiler Darstellung. Danach starte ich den Demomodus mit frischen Beispieldaten neu.

## Activity

    $ git diff --stat; git diff -- internal/store/rental.go internal/handler/rental.go
     internal/handler/booking_test.go | 62 +++++++++++++++++++++++++++++++++
     internal/handler/rental.go       | 17 +++++----
     internal/store/booking_test.go   | 74 ++++++++++++++++++++++++++++++++++++++++
     internal/store/rental.go         | 37 +++++++++++++++++---
     web/assets/ausleihe.js           | 33 ++++++++++++------
     5 files changed, 202 insertions(+), 21 deletions(-)
    diff --git a/internal/handler/rental.go b/internal/handler/rental.go
    index 6872d63..8c8ab90 100644
    --- a/internal/handler/rental.go
    +++ b/internal/handler/rental.go
    @@ -143,11 +143,12 @@ func registerRentals(mux *http.ServeMux, s *store.Store) {
         })
         mux.HandleFunc("POST /api/ausleihen", func(w http.ResponseWriter, r *http.Request) {
             var input struct {
    -            PersonID      string  `json:"personID"`
    -            SkiID         string  `json:"skiID"`
    -            StartsOn      string  `json:"startsOn"`
    -            EndsOn        string  `json:"endsOn"`
    -            TariffVersion *uint64 `json:"tariffVersion"`
    +            PersonID         string  `json:"personID"`
    +            SkiID            string  `json:"skiID"`
    +            StartsOn         string  `json:"startsOn"`
    +            EndsOn           string  `json:"endsOn"`
    +            TariffVersion    *uint64 `json:"tariffVersion"`
    +            IssueImmediately bool    `json:"issueImmediately"`
             }
             if !readJSON(w, r, &input) {
                 return
    @@ -160,7 +161,11 @@ func registerRentals(mux *http.ServeMux, s *store.Store) {
                 apiError(w, domain.ValidationErrors{"tariffVersion": "Bitte zuerst den Preis prüfen und bestätigen."})
                 return
             }
    -        result, err := s.CreateRental(input.PersonID, input.SkiID, input.StartsOn, input.EndsOn, *input.TariffVersion)
    +        create := s.CreateRental
    +        if input.IssueImmediately {
    +            create = s.CreateAndIssueRental
    +        }
    +        result, err := create(input.PersonID, input.SkiID, input.StartsOn, input.EndsOn, *input.TariffVersion)
             if err != nil {
                 apiError(w, err)
                 return
    diff --git a/internal/store/rental.go b/internal/store/rental.go
    index c559847..b87d28d 100644
    --- a/internal/store/rental.go
    +++ b/internal/store/rental.go
    @@ -56,6 +56,15 @@ func (s *Store) AvailableSkis() []domain.Ski {
    
     // CreateRental validates price, references and overlap in one atomic operation.
     func (s *Store) CreateRental(personID, skiID, start, end string, version uint64) (RentalDetails, error) {
    +    return s.createRental(personID, skiID, start, end, version, false)
    +}
    +
    +// CreateAndIssueRental books and records the handover together, or changes nothing.
    +func (s *Store) CreateAndIssueRental(personID, skiID, start, end string, version uint64) (RentalDetails, error) {
    +    return s.createRental(personID, skiID, start, end, version, true)
    +}
    +
    +func (s *Store) createRental(personID, skiID, start, end string, version uint64, issueImmediately bool) (RentalDetails, error) {
         personID, skiID, err := domain.ValidateRentalReferences(personID, skiID)
         if err != nil {
             return RentalDetails{}, err
    @@ -78,10 +87,21 @@ func (s *Store) CreateRental(personID, skiID, start, end string, version uint64)
         if !s.availablePeriodLocked(skiID, start, end) {
             return RentalDetails{}, ErrUnavailable
         }
    +    if issueImmediately {
    +        if start != domain.Today(s.now()) {
    +            return RentalDetails{}, Conflict{"startsOn", "Buchen und ausgeben ist nur bei Verleihbeginn heute möglich."}
    +        }
    +        if err := s.checkHandoverLocked(skiID); err != nil {
    +            return RentalDetails{}, err
    +        }
    +    }
         s.nextRental++
         r := domain.Rental{ID: fmt.Sprintf("ausleihe-%06d", s.nextRental), PersonID: personID, SkiID: skiID,
             CreatedAt: s.now().UTC(), StartsOn: start, EndsOn: end, DurationDays: quote.DurationDays,
             TotalPriceCents: quote.TotalPriceCents, TariffVersion: quote.TariffVersion}
    +    if issueImmediately {
    +        r.RentedAt = r.CreatedAt
    +    }
         s.rentals[r.ID] = r
         return s.rentalDetailsLocked(r), nil
     }
    @@ -118,15 +138,24 @@ func (s *Store) IssueRental(id string) (RentalDetails, error) {
         if today < r.StartsOn || today > r.EndsOn {
             return RentalDetails{}, Conflict{"form", "Die Ausgabe ist nur innerhalb des gebuchten Zeitraums möglich."}
         }
    -    for _, other := range s.rentals {
    -        if other.SkiID == r.SkiID && other.Active() {
    -            return RentalDetails{}, Conflict{"form", "Das Ski-Paar wurde aus einer vorherigen Ausleihe noch nicht zurückgegeben."}
    -        }
    +    if err := s.checkHandoverLocked(r.SkiID); err != nil {
    +        return RentalDetails{}, err
         }
         r.RentedAt = s.now().UTC()
         s.rentals[id] = r
         return s.rentalDetailsLocked(r), nil
     }
    +
    +// checkHandoverLocked also catches overdue rentals outside the booked period.
    +func (s *Store) checkHandoverLocked(skiID string) error {
    +    for _, other := range s.rentals {
    +        if other.SkiID == skiID && other.Active() {
    +            return Conflict{"form", "Das Ski-Paar wurde aus einer vorherigen Ausleihe noch nicht zurückgegeben. Es wurde nichts gespeichert."}
    +        }
    +    }
    +    return nil
    +}
    +
     func (s *Store) CancelRental(id string) (RentalDetails, error) {
         s.mu.Lock()
         defer s.mu.Unlock()
    ✓ • 0ms

## Activity

    $ node /private/tmp/skirental-immediate-browser.cjs
    Browser checks passed: dates, desktop/mobile, keyboard immediate issue, reservation, no overflow/errors.
    ✓ • 1.20s

## Activity

    $ python3 - <<'PY'
        from pathlib import Path
        p=Path('README.md');s=p.read_text().replace('Preis buchen** drücken.', 'Preis buchen** drücken.')
        s=s.replace('Ein Paar auswählen und **Zum angezeigten\nPreis buchen** drücken.', 'Ein Paar auswählen. Bei Beginn heute **Buchen und ausgeben** für die sofortige\nÜbergabe oder **Nur buchen** für eine Reservierung drücken. Bei zukünftigem Beginn\nsteht **Buchen** zur Verfügung. Alle Buchungsbuttons bestätigen den angezeigten Preis.')
        s=s.replace('Die Buchung reserviert das Paar, zählt aber noch nicht als tatsächliche Ausgabe.', 'Eine reine Buchung reserviert das Paar, zählt aber noch nicht als tatsächliche Ausgabe.\n**Buchen und ausgeben** speichert Buchung und Übergabe gemeinsam und zählt sofort\nals ausgeliehen. Bei Fehlern, etwa einem noch nicht zurückgegebenen Paar, wird\nkeine Buchung gespeichert. Maßgeblich für „heute“ ist Europe/Vienna.')
        s=s.replace('Unter **Gebuchte Ausleihen** erfasst', 'Bei einer reinen Buchung erfasst unter **Gebuchte Ausleihen**')
        s=s.replace('Die\nSpezifikation, Prüfnachweis und Abnahme: [Phase 5](specs/05-termine-preise.md).','Die\nSpezifikation, Prüfnachweis und Abnahme: [Phase 5](specs/05-termine-preise.md).\nDie Erweiterung für sofortige Ausgabe ist implementiert; die Auftraggeberabnahme\nsteht noch aus: [Prüfnachweis](specs/06-buchen-und-ausgeben.md).')
        p.write_text(s)
        p=Path('specs/05-termine-preise.md');s=p.read_text().replace('{personID, skiID, startsOn, endsOn, tariffVersion}; 201 mit Location','{personID, skiID, startsOn, endsOn, tariffVersion, issueImmediately?}; optionales Boolean, Standard false; 201 mit Location');s+='\nErweiterung: [Buchen und ausgeben](06-buchen-und-ausgeben.md) beschreibt die optionale atomare Sofortausgabe bei Beginn heute.\n';p.write_text(s)
        PY
    ✓ • 0ms

## Activity

    Viewed image /Users/michael/Documents/Uni/_08_WS26_27/VO Software Engineering/Assignment1/Assignment1ab/specs/screenshots/06-buchen-ausgeben-mobil.png

## Activity

    $ python3 - <<'PY'
        from pathlib import Path
        p=Path('/private/tmp/skirental-immediate-browser.cjs');s=p.read_text().replace(" await page.screenshot({path:process.cwd()+'/specs/screenshots/06-buchen-ausgeben-mobil.png'", " await page.locator('#skiID').focus();\n await page.screenshot({path:process.cwd()+'/specs/screenshots/06-buchen-ausgeben-mobil.png'")
        s=s.replace(' assert.deepEqual(errors,[]);', ''' await page.locator('#endsOn').fill(tomorrow);await page.locator('#startsOn').fill(tomorrow);
         await page.locator('#check-period').click();await page.locator('#skiID').selectOption('demo-ski-01');
         const tariff=await (await page.request.get('http://127.0.0.1:8080/api/tarife')).json();
         tariff.pricesCents[0]+=100;
         assert.equal((await page.request.put('http://127.0.0.1:8080/api/tarife',{data:tariff})).status(),200);
         await page.getByRole('button',{name:'Buchen',exact:true}).click();
         await page.locator('#rental-error').filter({hasText:'Der Tarif wurde geändert'}).waitFor();
         assert.equal((await (await page.request.get('http://127.0.0.1:8080/api/ausleihen')).json()).length,2);
         await page.locator('#skiID').selectOption('demo-ski-01');
         await page.getByRole('button',{name:'Buchen',exact:true}).click();
         await page.getByText('Buchung gespeichert. Die tatsächliche Ausgabe bitte separat erfassen.',{exact:true}).waitFor();
         rentals=await (await page.request.get('http://127.0.0.1:8080/api/ausleihen')).json();
         assert.equal(rentals.length,3);assert.equal(rentals.find(r=>r.startsOn===tomorrow).status,'booked');
         assert.deepEqual(errors,[]);''')
        p.write_text(s)
        PY
    ✓ • 0ms

## Activity

    $ env GOCACHE=/private/tmp/skirental-go-cache /private/tmp/skirental-toolchain/go/bin/go run ./cmd/server -demo
    2026/10/22 18:51:43 SkiRental: http://127.0.0.1:8080 (Demomodus: true). Beenden mit Ctrl+C.
    ✗ (1) • 2m 28s

## Activity

    $ node /private/tmp/skirental-immediate-browser.cjs
    Browser checks passed: dates, desktop/mobile, keyboard immediate issue, reservation, no overflow/errors.
    ✓ • 1.17s

## Activity

    $ cat > specs/06-buchen-und-ausgeben.md <<'EOF'
        # Erweiterung: Buchen und ausgeben
        
        Status: implementiert und technisch geprüft am 22.10.2026.
        Die ausdrückliche Auftraggeberabnahme steht aus; noch kein Abschluss-Commit.
        
        ## Verhalten und Schnittstelle
        
        Bei Verleihbeginn heute (Europe/Vienna) bietet das Formular die Hauptaktion
        „Buchen und ausgeben“ sowie „Nur buchen“. Für spätere Termine gibt es „Buchen“.
        Alle drei Aktionen bestätigen den zuvor angezeigten Preis. Die separate Ausgabe
        bestehender Buchungen bleibt möglich.
        
        POST /api/ausleihen akzeptiert zusätzlich das optionale Boolean
        `issueImmediately` (Standard false). Bei true werden Buchung und Ausgabe unter
        einer gemeinsamen Store-Sperre geprüft und gespeichert. Die Antwort bleibt 201
        mit Location und den vorhandenen Ausleihfeldern, bei Sofortausgabe mit Status
        issued und gesetztem rentedAt. CreateRental bleibt für reine Buchungen erhalten;
        CreateAndIssueRental bietet die atomare Sofortausgabe.
        
        Bei zukünftiger Sofortausgabe, geändertem Tarif, überlappender Buchung oder noch
        nicht zurückgegebenem Paar wird nichts angelegt. Fachliche Konflikte liefern 409;
        ungültige Eingaben weiterhin 400. Fehlende oder false gesetzte Sofortausgabe
        behält den bisherigen Reservierungsablauf bei. Preis-/Verfügbarkeitskonflikte
        laden eine neue Vorschau und erfordern erneute Auswahl und Bestätigung.
        Während der Anfrage sind beide Buchungsbuttons gesperrt.
        
        ## Prüfnachweis
        
        Erfolgreich ausgeführt:
        
        - `go build ./...`
        - `go test ./...`
        - `go test -race ./...`
        - `go vet ./...`
        
        Store-Tests prüfen Sofortausgabe und Dashboardzahlen, Wien-Tageswechsel,
        Zukunftstermine, veralteten Tarif, Überschneidung und überfällige Vorgänger ohne
        Teiländerungen sowie 32 konkurrierende Sofortausgaben mit genau einem Erfolg.
        HTTP-Tests prüfen das neue Feld, Rückwärtskompatibilität, Status und Zeitstempel,
        Location, Fehlerantworten und einen erneuten Buchungsversuch ohne Doppelbuchung.
        Die vorhandenen Tests für Reservierung, Ausgabe, Rückgabe und MVP laufen mit.
        
        Browserprüfung mit Chrome: Desktop (1280 × 1000), schmaler Bildschirm (390 × 844),
        Sofortausgabe per Tastatur, reine Reservierung, Umschalten der Buttons bei
        Datumsänderung, erneute Preisprüfung und Zukunftsbuchung. Keine JavaScript-Fehler
        und kein horizontaler Überlauf. Tarifänderung nach Preisprüfung verhindert das
        Speichern und erfordert erneute Bestätigung des neuen Preises.
        
        Screenshots:
        
        - [Desktop](screenshots/06-buchen-ausgeben-desktop.png)
        - [Mobil](screenshots/06-buchen-ausgeben-mobil.png)
        
        Nach der Prüfung wird der Server mit frischen synthetischen Demodaten gestartet.
        Alle Daten bleiben wie bisher flüchtig. Keine neuen Abhängigkeiten.
        
        ## Offene Auftraggeberabnahme
        
        - [ ] „Buchen und ausgeben“ für heute speichert unmittelbar die Übergabe.
        - [ ] „Nur buchen“ lässt die spätere Ausgabe offen.
        - [ ] Zukünftige Termine bieten nur „Buchen“.
        - [ ] Bedienung und Rückmeldungen entsprechen dem gewünschten Verleihablauf.
        
        Erst nach ausdrücklicher Abnahme werden diese und der Prüfnachweis dokumentiert
        und die Änderungen gemäß AGENTS.md lokal committed.
        EOF
        git diff --check
    ✓ • 0ms

## Assistant

Auch die Browserprüfung ist bestanden: Sofortausgabe, reine Buchung, Zukunftstermine und erneute Preisbestätigung nach einer Tarifänderung funktionieren. Der Prüfnachweis und die Screenshots sind dokumentiert. Ich starte den Server jetzt mit frischen Demodaten für deine Prüfung neu.

## Activity

    Viewed image /Users/michael/Documents/Uni/_08_WS26_27/VO Software Engineering/Assignment1/Assignment1ab/specs/screenshots/06-buchen-ausgeben-desktop.png

## Activity

    $ env GOCACHE=/private/tmp/skirental-go-cache /private/tmp/skirental-toolchain/go/bin/go run ./cmd/server -demo
    2026/10/22 18:54:10 SkiRental: http://127.0.0.1:8080 (Demomodus: true). Beenden mit Ctrl+C.
    ✗ (1) • 36.71s

## Activity

    $ git diff --check; git status --short
     M README.md
     M internal/handler/booking_test.go
     M internal/handler/rental.go
     M internal/store/booking_test.go
     M internal/store/rental.go
     M specs/05-termine-preise.md
     M web/assets/ausleihe.js
    ?? specs/06-buchen-und-ausgeben.md
    ?? specs/screenshots/06-buchen-ausgeben-desktop.png
    ?? specs/screenshots/06-buchen-ausgeben-mobil.png
    ✓ • 0ms

## Assistant

Umgesetzt:

- Beginn heute: **„Buchen und ausgeben“** oder **„Nur buchen“**.
- Zukünftiger Beginn: **„Buchen“**.
- Buchung und Sofortausgabe werden gemeinsam gespeichert; bei Konflikten bleibt keine Buchung zurück.

Build, Tests inklusive Race-Tests, `go vet` und Browserprüfung bestanden.

Der Server läuft mit frischen Demodaten: [Ausleihe öffnen](http://127.0.0.1:8080/ausleihe). Bitte die Seite neu laden.

## Activity

    $ env GOCACHE=/private/tmp/skirental-go-cache /private/tmp/skirental-toolchain/go/bin/go run ./cmd/server -demo
    2026/10/22 18:54:51 SkiRental: http://127.0.0.1:8080 (Demomodus: true). Beenden mit Ctrl+C.
    ✓ • 60m 54s

## User

die änderung ist hiermit abgenommen. mach bitte einen commit und aktualisiere die dokumente auch entsprechend

## Assistant

Ich dokumentiere deine Abnahme und den Prüfnachweis und erstelle anschließend den lokalen Commit.

## Activity

    $ git status --short; cat specs/06-buchen-und-ausgeben.md; rg -n 'Erweiterung|Abnahme|Phase 5|Phase 6' README.md specs/roadmap.md specs/05-termine-preise.md
     M README.md
     M internal/handler/booking_test.go
     M internal/handler/rental.go
     M internal/store/booking_test.go
     M internal/store/rental.go
     M specs/05-termine-preise.md
     M web/assets/ausleihe.js
    ?? specs/06-buchen-und-ausgeben.md
    ?? specs/screenshots/06-buchen-ausgeben-desktop.png
    ?? specs/screenshots/06-buchen-ausgeben-mobil.png
    # Erweiterung: Buchen und ausgeben
    
    Status: implementiert und technisch geprüft am 22.10.2026.
    Die ausdrückliche Auftraggeberabnahme steht aus; noch kein Abschluss-Commit.
    
    ## Verhalten und Schnittstelle
    
    Bei Verleihbeginn heute (Europe/Vienna) bietet das Formular die Hauptaktion
    „Buchen und ausgeben“ sowie „Nur buchen“. Für spätere Termine gibt es „Buchen“.
    Alle drei Aktionen bestätigen den zuvor angezeigten Preis. Die separate Ausgabe
    bestehender Buchungen bleibt möglich.
    
    POST /api/ausleihen akzeptiert zusätzlich das optionale Boolean
    `issueImmediately` (Standard false). Bei true werden Buchung und Ausgabe unter
    einer gemeinsamen Store-Sperre geprüft und gespeichert. Die Antwort bleibt 201
    mit Location und den vorhandenen Ausleihfeldern, bei Sofortausgabe mit Status
    issued und gesetztem rentedAt. CreateRental bleibt für reine Buchungen erhalten;
    CreateAndIssueRental bietet die atomare Sofortausgabe.
    
    Bei zukünftiger Sofortausgabe, geändertem Tarif, überlappender Buchung oder noch
    nicht zurückgegebenem Paar wird nichts angelegt. Fachliche Konflikte liefern 409;
    ungültige Eingaben weiterhin 400. Fehlende oder false gesetzte Sofortausgabe
    behält den bisherigen Reservierungsablauf bei. Preis-/Verfügbarkeitskonflikte
    laden eine neue Vorschau und erfordern erneute Auswahl und Bestätigung.
    Während der Anfrage sind beide Buchungsbuttons gesperrt.
    
    ## Prüfnachweis
    
    Erfolgreich ausgeführt:
    
    - `go build ./...`
    - `go test ./...`
    - `go test -race ./...`
    - `go vet ./...`
    
    Store-Tests prüfen Sofortausgabe und Dashboardzahlen, Wien-Tageswechsel,
    Zukunftstermine, veralteten Tarif, Überschneidung und überfällige Vorgänger ohne
    Teiländerungen sowie 32 konkurrierende Sofortausgaben mit genau einem Erfolg.
    HTTP-Tests prüfen das neue Feld, Rückwärtskompatibilität, Status und Zeitstempel,
    Location, Fehlerantworten und einen erneuten Buchungsversuch ohne Doppelbuchung.
    Die vorhandenen Tests für Reservierung, Ausgabe, Rückgabe und MVP laufen mit.
    
    Browserprüfung mit Chrome: Desktop (1280 × 1000), schmaler Bildschirm (390 × 844),
    Sofortausgabe per Tastatur, reine Reservierung, Umschalten der Buttons bei
    Datumsänderung, erneute Preisprüfung und Zukunftsbuchung. Keine JavaScript-Fehler
    und kein horizontaler Überlauf. Tarifänderung nach Preisprüfung verhindert das
    Speichern und erfordert erneute Bestätigung des neuen Preises.
    
    Screenshots:
    
    - [Desktop](screenshots/06-buchen-ausgeben-desktop.png)
    - [Mobil](screenshots/06-buchen-ausgeben-mobil.png)
    
    Nach der Prüfung wird der Server mit frischen synthetischen Demodaten gestartet.
    Alle Daten bleiben wie bisher flüchtig. Keine neuen Abhängigkeiten.
    
    ## Offene Auftraggeberabnahme
    
    - [ ] „Buchen und ausgeben“ für heute speichert unmittelbar die Übergabe.
    - [ ] „Nur buchen“ lässt die spätere Ausgabe offen.
    - [ ] Zukünftige Termine bieten nur „Buchen“.
    - [ ] Bedienung und Rückmeldungen entsprechen dem gewünschten Verleihablauf.
    
    Erst nach ausdrücklicher Abnahme werden diese und der Prüfnachweis dokumentiert
    und die Änderungen gemäß AGENTS.md lokal committed.
    README.md:7:bearbeitet werden. Die Abnahme erfolgte am 20.10.2026. Phase 2 ist implementiert,
    README.md:12:abgenommen. Damit ist der vereinbarte MVP abgeschlossen. Gesamtprüfnachweis und Abnahmeliste stehen in
    README.md:14:Phase 5 ist implementiert, technisch geprüft und am 21.10.2026 ausdrücklich
    README.md:17:Spezifikation, Prüfnachweis und Abnahme: [Phase 5](specs/05-termine-preise.md).
    README.md:18:Die Erweiterung für sofortige Ausgabe ist implementiert; die Auftraggeberabnahme
    README.md:27:Die zur Abnahme verwendete Toolchain ist Go 1.27.3 für macOS/arm64 aus den
    README.md:114:Abnahmeliste in [specs/03-dashboard.md](specs/03-dashboard.md).
    README.md:139:### Buchung, Ausgabe und Rückgabe bedienen (Phase 5)
    README.md:185:Schnittstellen, Regeln und Prüfnachweis: [Phase 5](specs/05-termine-preise.md).
    specs/05-termine-preise.md:1:# Phase 5 – Verleihtermine, Buchungen und Preise
    specs/05-termine-preise.md:124:Der Auftraggeber hat Phase 5 nach Bereitstellung der Implementierung, des
    specs/05-termine-preise.md:126:mit „phase 5 ist hiermit abgenommen“ bestätigt. Damit ist Phase 5 abgeschlossen.
    specs/05-termine-preise.md:129:`Phase 5: Verleihtermine und Tarifverwaltung abschließen` gesichert.
    specs/05-termine-preise.md:131:Die folgende Liste bleibt als Abnahmeleitfaden erhalten; einzelne manuelle
    specs/05-termine-preise.md:134:Abnahmeliste:
    specs/05-termine-preise.md:144:Erweiterung: [Buchen und ausgeben](06-buchen-und-ausgeben.md) beschreibt die optionale atomare Sofortausgabe bei Beginn heute.
    specs/roadmap.md:14:Phase 5 erweitert den MVP und ist implementiert, technisch geprüft und am
    specs/roadmap.md:27:werden Abnahmestatus und Prüfnachweis aktualisiert. Phase 1 ist mit
    specs/roadmap.md:44:**Toolchain:** Für die Abnahme wurde Go 1.27.3 temporär eingerichtet. Version und
    specs/roadmap.md:48:**Abnahme:**
    specs/roadmap.md:78:**Abnahme:**
    specs/roadmap.md:94:**Abnahme:**
    specs/roadmap.md:113:**Abnahme:**
    specs/roadmap.md:121:## Phase 4 – MVP-Abnahme und Dokumentation
    specs/roadmap.md:125:Spezifikation, Prüfnachweis, Screenshots und Abnahmeliste:
    specs/roadmap.md:127:die Phase wird mit dem lokalen Commit `Phase 4: MVP-Abnahme und Dokumentation abschließen` gesichert.
    specs/roadmap.md:132:**Abnahme:** Mit synthetischen Daten wird im Browser ein vollständiger Ablauf
    specs/roadmap.md:139:## Phase 5 – Verleihtermine, Buchungen und Preise
    specs/roadmap.md:149:**Abnahme:** Kalenderdauer, überschneidungsfreie parallele Buchungen, Ausgabe nur
    specs/roadmap.md:155:`Phase 5: Verleihtermine und Tarifverwaltung abschließen` gesichert.
    specs/roadmap.md:157:## Spätere Erweiterungen
    specs/roadmap.md:160:Sie werden erst nach einer bewussten Erweiterung der Mission eingeplant.
    ✓ • 0ms

## Activity

    $ sed -n '1,32p' specs/roadmap.md; sed -n '139,175p' specs/roadmap.md; sed -n '14,23p' README.md
    # SkiRental – SDD-Roadmap
    
    ## Vorgehen und aktueller Stand
    
    Phase 0 ist vom Auftraggeber abgenommen; siehe dessen Bestätigung, auf die der
    Phase-1-Implementierungsauftrag vom 20.10.2026 verweist. Phase 1 ist implementiert,
    geprüft und am 20.10.2026 ausdrücklich vom Auftraggeber abgenommen. Phase 2 ist implementiert, geprüft
    und am 21.10.2026 ausdrücklich vom Auftraggeber abgenommen. Phase 3 ist implementiert, geprüft
    und am 21.10.2026 ausdrücklich vom Auftraggeber abgenommen. Phase 4 ist implementiert
    und geprüft sowie am 21.10.2026 ausdrücklich vom Auftraggeber abgenommen. Details und
    Prüfnachweise stehen in [00-projektgeruest.md](00-projektgeruest.md),
    [01-verwaltung.md](01-verwaltung.md), [02-ausleihe.md](02-ausleihe.md) und
    [03-dashboard.md](03-dashboard.md) sowie [04-mvp-abnahme.md](04-mvp-abnahme.md).
    Phase 5 erweitert den MVP und ist implementiert, technisch geprüft und am
    21.10.2026 ausdrücklich vom Auftraggeber abgenommen; siehe
    [05-termine-preise.md](05-termine-preise.md). Diese Roadmap ordnet Arbeit nach
    Abhängigkeiten; sie enthält keine zugesagten Termine.
    
    Für jede Phase gilt: **Spezifizieren → Aufgaben ableiten → Implementieren →
    Prüfen → Abnehmen**. Vor dem Code entsteht eine Feature-Spezifikation unter
    `specs/`, für Phase 1 `specs/01-verwaltung.md`, mit Nutzerablauf, Daten,
    Geschäftsregeln, API-Verhalten, Fehlerfällen und überprüfbaren Akzeptanzkriterien.
    Die drei Verfassungsdateien bleiben die gemeinsame Grundlage.
    
    Ab sofort folgt auf jede ausdrücklich bestätigte Auftraggeberabnahme ein lokaler
    Git-Commit mit verständlicher Benennung von Phase und Ergebnis. Vor dem Commit
    werden Abnahmestatus und Prüfnachweis aktualisiert. Phase 1 ist mit
    `98354ce` (`Phase 1: Personen- und Skiverwaltung abschließen`) gesichert, Phase 2
    mit `237dc0a` (`Phase 2: Ausleihe und Rückgabe abschließen`), Phase 3 mit
    `da55add` (`Phase 3: Dashboard und durchgängige Bedienung abschließen`).
    
    ## Phase 0 – Fachliche Entscheidungen und Projektgerüst
    ## Phase 5 – Verleihtermine, Buchungen und Preise
    
    **Status:** Planung am 21.10.2026 abgeschlossen; Implementierung anschließend
    explizit beauftragt, technisch geprüft und am selben Tag ausdrücklich vom
    Auftraggeber abgenommen: „phase 5 ist hiermit abgenommen“.
    
    **Ergebnis:** Terminbezogene Buchung mit Preisvorschau, ausdrücklicher Ausgabe,
    Rückgabe und Stornierung sowie bearbeitbare gemeinsame Tarifstaffel.
    Spezifikation und Prüfnachweis: [05-termine-preise.md](05-termine-preise.md).
    
    **Abnahme:** Kalenderdauer, überschneidungsfreie parallele Buchungen, Ausgabe nur
    im Zeitraum und nach tatsächlicher Rückgabe vorheriger Ausleihen, unveränderliche
    Buchungspreise, Tarifkonflikte, konsistente Bestandszahlen und vollständiger
    Browserablauf in Normal-/Demomodus. Build, Tests, Race und Vet müssen bestehen.
    Die Auftraggeberabnahme ist separat im Phase-5-Prüfnachweis dokumentiert.
    Der abgenommene Stand wird mit dem lokalen Commit
    `Phase 5: Verleihtermine und Tarifverwaltung abschließen` gesichert.
    
    ## Spätere Erweiterungen
    
    Dauerhafte Speicherung, Benutzerkonten, Zahlungen sowie ein Kundenportal benötigen eine eigene Priorisierung und Spezifikation.
    Sie werden erst nach einer bewussten Erweiterung der Mission eingeplant.
    Phase 5 ist implementiert, technisch geprüft und am 21.10.2026 ausdrücklich
    vom Auftraggeber abgenommen: Terminbuchungen, ausdrückliche
    Ausgabe, Stornierung und dauerabhängige Preise mit Tarifverwaltung. Die
    Spezifikation, Prüfnachweis und Abnahme: [Phase 5](specs/05-termine-preise.md).
    Die Erweiterung für sofortige Ausgabe ist implementiert; die Auftraggeberabnahme
    steht noch aus: [Prüfnachweis](specs/06-buchen-und-ausgeben.md).
    
    ### Voraussetzungen und Start
    
    Go **1.27.3 oder neuer**, für Race-Tests zusätzlich ein C-Compiler (unter macOS
    ✓ • 0ms

## Activity

    $ python3 - <<'PY'
        from pathlib import Path
        p=Path('README.md');s=p.read_text().replace('Die Erweiterung für sofortige Ausgabe ist implementiert; die Auftraggeberabnahme\nsteht noch aus: [Prüfnachweis](specs/06-buchen-und-ausgeben.md).','Phase 6 (Buchen und sofort ausgeben) ist implementiert, technisch geprüft und am\n22.10.2026 ausdrücklich vom Auftraggeber abgenommen:\n[Prüfnachweis und Abnahme](specs/06-buchen-und-ausgeben.md).');p.write_text(s)
        p=Path('specs/06-buchen-und-ausgeben.md');s=p.read_text().replace('# Erweiterung: Buchen und ausgeben','# Phase 6 – Buchen und ausgeben').replace('Die ausdrückliche Auftraggeberabnahme steht aus; noch kein Abschluss-Commit.','Am 22.10.2026 ausdrücklich vom Auftraggeber abgenommen.').replace('Nach der Prüfung wird der Server mit frischen synthetischen Demodaten gestartet.','Nach der Prüfung wurde der Server mit frischen synthetischen Demodaten gestartet.').replace('## Offene Auftraggeberabnahme','## Auftraggeberabnahme am 22.10.2026').replace('- [ ]','- [x]');s=s.replace('Erst nach ausdrücklicher Abnahme werden diese und der Prüfnachweis dokumentiert\nund die Änderungen gemäß AGENTS.md lokal committed.','Der Auftraggeber hat die bereitgestellte Änderung ausdrücklich mit\n„die änderung ist hiermit abgenommen. mach bitte einen commit und aktualisiere\ndie dokumente auch entsprechend“ bestätigt. Damit ist Phase 6 abgeschlossen.\nDie Abnahme beruht auf dieser ausdrücklichen Bestätigung; sie wird nicht allein\naus bestandenen technischen Prüfungen abgeleitet.\n\nAbnahme und obiger Prüfnachweis werden vor dem lokalen Abschluss-Commit\n`Phase 6: Buchung mit sofortiger Ausgabe abschließen` dokumentiert.');p.write_text(s)
        p=Path('specs/roadmap.md');s=p.read_text().replace('[05-termine-preise.md](05-termine-preise.md). Diese Roadmap ordnet Arbeit nach','[05-termine-preise.md](05-termine-preise.md). Phase 6 ergänzt die sofortige Ausgabe\nbei der Buchung und ist implementiert, technisch geprüft und am 22.10.2026\nausdrücklich abgenommen; siehe [06-buchen-und-ausgeben.md](06-buchen-und-ausgeben.md).\nDiese Roadmap ordnet Arbeit nach');s=s.replace('## Spätere Erweiterungen','''## Phase 6 – Buchen und ausgeben
        
        **Status:** Implementiert, technisch geprüft und am 22.10.2026 ausdrücklich vom
        Auftraggeber abgenommen: „die änderung ist hiermit abgenommen“.
        
        **Ergebnis:** Bei Beginn heute stehen „Buchen und ausgeben“ und „Nur buchen“ zur
        Wahl; zukünftige Termine bieten „Buchen“. Sofortausgabe und Buchung werden atomar
        mit Preis-, Termin- und Ausgabekonfliktprüfung gespeichert.
        
        **Prüfnachweis:** Build, Go-Tests, Race-Tests und Vet bestanden; Browserprüfung auf
        Desktop und mobilem Bildschirm einschließlich Tastaturbedienung und Tarifkonflikt.
        Details, Screenshots und Abnahme: [06-buchen-und-ausgeben.md](06-buchen-und-ausgeben.md).
        Der abgenommene Stand wird mit dem lokalen Commit
        `Phase 6: Buchung mit sofortiger Ausgabe abschließen` gesichert.
        
        ## Spätere Erweiterungen''');p.write_text(s)
        PY
        git diff --check
        git diff --stat
     README.md                        | 15 +++++---
     internal/handler/booking_test.go | 62 +++++++++++++++++++++++++++++++++
     internal/handler/rental.go       | 17 +++++----
     internal/store/booking_test.go   | 74 ++++++++++++++++++++++++++++++++++++++++
     internal/store/rental.go         | 37 +++++++++++++++++---
     specs/05-termine-preise.md       |  4 ++-
     specs/roadmap.md                 | 20 ++++++++++-
     web/assets/ausleihe.js           | 33 ++++++++++++------
     8 files changed, 235 insertions(+), 27 deletions(-)
    ✓ • 0ms

## Activity

    $ git add README.md internal/handler/booking_test.go internal/handler/rental.go internal/store/booking_test.go internal/store/rental.go specs/05-termine-preise.md specs/roadmap.md specs/06-buchen-und-ausgeben.md specs/screenshots/06-buchen-ausgeben-desktop.png specs/screenshots/06-buchen-ausgeben-mobil.png web/assets/ausleihe.js
    ✓ • 0ms

## Activity

    $ git commit -m "Phase 6: Buchung mit sofortiger Ausgabe abschließen"
    [main 903d54d] Phase 6: Buchung mit sofortiger Ausgabe abschließen
     11 files changed, 306 insertions(+), 27 deletions(-)
     create mode 100644 specs/06-buchen-und-ausgeben.md
     create mode 100644 specs/screenshots/06-buchen-ausgeben-desktop.png
     create mode 100644 specs/screenshots/06-buchen-ausgeben-mobil.png
    ✓ • 0ms

## Activity

    $ git status --short
    ✓ • 0ms

## Assistant

Abnahme vom 22.10.2026 in README, Roadmap und Prüfnachweis dokumentiert.

Lokaler Commit: `903d54d` — `Phase 6: Buchung mit sofortiger Ausgabe abschließen`

Arbeitsverzeichnis ist sauber.
