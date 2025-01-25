document.addEventListener('DOMContentLoaded', () => {
    const intervalInput = document.getElementById('interval');
    const updateIntervalBtn = document.getElementById('update-interval');
    const ad1Input = document.getElementById('ad1');
    const ad2Input = document.getElementById('ad2');
    const startScriptBtn = document.getElementById('start-script');
    const pauseScriptBtn = document.getElementById('pause-script');

    // Update interval
    updateIntervalBtn.addEventListener('click', () => {
        const duration = parseInt(intervalInput.value, 10);

        // Validate input
        if (duration < 10 || duration > 300) {
            alert('Interval must be between 10 and 300 seconds');
            return;
        }

        // Send message to content script to update interval
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'updateInterval',
                duration: duration
            });
        });
    });

    // Start script
    startScriptBtn.addEventListener('click', () => {
        const ad1 = ad1Input.value.trim();
        const ad2 = ad2Input.value.trim();

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'startScript',
                ad1,
                ad2
            }, (response) => {
                // Correctly handle the response here
                if (response && response.started) {
                    startScriptBtn.style.display = 'none';
                    pauseScriptBtn.style.display = 'block';
                    pauseScriptBtn.textContent = 'Pause'; // Update button text
                }
            });
        });
    });

    // Pause script
    pauseScriptBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'togglePause'
            }, (response) => {
                // Correctly handle the response here
                if (response && response.paused) {
                    startScriptBtn.style.display = 'block';
                    pauseScriptBtn.style.display = 'none';
                    startScriptBtn.textContent = 'Start'; // Update button text
                }
            });
        });
    });
});
