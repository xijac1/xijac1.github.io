// Function to start the clock
function startClock() {
    // Clear any existing interval to prevent duplicates
    if (clockInterval) {
        clearInterval(clockInterval);
    }
    // Only start the interval if the clock element exists
    if (document.getElementById('clock')) {
        updateClock();
        clockInterval = setInterval(updateClock, 1000);
    }
}

// Function to stop the clock
function stopClock() {
    if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
    }
}

// Initialize the clock if the element exists
startClock();