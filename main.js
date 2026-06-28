const canvas = document.getElementById('gameCanvas');
const game   = new Game(canvas);
game.start();

// Expose game instance for debugging in the browser console
window._game = game;
