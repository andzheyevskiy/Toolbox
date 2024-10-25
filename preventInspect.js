// Prevent on key combination
document.addEventListener('keydown', (event) => {
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
        event.preventDefault();
    }
});

// Disable right-click context menu
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});