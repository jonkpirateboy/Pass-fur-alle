// ==UserScript==
// @name         Pass für alle
// @namespace    https://passfuralle.se
// @version      2.17
// @description  Ett snabbt och enkelt sätt att boka passtid
// @author       Jonk
// @match        https://*.nemoq.se/Booking/Booking/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js#sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=
// @require      https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/js/ion.sound.min.js

// ==/UserScript==

(function() {
    
    var jQuery = window.jQuery;
    var ion = window.ion;

    // Constants
    log('Set constants');
    var dateFrom = today();
    var dateTo = '2022-12-31';
    var autoConfirm = true;
    var acceptOffice = '';

    var datePickerElem = jQuery('#datepicker');
    if (!localStorage.getItem('TimeSearch')) {
        log('Set start date');
        datePickerElem.val(dateFrom);
    }

    jQuery('input[name="TimeSearchButton"]').on('click', function () {
        log('Start time search');
        localStorage.setItem('TimeSearch', 'TimeSearchButton');
        localStorage.removeItem('responseText');
    });
    jQuery('input[name="TimeSearchFirstAvailableButton"]').on('click', function () {
        log('Start time search first available');
        localStorage.setItem('TimeSearch', 'TimeSearchFirstAvailableButton');
        localStorage.removeItem('responseText');
    });
    jQuery('a[href*="/Booking/Booking/Previous/skane?id="]').on('click', function() {
        log('Clear time search');
        localStorage.removeItem('TimeSearch');
        localStorage.removeItem('responseText');
    });
    jQuery('body').on('click', 'a.cancel-search', function() {
        log('Cancel search');
        jQuery('html, body').css('overflow', 'visible');
        localStorage.removeItem('TimeSearch');
        localStorage.removeItem('responseText');
        location.reload();
    });

    setButtonTexts();
    jQuery("#SectionId").change(function() {
        setButtonTexts();
    });

    // Find a time
    if (jQuery('.controls .btn.btn-primary[name="TimeSearchButton"]').length || jQuery('.controls .btn.btn-primary[name="TimeSearchFirstAvailableButton"]').length) {
        log('Time search view');

        var datePickerVal = datePickerElem.val();

        if (Date.parse(datePickerVal) < Date.parse(dateFrom)) {
            log('Start later than today');
            datePickerElem.val(dateFrom);
        }

        if (localStorage.getItem('TimeSearch')) {
            log('Start time search');
            loader();
            captcha();
            if (Date.parse(datePickerVal) > Date.parse(dateTo) || (localStorage.getItem('TimeSearch') == 'TimeSearchButton' && Date.parse(datePickerVal) < Date.parse(dateFrom))) {
                log('Start over time search');
                datePickerElem.val(dateFrom);
                setTimeout(function () {
                    jQuery('input[name="' + localStorage.getItem('TimeSearch') + '"]').click();
                }, timeSearchTimeout());
            } else {
                log('Check for slot');
                var availableTimeSlots = jQuery('.pointer.timecell.text-center[data-function="timeTableCell"][aria-label!="Bokad"]');
                
                // Filter accepted passport offices
                if(acceptOffice && acceptOffice.length) {
                    availableTimeSlots = availableTimeSlots.filter(function() {
                        var office = jQuery(this).closest(".timetable-cells").attr("headers");
                        return acceptOffice.split(",").some(function(acceptedOffice) {
                            return office.includes(acceptedOffice)
                        });
                    }) 
                }

                if (availableTimeSlots.length) {
                    log('Time found');
                    availableTimeSlots.first().click();
                    var timeSelectionText;
                    if (jQuery.trim(jQuery('#timeSelectionText').text()).length) {
                        timeSelectionText = jQuery('#timeSelectionText').text();
                    } else {
                        timeSelectionText = availableTimeSlots.first().data('fromdatetime');
                    }
                    var responseText = jQuery.trim(jQuery('#selectionText').text() + ' ' + jQuery('#sectionSelectionText').text() + ' ' + timeSelectionText);
                    localStorage.setItem('responseText', responseText);
                    if (autoConfirm || confirm(responseText)) {
                        log('Auto confirm');
                        jQuery('#booking-next').click();
                    }
                } else {
                    log('No time found');
                    setTimeout(function () {
                        log('Check next');
                        if (jQuery('#nextweek').length) {
                            log('Check next week');
                            jQuery('#nextweek').attr('name','TimeSearchButton');
                            jQuery('#nextweek').click();
                        } else if (jQuery('.btn.btn-link.pull-right').attr('name','KeyTimeSearchNextDayButton').length) {
                            log('Check next day');
                            jQuery('.btn.btn-link.pull-right').attr('name','KeyTimeSearchNextDayButton').click();
                        }
                    }, timeSearchTimeout());
                }
            }
        }
    }

    // Time found
    if (jQuery('.breadcrumb li').length == 6) {
        log('Book time view');
        jQuery('.breadcrumb').after('<h2 style="text-align:center;padding:20px;">' + localStorage.getItem('responseText') + '</h2>'); 
        localStorage.removeItem('TimeSearch');
        localStorage.removeItem('responseText');
        playSound('bell_ring');
    }

    function log(log) {
        console.log(log);
    }

    function timeSearchTimeout() {
        log('Set timeout');
        var timeout = 1000;
        /*
        if (localStorage.getItem('TimeSearch') == 'TimeSearchFirstAvailableButton') {
            log('Long timeout');
            timeout = 15000;
        } else {
            log('Normal timeout');
        }
        */
        return timeout;
    }

    function today() {
        var today = new Date();
        return today.toISOString().slice(0,10);
    }

    function setButtonTexts() {
        log('Set button texts');
        jQuery('input[name="TimeSearchFirstAvailableButton"]').val('Första lediga tid innan ' + dateTo);
        if (jQuery("#SectionId option:selected").val() == 0) {
            jQuery('input[name="TimeSearchButton"]').val('Sök tid mellan ' + dateFrom + ' och ' + dateTo);
            jQuery('input[name="TimeSearchButton"]').css('display', '');
        } else {
            jQuery('input[name="TimeSearchButton"]').val('Funkar inte än');
            jQuery('input[name="TimeSearchButton"]').css('display', 'none');
        }
    }

    function playSound(sound) {
        // http://ionden.com/a/plugins/ion.sound/en.html
        ion.sound({
            sounds: [
                {name: sound}
            ],
        
            // main config
            path: "https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/",
            preload: true,
            multiplay: true,
            volume: 0.9
        });
        
        // play sound
        ion.sound.play(sound);
    }
    
    function loader() {
        if (!jQuery('.loading').length) {
            jQuery('html, body').css('overflow', 'hidden');
            jQuery('body').append('<div class="loading" style="display: flex; width: 100vw; height: 100vh; position: absolute; left: 0; top: 0; justify-content: center; align-items: center;z-index: 999; background: rgba(255,255,255,.6);"><div style="background: #eee; padding: 20px; border-radius: 20px; width: 200px; height: 200px; display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 999;"><div>Söker efter tid</div><div class="loader-animation">.</div><a href="#" class="cancel-search">Avbryt</a></div></div>');
            loaderAnimation();
        }
    }

    function captcha() {
        if (jQuery('.mtcaptcha').length) {
            playSound('light_bulb_breaking');
            localStorage.removeItem('TimeSearch');
            localStorage.removeItem('responseText');
            setTimeout(function () {
                location.href = location.href;
            }, 1000);
        }
    }

    function loaderAnimation() {
        jQuery('.loader-animation').html('.');
        setTimeout(function () {
            jQuery('.loader-animation').html('..');
        }, 250);
        setTimeout(function () {
            jQuery('.loader-animation').html('...');
        }, 500);
        setTimeout(function () {
            loaderAnimation();
        }, 750);
    }

})();
