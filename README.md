# Pass für alle

Since Polisens web queueing solution for getting a passport sucks, and it is more or less impossible to book a time, I wrote this small python script. What it does is that it automates the searching for a bookable time. In the file you just change the constants to your information and away you go. :) More or less.

## Settings

In the script there are some constainst that you need to change, they are found under the comment `# Constants`

### Start searching today.

If you want to start some other day, just change this to a date with the format YYYY-MM-DD

`startBookingDate = datetime.today().strftime('%Y-%m-%d')`

### The last date you want to search for

`endBookingDate = "2022-05-25"`

### First available time

Some say faster, some say slower. But a good addition nevertheless. If you want to look for the first date using "First available time", change to True. Added by @granstubbe

`firstDate = False`

### People

#### One person

Change `firstName` to your first name and `lastName` to your last name.

`people = [<br/>
    {<br/>
        "firstName": "Test",<br/>
        "lastName": "Testsson"<br/>
    }<br/>
]`

#### Multiple people

If you want to book for multiple people, simply add people like this.

`people = [<br/>
    {<br/>
        "firstName": "Test",<br/>
        "lastName": "Testsson"<br/>
    },<br/>
    {<br/>
        "firstName": "Testina",<br/>
        "lastName": "Testlund"<br/>
    }<br/>
]`

### Your email

`emailAddress = 'test@test.se'`

### Your phone number

`phoneNumber = '076127567'`

### Manual verify

Change this to False if you want the script to automatically book the time in the last step (recommended)

`manualVerify = True`

Instructions for [MacOS](#what-you-need-for-running-on-macos), [Linux](#what-you-need-for-running-on-linux) and [Windows](#what-you-need-for-running-on-windows)

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

### Install Python 3
This should be pre installed on all macs, but you never know. Check by opening a [Terminal](#terminal) and enter

`python3 --version``

If you get a response saying something like *Python 3.x.x* skip to [Selenium](#install-selenium)

If you don't have Python 3 installed, open a [Terminal](#terminal) and enter

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

* WSL2
* X Server

### Install X Server

Download and install [VcXsrv](https://sourceforge.net/projects/vcxsrv/) in Windows. Launch it using the XLaunch utility or xlaunch.exe. Accept the default settings but check 'Disable access control'.

### Install WSL2 

Open an administrator PowerShell or Windows Command Prompt and run the folowing command:

`wsl --install`

This command will enable the required optional components, download the latest Linux kernel, set WSL 2 as your default, and install a Linux distribution for you (Ubuntu LTS by default).

Then type `wsl` to start a WSL2 session and follow the instructions for [Linux](#what-you-need-for-running-on-linux).

### Set the X DISPLAY

Finally enter the following command in the WSL2 terminal:

`export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0`

### Run the damn thing
In the WSL2 terminal go to the folder where you downloaded the script, probably *Downloads/Pass-fur-alle-main*, and you go there by entering `cd Downloads/Pass-fur-alle-main`
Then enter: `python3 pass-fur-alle.py`

### Other solution(s)

[passport_booker_se](https://github.com/elias123tre/passport_booker_se) by @elias123tre.

## Glossary

### Terminal
If you don't know what a terminal is; think of it as the thing you see on the news when something has been hacked, and there's a picture of someone in a hoodie is leaning over a computer? Or that time you saw Wargames, The Matrix, Mr Robot or even Hackers? That's the terminal.
To find *Terminal*, open *Launchpad* and the folder *Other* and there it is. Or open *Spotlight* and type *Terminal*.
