# Pass für alle

Since Polisens web queueing solution for getting a passport sucks, and it is more or less impossible to book a time, I wrote this small javascript. What it does is that it automates the searching for a bookable time. In the file you just change the constants to your preferred booking dates and away you go. :) More or less.

*If the script you have on your computer stops working, make sure to check for updates and download the latest version.*

My site about [Pass für alle](https://passfuralle.se/) (in Swedish)

## Install

* Download the code to your computer, easiest way is to click [here](https://github.com/jonkpirateboy/Pass-fur-alle/archive/refs/heads/main.zip). This is the same file you get when clicking the green *Code*-button, followed by *Download Zip*. Extract the zip-file.
* Go to [Tampermonkey](https://www.tampermonkey.net/) and install the addon to your browser.
* Click the new icon in your browser for Tampermonkey and click `Create a new script`.
* Open the `pass-fur-alle.js` file with a simple text editor like TextEdit, Notepad or something like that.
* Copy all the code from `pass-fur-alle.js` and paste it in the Tampermonkey editor in the browser (replacing whatever is there) and save. If you want to change dates or other settings, read more under [Settings](#settings) below. 
* After that, read [Run the damn thing](#run-the-damn-thing).

## Settings

In the script there are some constainst that you need to change, they are found under the comment `// Constants`

### Start searching today.

`var dateFrom = today();`

If you want to start some other day, just change this to a date with the format YYYY-MM-DD, for example:

`var dateFrom = '2022-08-24';`

### The last date you want to search for

`var dateTo = '2022-12-24';`

### Auto confirm time 

`var autoConfirm = true;`

If you don't want to allow auto confirm of found time slot, change to `false`.

`var autoConfirm = false;`

## Run the damn thing

* Go to the [booking page](https://polisen.se/tjanster-tillstand/pass-och-nationellt-id-kort/boka-tid-hitta-passexpedition/) and click on where you want to book.
* On step 4, where you search for free slots, the buttons are changed to work for you, instead of you working for the buttons.
* Click whatever suits you, and the site will try to find you a good slot.
* When a slot has been found you will hear a bell ring and you can now finish the booking of your time.