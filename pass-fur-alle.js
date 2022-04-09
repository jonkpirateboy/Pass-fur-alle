// ==UserScript==
// @name         Pass für alle
// @namespace    https://passfuralle.se
// @version      2.08
// @description  try to take over the world!
// @author       Jonk
// @match        https://bokapass.nemoq.se/Booking/Booking/Index/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js#sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=
// ==/UserScript==

(function() {

    // Constants
    log('Set constants');
    var dateFrom = today();
    var dateTo = '2022-12-24';
    var autoConfirm = false;

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

    setButtonTexts();
    $("#SectionId").change(function() {
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
            if (Date.parse(datePickerVal) > Date.parse(dateTo) || (localStorage.getItem('TimeSearch') == 'TimeSearchButton' && Date.parse(datePickerVal) < Date.parse(dateFrom))) {
                log('Start over time search');
                datePickerElem.val(dateFrom);
                setTimeout(function () {
                    jQuery('input[name="' + localStorage.getItem('TimeSearch') + '"]').click();
                }, timeSearchTimeout());
            } else {
                log('Check for slot');
                availableTimeSlots = jQuery('.pointer.timecell.text-center[data-function="timeTableCell"][style*="#1862a8"]');
                if (availableTimeSlots.length) {
                    log('Time found');
                    availableTimeSlots.first().click();
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
    if (jQuery('#Customers_0__BookingFieldValues_0__Value').length) {
        log('Book time view');
        jQuery('#Customers_0__BookingFieldValues_0__Value').closest('.control-group').before('<h2 style="text-align:center">' + localStorage.getItem('responseText') + '</h2>');
        localStorage.removeItem('TimeSearch');
        localStorage.removeItem('responseText');
    }

    function log(log) {
        console.log(log);
    }

    function timeSearchTimeout() {
        log('Set timeout');
        var timeout = 1000;
        //if (jQuery('.validation-summary-errors.alert.alert-error').length) {
        if (localStorage.getItem('TimeSearch') == 'TimeSearchFirstAvailableButton') {
            log('Long timeout');
            timeout = 15000;
        } else {
            log('Normal timeout');
        }
        return timeout;
    }

    function today() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }

    function setButtonTexts() {
        log('Set button texts');
        jQuery('input[name="TimeSearchFirstAvailableButton"]').val('Första lediga tid innan ' + dateTo);
        if (jQuery("#SectionId option:selected").val() == 0) {
            jQuery('input[name="TimeSearchButton"]').val('Sök tid mellan ' + dateFrom + ' och ' + dateTo);
        } else {
            jQuery('input[name="TimeSearchButton"]').val('Funkar inte än');
        }
    }

})();
