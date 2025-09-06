document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navButtons = document.querySelectorAll('.nav-link');

    // Function to load and display a page
    function loadPage(page, push = true) {
        if (typeof stopClock === 'function') {
            stopClock();
        }

        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Page not found');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('dynamic-content').innerHTML = data;  // Load into sub-container

                // Update browser history if needed
                if (push) {
                    history.pushState({ page }, '', `#${page}`);
                }

                if (typeof startClock === 'function' && document.getElementById('clock')) {
                    startClock();
                }
            })
            .catch(error => {
                document.getElementById('dynamic-content').innerHTML = '<p>Error loading page. Please try again.</p>';
                console.error(error);
            });
    }

    // Event listener for nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Home logo button (mobile mode)
    document.addEventListener('click', (event) => {
        const homeBtn = event.target.closest('.home-btn');
        if (homeBtn) {
            const page = homeBtn.getAttribute('data-page');
            loadPage(page);
        }
    });

     // Event listener for project boxes
    document.addEventListener('click', (event) => {
        const projectBox = event.target.closest('.project-link');
        if (projectBox) {
            const page = projectBox.getAttribute('data-page');
            loadPage(page);
        }
    });
    
    document.addEventListener('click', function(event) {
    const homeNavLink = event.target.closest('.home-nav-link');
    if (homeNavLink) {
        event.preventDefault();
        const page = homeNavLink.getAttribute('data-page');
        if (page) {
            loadPage(page);
        }
    }
});

// ...existing code...

    


    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            loadPage(event.state.page, false); // Don't push state again
        }
    });

    // Load default or current page on first load
    const defaultPage = 'pages/home.html';
    const initialHash = location.hash.replace('#', '');
    const initialPage = initialHash || defaultPage;
    loadPage(initialPage, false); // Don't push state on first load

});

// Clock logic
let clockInterval = null;

function updateClock() {
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        const now = new Date();
        const formattedTime = now.toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        clockElement.innerHTML = formattedTime;
    }
}

// ...existing code...

// Simple localStorage-based view counter
function updateViewCounter() {
    const viewKey = 'site-view-count';
    let count = localStorage.getItem(viewKey);
    if (!count) {
        count = 1;
    } else {
        count = parseInt(count) + 1;
    }
    localStorage.setItem(viewKey, count);
    const viewCountElem = document.getElementById('view-count');
    if (viewCountElem) {
        viewCountElem.textContent = count;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateViewCounter();
    // ...existing code...
});

// ...existing code...

