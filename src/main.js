/**
 * Meteor Mission - Main Entry Point
 * A Big Five Software Classic Remake
 *
 * Built with Three.js for 3D graphics
 */

import { Game } from './core/Game.js';

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        const game = new Game('game-container');

        // Expose game instance for debugging (optional)
        // window.game = game;
    } catch (error) {
        console.error('Failed to initialize game:', error);
        document.body.innerHTML = `
            <div style="color: #f00; padding: 20px; font-family: monospace;">
                <h1>Error Loading Game</h1>
                <p>${error.message}</p>
            </div>
        `;
    }
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    // Game will naturally pause/resume through requestAnimationFrame
});
