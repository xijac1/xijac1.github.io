function toggleDarkMode() {
    const body = document.body;
    const toggleButton = document.getElementById('darkModeToggle'); // Assumes button has this ID
    body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update button text
    toggleButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

// Check for saved dark mode preference on page load
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const toggleButton = document.getElementById('darkModeToggle'); // Assumes button has this ID
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        toggleButton.textContent = 'Light Mode';
    } else {
        toggleButton.textContent = 'Dark Mode';
    }
});