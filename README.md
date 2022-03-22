# Pass für alle

Since Polisens web queueing solution for getting a passport sucks, and it is more or less impossible to book a time, I wrote this small python script. What it does is that it automates the searching for a bookable time. In the file you just change the constants to your information and away you go. :) More or less.

Instructions for [MacOS](#what-you-need-for-running-on-macos), [Linux](#what-you-need-for-running-on-linux) and [Windows](#what-you-need-for-running-on-windows) (not yet)

## What you need for running on MacOS

* Homebrew
* Selenium
* Chromedriver

### Install homebew
Open a [Terminal](#terminal) and enter
`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

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

* PIP3
* Selenium
* Chromedriver

### Install PIP3
Open a Terminal and enter
`sudo apt-get install python3-pip`

### Install Selenium
Open a Terminal and enter
`pip3 install selenium`

### Install Chromedriver
Open a Terminal and enter
`sudo apt-get install chromium-chromedriver`

### Run the damn thing
Open a Terminal and go to the folder where you downloaded the script, probably *Downloads/Pass-fur-alle-main*, and you go there by entering `cd Downloads/Pass-fur-alle-main`
Then enter: `python3 pass-fur-alle.py`

## What you need for running on Windows

I don't know yet, but I'm probably going to find out.

## Glossary

### Terminal
If you don't know what a terminal is; think of it as the thing you see on the news when something has been hacked, and there's a picture of someone in a hoodie is leaning over a computer? Or that time you saw Wargames, The Matrix, Mr Robot or even Hackers? That's the terminal.
To find *Terminal*, open *Launchpad* and the folder *Other* and there it is. Or open *Spotlight* and type *Terminal*.
