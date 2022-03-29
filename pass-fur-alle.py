from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import Select    
from datetime import datetime
import time
import sys

sys.setrecursionlimit(10000)

options = webdriver.ChromeOptions() 
options.add_argument("--disable-blink-features")
options.add_argument("--disable-blink-features=AutomationControlled")
web = webdriver.Chrome(options=options)

# Constants
startBookingDate = datetime.today().strftime('%Y-%m-%d') # Start searching today, if you want to start some other day, just change this to a date with the format YYYY-MM-DD
endBookingDate = "2022-12-24" # The last date you want to search for
firstDate = False # If you want to look for the first date using "First available time", change to True
people = [
    { 
        "firstName": "Test", 
        "lastName": "Testsson"
    }
]
emailAddress = 'test@test.se' # Your email
phoneNumber = '076127567' # Your phone number
manualVerify = True # Change this to False if you want the script to automatically book the time in the last step

# Terminal output
print ('Alla län: https://polisen.se/tjanster-tillstand/pass-och-nationellt-id-kort/boka-tid-hitta-passexpedition/')
lan = input("Välj län. Skriv sista delen av URLen på pass-sidan för ditt län. T ex 'halland', se länken ovan. Eller tryck enter för skane: ")
if lan:
    expedition = input("Välj expedition. T ex 'Halmstad', se länken ovan. Eller tryck enter för hela länet: ")

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
        for i, p in enumerate(people):
            print("Person %d: %s %s" % (i + 1, people[i]["firstName"], people[i]["lastName"]))
        # Click the first button
        startButton = web.find_element(by=By.XPATH, value='//*[@id="Main"]/div[2]/div[1]/div/form/div[2]/input')
        startButton.click()
        time.sleep(1)
        # Accept
        infoCheck = web.find_element(by=By.XPATH, value='//*[@id="AcceptInformationStorage"]')
        infoNext = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[2]/input')
        selectAmountOfPeople = Select(web.find_element(by=By.XPATH, value='//*[@id="NumberOfPeople"]'))
        selectAmountOfPeople.select_by_visible_text(str(len(people)))
        infoCheck.click()
        infoNext.click()
        time.sleep(1)
        # Confirm living in Sweden
        for p in range(len(people)):
            divCount = p + 1
            liveInRadio = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[1]/div[%s]/div/label[1]' % divCount)
            liveInRadio.click()
        liveInNext = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[2]/input')
        # liveInRadio.click()
        liveInNext.click()
        time.sleep(1)
        setBookingDate()
        clickTimeIfExists()
    except NoSuchElementException:
        if firstDate == False:
            time.sleep(10)
        searchPassTime()

# If a time slot is found, click it
def clickTimeIfExists():
    try:
        endBookingDateDateTime = time.strptime(endBookingDate, "%Y-%m-%d")
        formInputDateTime = time.strptime(web.find_element(by=By.XPATH, value='//*[@id="datepicker"]').get_property('value'), "%Y-%m-%d")
        # If form date is larger than your end booking date, start over
        if formInputDateTime > endBookingDateDateTime:
            if firstDate == True:
                time.sleep(15)
            setBookingDate()
            clickTimeIfExists()
        else:
            # Look for a time slot
            if firstDate == False:
                if (expedition):
                    web.find_element(by=By.XPATH, value='//*[@id="Main"]/form[2]/div[2]/table/tbody/tr/*/div/div[contains(@style,"#1862a8")]').click()
                else:
                    web.find_element(by=By.XPATH, value='//*[@class="timetable-cells"]').click()
            else:
                web.find_element(by=By.XPATH, value='//*[contains(@aria-label,"202")]').click()
            web.find_element(by=By.XPATH, value='//*[@id="booking-next"]').click()
            time.sleep(1)
            # Fill out your name
            for p in range(len(people)):
                firstName = people[p]["firstName"]
                lastName = people[p]["lastName"]
                web.find_element(by=By.XPATH, value='//*[@id="Customers_%s__BookingFieldValues_0__Value"]' % str(p)).send_keys(firstName)
                web.find_element(by=By.XPATH, value='//*[@id="Customers_%s__BookingFieldValues_1__Value"]' % str(p)).send_keys(lastName)
                divCount = p + 1
                bookingForDivNo = divCount * 4
                web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[1]/div[%s]/div/label[1]' % bookingForDivNo).click()
            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[2]/input').click()
            time.sleep(1)
            # Move on
            web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div/input').click()
            time.sleep(1)
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
            time.sleep(1)
            if (manualVerify == False):
                # Verify your booking
                web.find_element(by=By.XPATH, value='//*[@id="Main"]/form/div[1]/input').click()
    except NoSuchElementException:
        if firstDate == False:
            # If there are no times available, check next day
            web.find_element(by=By.XPATH, value='//*[@class="btn btn-link pull-right"]').click()
        # Speed of clicking next day
        time.sleep(1)
        clickTimeIfExists()

# Fill the form with search settings
def setBookingDate():
    if (expedition):
        select = Select(web.find_element(by=By.XPATH, value='//*[@id="SectionId"]'))
        select.select_by_visible_text(expedition)
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
    if firstDate == False:
        # Search next day
        searchTimeButton = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form[1]/div/div[6]/div/input[1]')
    else:
        # Search first available time
        searchTimeButton = web.find_element(by=By.XPATH, value='//*[@id="Main"]/form[1]/div/div[6]/div/input[2]')
    searchTimeButton.click()

# Kick it!
searchPassTime()
