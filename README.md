# iOS-Widget für Datenverbrauch im Telekom-Netz
### (Forked from [Sillium/telekom.js](https://gist.github.com/Sillium/f904fb89444bc8dde12cfc07b8fa8728))

![](https://i.imgur.com/hgrwim3.png)

- "API offline" wird angezeigt, wenn datapass.de nicht aufgerufen werden kann (z.B. wenn WLAN aktiv ist)
- verbleibende Zeit wird rot angezeigt, wenn weniger als 3 Tage verbleiben
- Komplett Dark- und Lightmode kompatibel
- funktioniert mit allen Telekom-Tarifen mit Datenvolumen, die Zugriff auf datapass.de haben (z.B. auch Prepaid-Discounter von congstar)

### Bugs
```
if (data.passName == "Ihr Datenvolumen" || data.passName == "Ihr Telekom Datentarif") {
  line1 = list.addText("Datenvolumen")
} else {
  line1 = list.addText("Pass: " + data.passName)
}
```
Diese Code-Zeilen werden verwendet, um normales Inklusivvolumen von evtl. gebuchten Datenpässen unterscheiden zu können.
Hier kann es zu Problemen kommen, wenn das gebuchte Datenvolumen einen anderen Passnamen hat. Hier hilft es, den Passnamen selbst zu recherchieren und den Code entsprechend anzupassen.

### Fixes
- 26.10.20: Zeile 49 angepasst um ein weiteres Szenario für den Pass-Namen abzudecken
- 27.10.20: Kleiner Fehler in Zeile 49 korrigiert
- 31.10.20: 
**Auf Wunsch kann jetzt in der oberen rechten Ecke ein Logo angezeigt werden. Ein Telekom-Logo habe ich vorkonfiguriert, wer ein anderes Logo möchte, muss die URL in Zeile 119 anpassen. Aktiviert wird das Logo, indem das Widget den Parameter _logo_ übergeben bekommt.**
- 31.10.20: Logik-Fehler bei der Farbgebung des verbleibenden Volumens korrigiert
- 01.11.20: **Anzeige der letzten Aktualisierung bezieht sich jetzt auf die Uhrzeit des letzten Abrufs von Datapass**


#### **Für einen alternativen Fork mit einigen nützlichen Änderungen, hier entlang >>>**
#### [https://gist.github.com/JoeGit42/bffae224a1398d2c35097fdefe2f4a0c](https://gist.github.com/JoeGit42/bffae224a1398d2c35097fdefe2f4a0c)
