document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navButtons = document.querySelectorAll('.nav-link');

    // Function to load page content
    function loadPage(page) {
        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Page not found');
                }
                return response.text();
            })
            .then(data => {
                mainContent.innerHTML = data;
                // Re-run clock.js if it exists and is needed for the loaded page
                if (typeof updateClock === 'function' && page === 'pages/home.html') {
                    updateClock();
                    setInterval(updateClock, 1000);
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

    // Load default page (e.g., home.html) on initial load
    loadPage('pages/home.html');
});