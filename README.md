# Pass für alle

Since Polisens web queueing solution for getting a passport sucks, and it is more or less impossible to book a time, I wrote this small python script. What it does is that it automates the searching for a bookable time. In the file you just change the constants to your information and away you go. :) More or less.

## Settings

In the script there are some constainst that you need to change, they are found under the comment `# Constants`

### Start searching today.

If you want to start some other day, just change this to a date with the format YYYY-MM-DD

`startBookingDate = datetime.today().strftime('%Y-%m-%d')`

### The last date you want to search for

`endBookingDate = "2022-05-25"`

### Your first name

`firstName = 'Test'`

### Your last name

`lastName = 'Testsson'`

### Your email

`emailAddress = 'test@test.se'`

### Your phone number

`phoneNumber = '076127567'`

### Manual verify

Change this to False if you want the script to automatically book the time in the last step (recommended)

`manualVerify = True`

Instructions for [MacOS](#what-you-need-for-running-on-macos), [Linux](#what-you-need-for-running-on-linux) and [Windows](#what-you-need-for-running-on-windows) (not yet)

# Prerequisites

## What you need for running on MacOS

* Google Chrome
* Homebrew
* Python 3
* Selenium
* Chromedriver

### Install Google Chrome
Go to [https://www.google.com/chrome/](www.google.com/chrome) and follow the instructions

### Install homebew
Open a [Terminal](#terminal) and enter

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

### Install Python 3 (should be pre installed on all macs, but you never know)
Open a [Terminal](#terminal) and enter

`brew install python3`

### Install Selenium
Open a [Terminal](#terminal) and enter

`pip3 install selenium`

### Install Chromedriver
Open a [Terminal](#terminal) and enter

`brew install chromedriver`

### Run the damn thing
Open a Terminal and go to the folder where you downloaded the script, probably *Downloads/Pass-fur-alle-main*, and you go there by entering `cd Downloads/Pass-fur-alle-main`
Then enter: `python3 pass-fur-alle.py`

## What you need for running on Linux

* Google Chrome
* PIP3
* Selenium
* Chromedriver

### Install Google Chrome
Go to [https://www.google.com/chrome/](www.google.com/chrome) and follow the instructions

### Install PIP3
Open a Terminal and enter

`sudo apt-get install python3-pip`

### Install Selenium
Open a Terminal and enter

`pip3 install selenium`

### Install Chromedriver
Open a Terminal and enter

`sudo apt-get install chromium-chromedriver`
or
`sudo apt-get install chromedriver`

If your Linux doesn't have Chomedriver in apt, go to [chromedriver.storage.googleapis.com](https://chromedriver.storage.googleapis.com/index.html) and download a version compatible with your Chrome browser and extract the zip. Then run these commands:

`sudo mv -f ~/Downloads/chromedriver /usr/local/share/`

`sudo chmod +x /usr/local/share/chromedriver`

`sudo ln -s /usr/local/share/chromedriver /usr/local/bin/chromedriver`

`sudo ln -s /usr/local/share/chromedriver /usr/bin/chromedriver`

### Run the damn thing
Open a Terminal and go to the folder where you downloaded the script, probably *Downloads/Pass-fur-alle-main*, and you go there by entering `cd Downloads/Pass-fur-alle-main`
Then enter: `python3 pass-fur-alle.py`

## What you need for running on Windows

I don't know yet, but I'm probably going to find out.

## Glossary

### Terminal
If you don't know what a terminal is; think of it as the thing you see on the news when something has been hacked, and there's a picture of someone in a hoodie is leaning over a computer? Or that time you saw Wargames, The Matrix, Mr Robot or even Hackers? That's the terminal.
To find *Terminal*, open *Launchpad* and the folder *Other* and there it is. Or open *Spotlight* and type *Terminal*.
