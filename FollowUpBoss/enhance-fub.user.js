// ==UserScript==
// @name         Enhance FollowUpBoss
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract URLs from task names in FUB and materializes them as "More Info..." links.
// @author       Jason Williscroft
// @match        https://*.followupboss.com/2/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function () {
    'use strict';

    $(document).on('DOMSubtreeModified', function () {
        // Are we already doing this?
        if ($(this).data('hsLock')) return;

        // Lock the process.
        $(this).data('hsLock', true);

        // For each displayed task...
        $('div.Checkbox-content > a').not('.hsMoreInfo').each(function () {
            // Remove task type tags from the title.
            $(this).text($(this).text().replace(/\s?{{.*}}/g, ''));

            // Does the task title contain a url?
            var url = $(this).text().match(/\b(http|https)?(:\/\/)?(\S*)\.(\w{2,4})(.*)/);
            if (!url) return;

            // If so, remove any sibling elements...
            $(this).siblings().remove();

            // ... remove the URL from the task title...
            $(this).text($(this).text().replace(/\s?\b(http|https)?(:\/\/)?(\S*)\.(\w{2,4})(.*)/, ''));

            // ... and then create a new link to the URL.
            $(this).after(' <a class="hsMoreInfo" href="' + url[0] + '" target="_blank">More Info...</a>');
        });

        // Unlock the process.
        $(this).data('hsLock', false);
    });
})();