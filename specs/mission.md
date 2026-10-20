# SkiRental – Mission und Produktverfassung

## Zweck und Geltungsbereich

SkiRental unterstützt Mitarbeiter eines Skiverleihs beim Erfassen von Kunden,
Verwalten von Ski und Abwickeln von Ausleihen. Das System soll einfach,
übersichtlich und ohne technische Vorkenntnisse bedienbar sein.

Diese Verfassung bildet die Grundlage der spezifikationsgetriebenen Entwicklung
(SDD). Produktanforderungen stammen aus [README.md](../README.md); technische
Leitplanken aus `Template CLAUDE.rtf` und [AGENTS.md](../AGENTS.md).
[tech-stack.md](tech-stack.md) konkretisiert die Technik,
[roadmap.md](roadmap.md) die Umsetzung und Abnahme.

## Verbindliche Prinzipien

1. **Bedienbarkeit zuerst:** Häufige Aufgaben sind direkt erreichbar;
   Beschriftungen und Fehlermeldungen sind verständlich und deutschsprachig.
2. **Korrekte Bestände:** Ausleihen und Rückgaben halten Verfügbarkeit und
   Dashboard konsistent. Ungültige Aktionen verändern keine Daten.
3. **Einfacher Prototyp:** Verständliche, leicht änderbare Lösungen haben Vorrang.
   Zusätzliche Infrastruktur benötigt eine begründete Anpassung der Verfassung.
4. **Datensparsame Entwicklung:** Tests und Vorführungen verwenden ausschließlich
   synthetische Personen- und Ausweisdaten.
5. **Spezifikation vor Implementierung:** Jede Funktion erhält vor ihrer
   Umsetzung überprüfbare Akzeptanzkriterien.

## MVP aus dem README

- **M-01 – Personen:** Mitarbeiter erfassen einen Namen. Das System vergibt eine
  eindeutige ID automatisch. Als Ausweisnachweis wird entweder ein Foto erfasst
  oder eine Ausweisnummer zusammen mit einer per Dropdown gewählten Ausweisart.
- **M-02 – Ausleihe:** Einem registrierten Kunden kann ein aktuell verfügbarer
  Ski zugeordnet werden. Die Registrierung eines neuen Kunden führt unmittelbar
  zur Möglichkeit, eine Ausleihe anzulegen.
- **M-03 – Dashboard:** Die Startseite zeigt verfügbare Ski, ausgeliehene Ski,
  den Gesamtbestand und die Anzahl registrierter Personen.
- **M-04 – Navigation:** Das Dashboard bietet Schnellzugriffe auf
  „Ski verwalten“, „Personen verwalten“ und „Neue Ausleihe“.

## Ergänzende MVP-Festlegungen

Die folgenden Entscheidungen ergänzen das README als Arbeitsgrundlage:

- Ein Inventareintrag „Ski“ bezeichnet ein eindeutig identifizierbares Paar Ski.
  Das Paar wird gemeinsam ausgeliehen und zurückgegeben. Sämtliche Ski-Zahlen
  im Dashboard zählen Paare.
- Bei manueller Ausweiserfassung stehen „Personalausweis“, „Reisepass“,
  „Führerschein“ und „Sonstiger Ausweis“ zur Auswahl. Eine Ausweisnummer ist
  erforderlich; bei „Sonstiger Ausweis“ zusätzlich eine nicht leere Bezeichnung.
- Alternativ wird genau ein Ausweisfoto im Format JPEG oder PNG mit maximal
  5 MiB (5.242.880 Byte) erfasst. Die Dekodierung ist zum Schutz des Arbeitsspeichers
  auf 20 Millionen Pixel begrenzt (Präzisierung in Phase 1). Foto und manuelle Ausweiserfassung sind
  alternative Nachweisarten.
- Mitarbeiter wählen den verfügbaren Ski aus; eine automatische Auswahl ist
  zunächst nicht vorgesehen. Pro Ausleihe werden ein Kunde und ein Ski verknüpft.
- Ein Ski darf höchstens eine aktive Ausleihe haben. Eine Rückgabe beendet diese
  und macht den Ski erneut verfügbar.
- Der MVP umfasst das Anlegen, Anzeigen und Bearbeiten von Personen und Ski.
  Löschen, Wartungszustände und Reservierungen sind zunächst ausgeschlossen.
- Der Gesamtbestand entspricht verfügbaren plus ausgeliehenen Ski.

## Grenzen und Erfolgskriterien

Der MVP ist ein lokaler Prototyp für Mitarbeiter. Kundenportal, Zahlungen,
Tarife, Reservierungen, dauerhafte Speicherung, Benutzerkonten und produktiver
Betrieb sind nicht Bestandteil dieser Roadmap. Daten gehen beim Neustart verloren.

Die Anwendung startet standardmäßig ohne Daten. Ein optionaler Demomodus lädt
zwei Ski-Paare und eine synthetische Person mit manuellem Ausweisnachweis, ohne
aktive Ausleihe oder Ausweisfoto. Die Oberfläche weist auf die flüchtige
Speicherung und im Demomodus zusätzlich auf die Verwendung von Beispieldaten hin.

Der MVP ist erfolgreich, wenn ein Mitarbeiter eine Person registrieren, einen
verfügbaren Ski ausleihen und zurücknehmen kann und das Dashboard danach korrekte
Werte zeigt. Doppelte Ausleihen müssen auch bei gleichzeitigen Anfragen scheitern.

## Umgang mit Änderungen

Änderungen an Umfang oder Prinzipien werden zuerst in diesen drei Dateien
dokumentiert und begründet. Feature-Spezifikationen müssen dazu passen. Offene
fachliche Fragen werden vor der betroffenen Implementierung geklärt; die
Verfassung wird nicht stillschweigend durch Code überschrieben.
