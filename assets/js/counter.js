/* counter.js
   - Finds `.counter` / `.counter-text` and animates a countdown to a target end time
   - Format: DD:HH:MM:SS:CS  (days : hours : minutes : seconds : centiseconds)

   Usage:
   - Add `data-end="2026-02-25T10:00:00+11:00"` (ISO) to the `.counter` element to set the end time.
   - If absent, a sensible default is used (25 Feb 2026 10:00 AEST/AEDT per page text).
*/

(function () {
    'use strict';

    function pad(n, width) {
        var s = String(n);
        while (s.length < width) s = '0' + s;
        return s;
    }

    function computeParts(ms) {
        if (ms < 0) ms = 0;
        var totalCs = Math.floor(ms / 10); // centiseconds
        var cs = totalCs % 100;
        var totalSeconds = Math.floor(ms / 1000);
        var s = totalSeconds % 60;
        var totalMinutes = Math.floor(totalSeconds / 60);
        var m = totalMinutes % 60;
        var totalHours = Math.floor(totalMinutes / 60);
        var h = totalHours % 24;
        var days = Math.floor(totalHours / 24);
        return {
            days: days,
            hours: h,
            minutes: m,
            seconds: s,
            centis: cs
        };
    }

    function formatParts(p) {
        return pad(p.days, 2) + ':' + pad(p.hours, 2) + ':' + pad(p.minutes, 2) + ':' + pad(p.seconds, 2) + ':' + pad(p.centis, 2);
    }

    function findDefaultEnd() {
        // Fallback default taken from page copy: 25 Feb 2026 10:00 (assume AEDT/UTC+11)
        // Represent as ISO with +11:00 offset.
        return new Date('2026-02-25T10:00:00+11:00').getTime();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var counters = document.querySelectorAll('.counter');
        if (!counters || !counters.length) return;

        counters.forEach(function (counter) {
            // Find the individual parts inside `.counter-text`
            var container = counter.querySelector('.counter-text');
            if (!container) return;
            var partEls = {
                days: container.querySelector('.days .value'),
                hours: container.querySelector('.hours .value'),
                minutes: container.querySelector('.minutes .value'),
                seconds: container.querySelector('.seconds .value'),
                centis: container.querySelector('.centis .value')
            };
            // If any part is missing, fall back to the single text node behavior
            var hasAllParts = Object.keys(partEls).every(function (k) { return partEls[k]; });
            if (!hasAllParts) return;

            // Determine target end timestamp (ms)
            var endAttr = counter.getAttribute('data-end') || counter.getAttribute('data-target') || counter.getAttribute('data-countdown');
            var endTs = null;
            if (endAttr) {
                var parsed = Date.parse(endAttr);
                if (!isNaN(parsed)) endTs = parsed;
            }
            if (!endTs) endTs = findDefaultEnd();

            // Update function
            var interval = 100; // ms; updates every 100ms (centiseconds shown, ok to step by 10)
            var timerId = null;

            function tick() {
                var now = Date.now();
                var remaining = endTs - now;
                if (remaining <= 0) {
                    // set all parts to zero
                    partEls.days.textContent = pad(0, 2);
                    partEls.hours.textContent = pad(0, 2);
                    partEls.minutes.textContent = pad(0, 2);
                    partEls.seconds.textContent = pad(0, 2);
                    partEls.centis.textContent = pad(0, 2);
                    if (timerId) {
                        clearInterval(timerId);
                        timerId = null;
                    }
                    return;
                }
                var parts = computeParts(remaining);

                // write individual parts
                partEls.days.textContent = pad(parts.days, 2);
                partEls.hours.textContent = pad(parts.hours, 2);
                partEls.minutes.textContent = pad(parts.minutes, 2);
                partEls.seconds.textContent = pad(parts.seconds, 2);
                partEls.centis.textContent = pad(parts.centis, 2);

                // add a small tick class for visual pulse on the container
                container.classList.add('tick');
                window.setTimeout(function () { container.classList.remove('tick'); }, 120);
            }

            // initialize immediately then start interval
            tick();
            timerId = setInterval(tick, interval);
        });
    });
})();
