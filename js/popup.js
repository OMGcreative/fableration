/* Popup step navigation
   - Collects popup containers in the intended order
   - Provides show/hide helpers and wires next/previous buttons
   - Keeps the original buttonsContainer click behavior to open the first step
*/

document.addEventListener('DOMContentLoaded', function () {
    // Use a single overlay and data attributes for step elements
    var overlay = document.getElementById('popupOverlay');
    var stepSelectors = ['[data-popup-step="1"]', '[data-popup-step="2"]', '[data-popup-step="3"]', '[data-popup-step="4"]'];
    var steps = stepSelectors.map(function (s) { return document.querySelector(s); }).filter(Boolean);

    function openOverlay() {
        if (!overlay) return;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        // optional: prevent body scroll while popup open
        document.body.style.overflow = 'hidden';
    }

    function closeOverlay() {
        if (!overlay) return;
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.removeProperty('overflow');
    }

    function hideAllSteps() {
        steps.forEach(function (s) { s.classList.remove('active'); });
    }

    function showByIndex(i) {
        if (!overlay || i < 0 || i >= steps.length) return;
        var target = steps[i];
        if (!target) return;
        openOverlay();
        // small timeout to allow overlay to become visible before animating steps
        requestAnimationFrame(function () {
            hideAllSteps();
            target.classList.add('active');
        });
    }

    function currentStepFromElement(el) {
        if (!el) return null;
        for (var i = 0; i < steps.length; i++) {
            var s = steps[i];
            if (s && s.contains(el)) return s;
        }
        return null;
    }

    function closePopup() {
        // remove active step and close overlay
        hideAllSteps();
        closeOverlay();
    }

    // Delegate clicks on next/previous buttons
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.next-button, .previous-button');
        if (!btn) return;
        var container = currentStepFromElement(btn);
        // If the button is not inside a step element, ignore
        if (!container) return;
        var idx = steps.indexOf(container);
        if (idx === -1) return;
        if (btn.classList.contains('next-button')) {
            // If this is the last step, close the overlay instead of advancing
            if (idx + 1 >= steps.length) {
                closePopup();
            } else {
                showByIndex(idx + 1);
            }
        } else if (btn.classList.contains('previous-button')) {
            showByIndex(idx - 1);
        }
    });

    // Preserve existing behavior: clicking any `.join-button` opens the popup
    var joinButtons = document.querySelectorAll('.join-button');
    if (joinButtons && joinButtons.length) {
        joinButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                // prevent default if it's a link/button and open step 1
                if (e && typeof e.preventDefault === 'function') e.preventDefault();
                showByIndex(0);
            });
        });
    }

    // Close when clicking the overlay (but not inner content)
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closePopup();
            }
        });
    }

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closePopup();
        }
    });
    
});
