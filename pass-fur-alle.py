import sys
import time
from datetime import datetime

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select

sys.setrecursionlimit(100000)

chrome_options = Options()
chrome_options.headless = True
web = webdriver.Chrome(options=chrome_options)

# Constants
startBookingDate = datetime.today().strftime('%Y-%m-%d')  # Start searching today, if you want to start some other day, just change this to a date with the format YYYY-MM-DD
endBookingDate = "2022-08-25"  # The last date you want to search for
firstDate = False  # If you want to look for the first date using "First available time", change to True
firstName = 'Test'  # Your first name
lastName = 'Testsson'  # Your last name
emailAddress = 'test@test.se'  # Your email
phoneNumber = '076127567'  # Your phone number
manualVerify = True  # Change this to False if you want the script to automatically book the time in the last step

# Terminal output
print('Alla län: https://polisen.se/tjanster-tillstand/pass-och-nationellt-id-kort/boka-tid-hitta-passexpedition/')
lan = input("Välj län. Sista delen av url t ex 'halland'. Eller tryck enter för Skåne: ")
if lan:
    expedition = input("Välj expedition. T ex 'Halmstad'. Eller tryck enter för hela länet: ")

if lan and expedition:
    print("Län: ", lan)
    print("Expedition: ", expedition)
elif lan:
    print("Län: ", lan)
    expedition = ''
else:
    lan = 'skane'
    expedition = ''

# Open web page
web.get('https://bokapass.nemoq.se/Booking/Booking/Index/' + lan)


# Start the search
def searchPassTime():
    try:
        time.sleep(1)
        # Click the first button
        startButton = web.find_element(by=By.XPATH, value='//*[@id="Main"]/div[2]/div[1]/div/form/div[2]/input')
        startButton.click()
        time.sleep(.5)
        # Accept
        infoCheck = web.find_element(by=By.XPATH, value='//*[@id="AcceptInformationStorage"]')
        infoNext = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[2]/input')
        infoCheck.click()
        infoNext.click()
        time.sleep(.5)
        # Confirm living in Sweden
        liveInRadio = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[1]/div/div/label[1]')
        liveInNext = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[2]/input')
        liveInRadio.click()
        liveInNext.click()
        time.sleep(.5)
        setBookingDate()
        clickTimeIfExists()
    except NoSuchElementException:
        if not firstDate:
            time.sleep(10)
        searchPassTime()


# If a time slot is found, click it
def clickTimeIfExists():
    try:
        endBookingDateDateTime = time.strptime(endBookingDate, "%Y-%m-%d")
        formInputDateTime = time.strptime(web.find_element(by=By.XPATH, value='//*[@id="datepicker"]').get_property('value'), "%Y-%m-%d")
        # If form date is larger than your end booking date, start over
        if formInputDateTime > endBookingDateDateTime:
            if firstDate:
                time.sleep(15)
            setBookingDate()
            clickTimeIfExists()
        else:
            # Look for a time slot
            if not firstDate:
                web.find_element(by=By.XPATH, value='//*[@class="timetable-cells"]').click()
            else:
                web.find_element(by=By.XPATH, value='//*[contains(@aria-label,"202")]').click()
            web.find_element(by=By.XPATH, value='//*[@id="booking-next"]').click()
            time.sleep(.5)
            # Fill out your name
            web.find_element(by=By.XPATH, value='//*[@id="Customers_0__BookingFieldValues_0__Value"]').send_keys(firstName)
            web.find_element(by=By.XPATH, value='//*[@id="Customers_0__BookingFieldValues_1__Value"]').send_keys(lastName)
            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[1]/div[4]/div/label[1]').click()
            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[2]/input').click()
            time.sleep(.5)
            # Move on
            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div/input').click()
            time.sleep(.5)
            # Fill out your personal information
            web.find_element(by=By.XPATH, value='//*[@id="EmailAddress"]').send_keys(emailAddress)
            web.find_element(by=By.XPATH, value='//*[@id="ConfirmEmailAddress"]').send_keys(emailAddress)
            web.find_element(by=By.XPATH, value='//*[@id="PhoneNumber"]').send_keys(phoneNumber)
            web.find_element(by=By.XPATH, value='//*[@id="ConfirmPhoneNumber"]').send_keys(phoneNumber)
            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[1]/div[5]/div/label[1]').click()
            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[1]/div[5]/div/label[2]').click()
            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[1]/div[6]/div/label[1]').click()
            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[1]/div[6]/div/label[2]').click()
            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[2]/input').click()
            time.sleep(.5)

            # Verify your booking
            booking = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[2]').text
            print(booking)
            if manualVerify:
                confirmation = input("Bekräfta bokning? [J/n] ")
                if confirmation not in {'j', 'J', ''}:
                    exit()

            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[1]/input').click()
            print("Bekräftad!")

    except NoSuchElementException:
        if not firstDate:
            # If there are no times available, check next day
            web.find_element(by=By.XPATH, value='//*[@class="btn btn-link pull-right"]').click()
        time.sleep(.5)
        clickTimeIfExists()


# Fill the form with search settings
def setBookingDate():
    if expedition:
        select = Select(web.find_element(by=By.XPATH, value='//*[@id="SectionId"]'))
        select.select_by_visible_text(expedition)
    if not firstDate:
        # Search next day
        bookingDate = web.find_element(by=By.XPATH, value='//*[@id="datepicker"]')
        bookingDate.send_keys(Keys.BACKSPACE)
        bookingDate.send_keys(Keys.BACKSPACE)
        bookingDate.send_keys(Keys.BACKSPACE)
        bookingDate.send_keys(Keys.BACKSPACE)
        bookingDate.send_keys(Keys.BACKSPACE)
        bookingDate.send_keys(Keys.BACKSPACE)
        bookingDate.send_keys(Keys.BACKSPACE)
        bookingDate.send_keys(Keys.BACKSPACE)
        bookingDate.send_keys(Keys.BACKSPACE)
        bookingDate.send_keys(Keys.BACKSPACE)
        myBookingDate = startBookingDate
        bookingDate.send_keys(myBookingDate)
        bookingDate.send_keys(Keys.TAB)
        searchTimeButton = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form[1]/div/div[6]/div/input[1]')
    else:
        # Search first available time
        searchTimeButton = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form[1]/div/div[6]/div/input[2]')
    searchTimeButton.click()


# Kick it!
searchPassTime()
