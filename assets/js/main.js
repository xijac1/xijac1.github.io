document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navButtons = document.querySelectorAll('.nav-link');

    // Function to update sidebar active icon based on current hash/page
    function updateSidebarActive(page) {
        document.querySelectorAll('.sidebar .nav-link').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === page) {
                btn.classList.add('active');
            }
        });
    }

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

                // Initialize filters based on page
                if (page === 'pages/quotes.html') {
                    initializeQuoteFilter();
                } else if (page === 'pages/projects.html') {
                    initializeProjectFilter();
                }

                if (window.feather && typeof feather.replace === 'function') {
                    feather.replace();
                }

                // Update active nav link (sidebar)
                updateSidebarActive(page);
            })
            .catch(error => {
                document.getElementById('dynamic-content').innerHTML = '<p>Error loading page. Please try again.</p>';
                console.error(error);
            });
    }

    // Function to initialize quote filter
    function initializeQuoteFilter() {
        const filterDropdown = document.getElementById('author-filter');
        const quoteUnits = document.querySelectorAll('.quote-unit');

        if (filterDropdown) {
            filterDropdown.addEventListener('change', () => {
                const selectedAuthor = filterDropdown.value;
                let visibleIndex = 0;

                quoteUnits.forEach(unit => {
                    const author = unit.getAttribute('data-author');
                    if (selectedAuthor === 'all' || author === selectedAuthor) {
                        unit.style.display = 'flex';
                        unit.style.order = visibleIndex++;
                    } else {
                        unit.style.display = 'none';
                        unit.style.order = '9999'; // Push hidden elements to the end
                    }
                });
            });
        }
    }

    // Updated Function to initialize project filter (now for buttons)
    function initializeProjectFilter() {
        const buttons = document.querySelectorAll('.filter-btn');
        const projectUnits = document.querySelectorAll('.mainunit');

        function filterProjects(selectedType) {
            let visibleIndex = 0;
            projectUnits.forEach(unit => {
                const type = unit.getAttribute('data-type');
                if (type === selectedType) {
                    unit.style.display = 'flex';
                    unit.style.order = visibleIndex++;
                } else {
                    unit.style.display = 'none';
                    unit.style.order = '9999'; // Push hidden elements to the end
                }
            });
        }

        // Add event listeners to buttons
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedType = btn.dataset.filter; // Get filter type from button
                filterProjects(selectedType);

                // Optional: Add active class for highlighting
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Default to "Projects" on load
        const defaultBtn = document.querySelector('.filter-btn[data-filter="project"]');
        if (defaultBtn) {
            defaultBtn.click(); // Simulate click to set initial state
        }
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
    updateSidebarActive(initialPage);
    loadPage(initialPage, false); // Don't push state on first load

    // Listen for hash changes (user navigates via browser or anchor)
    window.addEventListener('hashchange', function() {
        const hashPage = location.hash.replace('#', '') || defaultPage;
        updateSidebarActive(hashPage);
    });
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
});