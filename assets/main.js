document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navButtons = document.querySelectorAll('.nav-link');

    // Function to load page content
    function loadPage(page, updateHistory = true) {
        console.log(`Loading page: ${page}`); // Debug log
        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${page}: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                mainContent.innerHTML = data;
                // Update active button styling
                navButtons.forEach(btn => btn.classList.remove('active'));
                const activeButton = Array.from(navButtons).find(
                    btn => btn.getAttribute('data-page') === page
                );
                if (activeButton) {
                    activeButton.classList.add('active');
                    activeButton.setAttribute('aria-current', 'page');
                }
                navButtons.forEach(btn => {
                    if (btn !== activeButton) {
                        btn.removeAttribute('aria-current');
                    }
                });
                // Update URL without reloading
                if (updateHistory) {
                    const pageName = page.replace('pages/', '').replace('.html', '');
                    window.history.pushState({ page }, '', `/${pageName}`);
                }
            })
            .catch(error => {
                mainContent.innerHTML = '<p>Error loading page. Please try again.</p>';
                console.error(`Error loading ${page}:`, error);
            });
    }

    // Add click event listeners to nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Handle browser back/forward navigation
    window.addEventListener('popstate', event => {
        if (event.state && event.state.page) {
            loadPage(event.state.page, false);
        }
    });

    // Load page based on current URL or default to home
    const currentPath = window.location.pathname;
    console.log(`Current path: ${currentPath}`); // Debug log
    const pageMap = {
        '/home': 'pages/home.html',
        '/about': 'pages/about.html',
        '/contact': 'pages/contact.html',
        '/': 'pages/home.html'
    };
    const pageToLoad = pageMap[currentPath] || 'pages/home.html';
    loadPage(pageToLoad, false);
});