document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settings-button');
    const screenshotButton = document.getElementById('screenshot-button');
    const copyScreenshotButton = document.getElementById('clipboard-button');

    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('author');
    const button = document.getElementById('new-quote');
    const bgColorInput = document.getElementById('bg-color');
    const textColorInput = document.getElementById('text-color');
    const boxColorInput = document.getElementById('box-color');
    const fontSizeInput = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const darkModeButton = document.getElementById('toggle-dark-mode');
    const resetButton = document.getElementById('reset-settings');
    const container = document.querySelector('.container');
    const body = document.body;
    const footer = document.querySelector('footer');

    const settingsModal = new bootstrap.Modal(document.getElementById('settings-modal'));

    let quotes = [];
    let isDarkMode = localStorage.getItem('darkMode') === 'true'; // Retrieve mode preference

    async function fetchQuotes() {
        try {
            const response = await fetch('quotes.json');
            if (!response.ok) throw new Error('Network response was not ok');
            quotes = await response.json();
            displayQuote(); // Display a quote when data is fetched
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            quoteElement.textContent = "Failed to load quotes.";
        } 
    }

    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    function displayQuote() {
        if (quotes.length === 0) {
            quoteElement.textContent = "No quotes available.";
            authorElement.textContent = "";
            return;
        }
        const { text, author } = getRandomQuote();
        quoteElement.textContent = `"${text}"`;
        authorElement.textContent = `— ${author}`;
    }

    function applyDarkMode() {
        body.classList.add('dark-mode');
        container.style.backgroundColor = '#444';
        quoteElement.style.color = '#f0f0f0';
        authorElement.style.color = '#ccc';
        footer.style.backgroundColor = '#222';
        footer.style.color = '#f0f0f0';
        darkModeButton.textContent = 'Light Mode';
        document.querySelectorAll('.modal-content').forEach(modal => {
            modal.classList.add('dark-mode');
        });
        localStorage.setItem('darkMode', 'true'); // Save mode preference
    }

    function applyLightMode() {
        body.classList.remove('dark-mode');
        container.style.backgroundColor = '#fff';
        quoteElement.style.color = '#333';
        authorElement.style.color = '#555';
        footer.style.backgroundColor = '#f8f9fa';
        footer.style.color = '#333';
        darkModeButton.textContent = 'Dark Mode';
        document.querySelectorAll('.modal-content').forEach(modal => {
            modal.classList.remove('dark-mode');
        });
        localStorage.setItem('darkMode', 'false'); // Save mode preference
    }

    function resetToDefault() {
        // Reset to dark mode and set default values
        applyDarkMode();
        // Reset color and font size inputs to default dark mode settings
        bgColorInput.value = '#333';
        textColorInput.value = '#f0f0f0';
        boxColorInput.value = '#444';
        fontSizeInput.value = 24;
        fontSizeValue.textContent = '24px';

        // Apply reset values
        body.style.backgroundColor = '#333';
        quoteElement.style.color = '#f0f0f0';
        authorElement.style.color = '#ccc';
        container.style.backgroundColor = '#444';
        quoteElement.style.fontSize = '24px';
        authorElement.style.fontSize = '24px';
    }

    // Initialize with saved mode preference
    if (isDarkMode) {
        applyDarkMode();
    } else {
        applyLightMode();
    }

    button.addEventListener('click', displayQuote);

    bgColorInput.addEventListener('input', (e) => {
        body.style.backgroundColor = e.target.value;
    });

    textColorInput.addEventListener('input', (e) => {
        quoteElement.style.color = e.target.value;
        authorElement.style.color = e.target.value;
    });

    boxColorInput.addEventListener('input', (e) => {
        container.style.backgroundColor = e.target.value;
    });

    fontSizeInput.addEventListener('input', (e) => {
        const fontSize = `${e.target.value}px`;
        fontSizeValue.textContent = fontSize;
        quoteElement.style.fontSize = fontSize;
        authorElement.style.fontSize = fontSize;
    });

    darkModeButton.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            applyDarkMode();
        } else {
            applyLightMode();
        }
    });

    settingsButton.addEventListener('click', () => {
        settingsModal.show();
    });

    resetButton.addEventListener('click', () => {
        resetToDefault();
    });

    function takeScreenshot() {
        html2canvas(container).then(canvas => {
            // Create a link element and set its href to the data URL of the canvas
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'quote-screenshot.png';
            link.click();
        }).catch(error => {
            console.error('Error taking screenshot:', error);
        });
    }

    function copyScreenshotToClipboard() {
        html2canvas(container).then(canvas => {
            canvas.toBlob(blob => {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]).then(() => {
                    alert('Screenshot copied to clipboard!');
                }).catch(error => {
                    console.error('Error copying screenshot to clipboard:', error);
                });
            });
        }).catch(error => {
            console.error('Error taking screenshot:', error);
        });
    }

    // Event listener for the screenshot button
    screenshotButton.addEventListener('click', takeScreenshot);
    copyScreenshotButton.addEventListener('click', copyScreenshotToClipboard);

    // Fetch quotes and display a quote when the page loads
    fetchQuotes();
});
