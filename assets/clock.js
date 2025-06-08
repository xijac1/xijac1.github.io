function updateClock() {
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

    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.innerHTML = formattedTime;
    }
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display the clock immediately
updateClock();