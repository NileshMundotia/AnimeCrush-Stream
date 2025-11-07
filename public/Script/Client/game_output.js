const gameFrame = document.getElementById('gameFrame');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const muteBtn = document.getElementById('muteBtn');

// Fullscreen functionality
fullscreenBtn.addEventListener('click', () => {
    if (gameFrame.requestFullscreen) {
        gameFrame.requestFullscreen();
    } else if (gameFrame.mozRequestFullScreen) { // Firefox
        gameFrame.mozRequestFullScreen();
    } else if (gameFrame.webkitRequestFullscreen) { // Chrome, Safari and Opera
        gameFrame.webkitRequestFullscreen();
    } else if (gameFrame.msRequestFullscreen) { // IE/Edge
        gameFrame.msRequestFullscreen();
    }
});

// Mute functionality (assuming your game has a mute function)
muteBtn.addEventListener('click', () => {
    const gameWindow = gameFrame.contentWindow;
    if (gameWindow && gameWindow.mute) {
        gameWindow.mute(); // Ensure your game has a mute function
    }
});
