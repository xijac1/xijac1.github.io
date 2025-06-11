document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navButtons = document.querySelectorAll('.nav-link');

    // Function to load page content
    function loadPage(page) {
        // Stop the clock before loading new content
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
                mainContent.innerHTML = data;
                // Start the clock if the clock element exists
                if (typeof startClock === 'function' && document.getElementById('clock')) {
                    startClock();
                }
            })
            .catch(error => {
                mainContent.innerHTML = '<p>Error loading page. Please try again.</p>';
                console.error(error);
            });
    }

    // Add click event listeners to nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Load default page
    loadPage('pages/home.html');
});

// Store the interval ID globally to allow clearing it
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