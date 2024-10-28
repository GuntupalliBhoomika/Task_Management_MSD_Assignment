// Toggle dark mode functionality
const toggleSwitch = document.getElementById('dark-mode-toggle');
const body = document.body;

toggleSwitch.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
});

// Button hover effect
const getStartedButton = document.querySelector('.get-started');

getStartedButton.addEventListener('mousemove', (e) => {
    const x = e.clientX - e.target.offsetLeft;
    const y = e.clientY - e.target.offsetTop;
    e.target.style.backgroundPosition = `${x}px ${y}px`; // Corrected line
});