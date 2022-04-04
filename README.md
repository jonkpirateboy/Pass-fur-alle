# Pass für alle

Since Polisens web queueing solution for getting a passport sucks, and it is more or less impossible to book a time, I wrote this small javascript. What it does is that it automates the searching for a bookable time. In the file you just change the constants to your preferred booking dates and away you go. :) More or less.

*If the script you have on your computer stops working, make sure to check for updates and download the latest version.*

My site about [Pass für alle](https://passfuralle.se/) (in Swedish)

## Settings

In the script there are some constainst that you need to change, they are found under the comment `// Constants`

### Start searching today.

`dateFrom = datetime.today().strftime('%Y-%m-%d')`

If you want to start some other day, just change this to a date with the format YYYY-MM-DD

`dateFrom = '2022-08-24'`

### The last date you want to search for

`dateTo = '2022-12-24'`

## Install

* Download the code to your computer, easiest way is to click . Same a the green Code-button, followed by [Download Zip](https://github.com/jonkpirateboy/Pass-fur-alle/archive/refs/heads/main.zip)
* Go to [Tampermonkey](https://www.tampermonkey.net/) and install the addon to your browser.
* Click the new icon in your browser for Tampermonkey and click `Create a new script`.
* Copy and paste the code (replace the code that is there) from `pass-fur-alle.js` to the editor in the browser and save.

## Run the damn thing

* Go to the booking site.
* On the step 4, where you search for free slots the buttons are changed to work for you, instead of you working for the buttons.
* Click whatever suits you, and the site will try to find you a good slot.
* When a slot has been found you will get an alert, click OK to continue.
