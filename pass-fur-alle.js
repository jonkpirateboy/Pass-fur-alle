// ==UserScript==
// @name         Pass für alle
// @namespace    https://passfuralle.se
// @version      3.0
// @description  Ett snabbt och enkelt sätt att boka passtid
// @author       Jonk
// @match        https://etjanster.polisen.se/etidsbokning/passnid/*
// @grant        none

// ==/UserScript==

(function() {

    // Change dates here:
    var dateFrom = today();
    var dateTo = '2027-12-24';

    // Constants
    var searchRetryDelayMs = 1;
    var audioContext = null;
    var lastPath = '';
    var searchSubmitPending = false;
    var timeCheckPending = false;

    runBooking();

    function runBooking() {
        document.addEventListener('click', function(event) {
            if (event.target.closest('.cancel-search')) {
                event.preventDefault();
                log('Cancel search');
                cancelSearch();
            }
        });

        routeHandler();
        setInterval(function() {
            if (location.pathname !== lastPath) {
                routeHandler();
            }
        }, 500);
    }

    function routeHandler() {
        lastPath = location.pathname;
        if (location.pathname.indexOf('/passnid/boka/sok') !== -1) {
            searchView();
        } else if (location.pathname.indexOf('/passnid/boka/reservera') !== -1) {
            timeView();
        } else if (location.pathname.indexOf('/passnid/boka/boka') !== -1 && localStorage.getItem('responseText')) {
            showFoundMessage(localStorage.getItem('responseText'));
            clearSearch();
            playSound('bell_ring');
        }
    }

    function searchView() {
        var searchButton = document.querySelector('#next-button');
        if (!searchButton) {
            setTimeout(searchView, 500);
            return;
        }

        if (!document.querySelector('#pass-fur-alle-controls')) {
            var wrapper = document.createElement('div');
            wrapper.id = 'pass-fur-alle-controls';
            wrapper.style.margin = '1rem 0';
            wrapper.innerHTML = '<button type="button" id="pass-fur-alle-start" class="btn btn-primary w-100">Sök tid mellan ' + dateFrom + ' och ' + dateTo + '</button>';
            searchButton.parentNode.insertBefore(wrapper, searchButton.nextSibling);

            document.querySelector('#pass-fur-alle-start').addEventListener('click', function() {
                log('Start time search');
                unlockSound();
                localStorage.setItem('TimeSearch', 'PolisenTimeSearch');
                localStorage.removeItem('responseText');
                searchButton.click();
            });
        }

        if (localStorage.getItem('TimeSearch') === 'PolisenTimeSearch' && !searchSubmitPending) {
            searchSubmitPending = true;
            setTimeout(function() {
                if (!isSearchActive()) {
                    searchSubmitPending = false;
                    return;
                }

                log('Retry search');
                searchSubmitPending = false;
                searchButton.click();
            }, timeSearchTimeout());
        }
    }

    function timeView() {
        if (!localStorage.getItem('TimeSearch') || timeCheckPending) {
            return;
        }

        timeCheckPending = true;
        loader();

        setTimeout(function() {
            timeCheckPending = false;
            var currentDate = currentSearchDate();
            if (currentDate && Date.parse(currentDate) > Date.parse(dateTo)) {
                log('Search date is after dateTo');
                restartSearch();
                return;
            }

            var availableTimeSlots = Array.prototype.slice.call(document.querySelectorAll('button.tid-val-button[data-date]:not([disabled])'));
            availableTimeSlots = availableTimeSlots.filter(function(slot) {
                var slotDate = slot.getAttribute('data-date') ? slot.getAttribute('data-date').slice(0, 10) : currentDate;
                return !slotDate || (Date.parse(slotDate) >= Date.parse(dateFrom) && Date.parse(slotDate) <= Date.parse(dateTo));
            });

            if (availableTimeSlots.length) {
                timeFound(availableTimeSlots[0]);
                return;
            }

            log('No time found');
            var nextButton = document.querySelector('#nav-next-date');
            var nextDate = nextSearchDate(nextButton, currentDate);
            if (nextButton && !nextButton.disabled && nextDate && Date.parse(nextDate) <= Date.parse(dateTo)) {
                setTimeout(function() {
                    if (!isSearchActive()) {
                        return;
                    }

                    log('Check next date');
                    nextButton.click();
                    setTimeout(timeView, 2500);
                }, timeSearchTimeout());
                return;
            }

            restartSearch();
        }, 500);
    }

    function timeFound(slot) {
        log('Time found');
        var responseText = slot.getAttribute('aria-label') || slot.textContent || slot.getAttribute('data-date');
        if (slot.getAttribute('data-date')) {
            responseText = slot.getAttribute('data-date') + ' ' + responseText;
        }
        localStorage.setItem('responseText', responseText);
        slot.click();
        showFoundMessage(responseText);
        clearSearch();
        playSound('bell_ring');
        removeLoader();
    }

    function currentSearchDate() {
        var dateInput = document.querySelector('#tidval-datum');
        if (dateInput && dateInput.value) {
            return dateInput.value.slice(0, 10);
        }

        var firstSlot = document.querySelector('button.tid-val-button[data-date]');
        if (firstSlot) {
            return firstSlot.getAttribute('data-date').slice(0, 10);
        }

        return '';
    }

    function nextSearchDate(nextButton, currentDate) {
        if (!nextButton) {
            return '';
        }

        var ariaLabel = nextButton.getAttribute('aria-label') || '';
        var dateMatch = ariaLabel.match(/(\d{1,2})\s+([a-zåäö]+)\s+(\d{4})/i);
        if (dateMatch) {
            return swedishDateToIso(dateMatch[1], dateMatch[2], dateMatch[3]);
        }

        if (currentDate) {
            return addDays(currentDate, 1);
        }

        return '';
    }

    function swedishDateToIso(day, month, year) {
        var months = {
            januari: '01',
            februari: '02',
            mars: '03',
            april: '04',
            maj: '05',
            juni: '06',
            juli: '07',
            augusti: '08',
            september: '09',
            oktober: '10',
            november: '11',
            december: '12'
        };

        var monthNumber = months[month.toLowerCase()];
        if (!monthNumber) {
            return '';
        }

        return year + '-' + monthNumber + '-' + String(day).padStart(2, '0');
    }

    function restartSearch() {
        log('Restart search');
        var backButton = document.querySelector('#tillbaka');
        if (backButton) {
            backButton.click();
            setTimeout(searchView, timeSearchTimeout());
            return;
        }

        if (location.pathname.indexOf('/passnid/boka/sok') !== -1) {
            setTimeout(searchView, timeSearchTimeout());
            return;
        }

        history.back();
        setTimeout(searchView, timeSearchTimeout());
    }

    function showFoundMessage(message) {
        if (!message || document.querySelector('#pass-fur-alle-found')) {
            return;
        }

        var content = document.querySelector('main, app-page-content, body');
        var heading = document.createElement('h2');
        heading.id = 'pass-fur-alle-found';
        heading.style.textAlign = 'center';
        heading.style.padding = '20px';
        heading.textContent = message;
        content.insertBefore(heading, content.firstChild);
    }

    function log(message) {
        console.log(message);
    }

    function timeSearchTimeout() {
        return searchRetryDelayMs;
    }

    function today() {
        var now = new Date();
        return now.toISOString().slice(0, 10);
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().slice(0, 10);
    }

    function playSound(sound) {
        playFallbackSound(sound);
    }

    function unlockSound() {
        var context = getAudioContext();
        if (!context) {
            return;
        }

        if (context.state === 'suspended') {
            context.resume();
        }

        var gain = context.createGain();
        gain.gain.value = 0;
        gain.connect(context.destination);

        var oscillator = context.createOscillator();
        oscillator.connect(gain);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.01);
    }

    function playFallbackSound(sound) {
        var context = getAudioContext();
        if (!context) {
            return;
        }

        var play = function() {
            if (sound === 'bell_ring') {
                beep(context, 880, 0, 0.18);
                beep(context, 1175, 0.2, 0.28);
                beep(context, 880, 0.52, 0.18);
            } else {
                beep(context, 220, 0, 0.35);
            }
        };

        if (context.state === 'suspended') {
            context.resume().then(play).catch(function(error) {
                log(error);
            });
            return;
        }

        play();
    }

    function beep(context, frequency, delay, duration) {
        var oscillator = context.createOscillator();
        var gain = context.createGain();
        var start = context.currentTime + delay;
        var end = start + duration;

        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.4, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(end + 0.02);
    }

    function getAudioContext() {
        if (audioContext) {
            return audioContext;
        }

        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            return null;
        }

        audioContext = new AudioContext();
        return audioContext;
    }

    function loader() {
        if (!document.querySelector('.loading')) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.insertAdjacentHTML('beforeend', '<div class="loading" style="display: flex; width: 100vw; height: 100vh; position: fixed; left: 0; top: 0; justify-content: center; align-items: center; z-index: 999999; background: rgba(255,255,255,.6);"><div style="background-color: var(--eac-button-primary-background-color); color: white; padding: 20px; border-radius: var(--bs-border-radius); width: 200px; height: 200px; display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 999;"><div>Söker efter tid</div><div class="loader-animation">.</div><a href="#" class="cancel-search" style="color: white;">Avbryt</a></div></div>');
            loaderAnimation();
        }
    }

    function removeLoader() {
        var loading = document.querySelector('.loading');
        if (!loading) {
            return;
        }

        loading.remove();
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }

    function loaderAnimation() {
        var loaderAnimationElem = document.querySelector('.loader-animation');
        if (!loaderAnimationElem) {
            return;
        }
        loaderAnimationElem.innerHTML = '.';
        setTimeout(function() {
            if (document.querySelector('.loader-animation')) {
                document.querySelector('.loader-animation').innerHTML = '..';
            }
        }, 250);
        setTimeout(function() {
            if (document.querySelector('.loader-animation')) {
                document.querySelector('.loader-animation').innerHTML = '...';
            }
        }, 500);
        setTimeout(function() {
            loaderAnimation();
        }, 750);
    }

    function clearSearch() {
        localStorage.removeItem('TimeSearch');
        localStorage.removeItem('responseText');
    }

    function isSearchActive() {
        return localStorage.getItem('TimeSearch') === 'PolisenTimeSearch';
    }

    function cancelSearch() {
        removeLoader();
        clearSearch();
        searchSubmitPending = false;
        timeCheckPending = false;

        var backButton = document.querySelector('#tillbaka');
        if (backButton) {
            backButton.click();
            return;
        }
    }
})();
