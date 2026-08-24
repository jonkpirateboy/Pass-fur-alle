# Pass für alle

A Tampermonkey userscript that helps search for available passport or national ID card appointments in the Swedish Police's current booking service.

The script does not sign in for you and does not handle BankID. You sign in at the Police website yourself, choose the number of applicants and passport offices, and then let the script keep searching until it finds an available appointment within your configured date range.

*If the script stops working, check for updates. The Police may have changed their booking service again.*

My site about [Pass für alle](https://passfuralle.se/) (in Swedish).

## Install

* Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
* Download the code, easiest by clicking [Download ZIP](https://github.com/jonkpirateboy/Pass-fur-alle/archive/refs/heads/main.zip).
* Extract the zip file.
* Click the Tampermonkey icon and choose `Create a new script`.
* Open `pass-fur-alle.js` in a plain text editor.
* Copy all code from `pass-fur-alle.js` and paste it into the Tampermonkey editor, replacing whatever is already there.
* Change the date settings if needed, see [Settings](#settings).
* Save the script.

## Settings

The settings are near the top of `pass-fur-alle.js`:

```javascript
// Change dates here:
var dateFrom = today();
var dateTo = '2027-12-24';

// Constants
var searchRetryDelayMs = 1;
```

### First accepted date

By default, the script accepts appointments from today:

```javascript
var dateFrom = today();
```

To start from another date, use the `YYYY-MM-DD` format:

```javascript
var dateFrom = '2026-08-24';
```

### Last accepted date

`dateTo` is the last date the script may accept:

```javascript
var dateTo = '2027-12-24';
```

If the booking page moves past `dateTo`, the script goes back to the search step and searches again.

### Delay between searches

`searchRetryDelayMs` controls how long the script waits between attempts, in milliseconds:

```javascript
var searchRetryDelayMs = 1;
```

Example: `3000` means 3 seconds.

## Run the damn thing

* Go to the Police booking service for passports and national ID cards: [etjanster.polisen.se/etidsbokning/passnid/boka/sok](https://etjanster.polisen.se/etidsbokning/passnid/boka/sok).
* Sign in with BankID.
* On step 1, choose the number of applicants and whether everyone lives in Sweden.
* Choose one or more passport offices in the Police website's own field. The Police allows up to 4 locations.
* Click the script's `Sök tid mellan ...` button.
* The script searches for appointments between `dateFrom` and `dateTo`.
* When an appointment is found, the script selects it, plays a sound, and stops.
* If no appointment is found, the script keeps searching.

You can stop the search with `Avbryt` in the script's loading overlay. On step 2, it uses the Police website's own back function to return to the search step.
