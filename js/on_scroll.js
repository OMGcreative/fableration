// on_scroll.js (vanilla JS)

document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.navbar');
    if (!header) return;

    function checkScroll() {
        var scroll = window.scrollY || window.pageYOffset;
        // if scrolling stops remove the class
        if (scroll === 0) {
            header.classList.remove('is-scrolled');
            return;
        }
        // Add or remove class based on scroll position
        
        if (scroll >= 50) {
            header.classList.add('is-scrolled');
        } else {            
            header.classList.remove('is-scrolled');
        } 
    }

    // Remove class on load (match original behaviour)
    header.classList.remove('is-scrolled');

    // Listen for scroll events
    window.addEventListener('scroll', checkScroll, { passive: true });

    // Also run once in case the page is already scrolled on load
    checkScroll();
});

