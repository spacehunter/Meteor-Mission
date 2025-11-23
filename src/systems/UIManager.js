/**
 * UI Manager
 * Handles all HTML UI updates
 */

import { Config } from '../core/Config.js';

export class UIManager {
    constructor() {
        this.elements = {};
        this.cacheElements();
    }

    /**
     * Cache DOM element references
     */
    cacheElements() {
        this.elements = {
            score: document.getElementById('score'),
            rescuedCount: document.getElementById('rescued-count'),
            livesDisplay: document.getElementById('lives-display'),
            phaseText: document.getElementById('phase-text'),
            fuelBar: document.getElementById('fuel-bar'),
            messageOverlay: document.getElementById('message-overlay'),
            controlsHelp: document.getElementById('controls-help')
        };
    }

    /**
     * Update score display
     * @param {number} score
     */
    updateScore(score) {
        if (this.elements.score) {
            this.elements.score.textContent = score;
        }
    }

    /**
     * Update rescued astronaut count
     * @param {number} count
     */
    updateRescuedCount(count) {
        if (this.elements.rescuedCount) {
            this.elements.rescuedCount.textContent = count;
        }
    }

    /**
     * Update lives display
     * @param {number} lives
     */
    updateLives(lives) {
        if (!this.elements.livesDisplay) return;

        this.elements.livesDisplay.innerHTML = '';
        for (let i = 0; i < lives; i++) {
            const lifeIcon = document.createElement('span');
            lifeIcon.className = 'life-icon';
            this.elements.livesDisplay.appendChild(lifeIcon);
        }
    }

    /**
     * Update phase indicator text
     * @param {string} phase
     */
    updatePhase(phase) {
        if (!this.elements.phaseText) return;

        switch (phase) {
            case Config.PHASE.DESCENT:
                this.elements.phaseText.textContent = 'DESCENT PHASE';
                break;
            case Config.PHASE.LANDED:
                this.elements.phaseText.textContent = 'RESCUE IN PROGRESS';
                break;
            case Config.PHASE.ASCENT:
                this.elements.phaseText.textContent = 'ASCENT PHASE - FIRE TO BOOST!';
                break;
            default:
                this.elements.phaseText.textContent = '';
        }
    }

    /**
     * Update fuel bar
     * @param {number} fuel - Current fuel
     * @param {number} maxFuel - Maximum fuel
     */
    updateFuel(fuel, maxFuel = Config.FUEL_MAX) {
        if (this.elements.fuelBar) {
            const percentage = (fuel / maxFuel) * 100;
            this.elements.fuelBar.style.width = `${percentage}%`;
        }
    }

    /**
     * Show the title screen
     */
    showTitleScreen() {
        if (!this.elements.messageOverlay) return;

        this.elements.messageOverlay.innerHTML = `
            <h1>METEOR MISSION</h1>
            <h2>A Big Five Software Classic</h2>
            <div class="story">
                <p><strong>THE SECOND BIG BANG HAS OCCURRED!</strong></p>
                <p>The galaxy is now full of stray meteors. Brave astronauts are stranded on the planet surface below.</p>
                <p>Your mission: Navigate your rescue lander through the treacherous meteor field, land on one of the platforms, rescue the astronauts, and return safely to the mothership!</p>
                <p><strong>BEWARE:</strong> Some meteors transform into the dreaded Flagship - worth bonus points but deadly to touch!</p>
            </div>
            <p><strong>CONTROLS:</strong></p>
            <p>LEFT/RIGHT ARROWS or A/D - Move horizontally</p>
            <p>UP ARROW or W - Thrust (slow descent / speed ascent)</p>
            <p>SPACE - Fire (during ascent phase)</p>
            <button id="start-btn">START MISSION</button>
        `;
        this.elements.messageOverlay.classList.remove('hidden');
        this.hideControlsHelp();
    }

    /**
     * Show game over screen
     * @param {number} score
     * @param {number} astronautsRescued
     * @param {number} level
     */
    showGameOver(score, astronautsRescued, level) {
        if (!this.elements.messageOverlay) return;

        this.elements.messageOverlay.innerHTML = `
            <h1>GAME OVER</h1>
            <h2>Final Score: ${score}</h2>
            <p>Astronauts Rescued: ${astronautsRescued}</p>
            <p>Level Reached: ${level}</p>
            <button id="restart-btn">PLAY AGAIN</button>
        `;
        this.elements.messageOverlay.classList.remove('hidden');
        this.hideControlsHelp();
    }

    /**
     * Hide message overlay
     */
    hideMessageOverlay() {
        if (this.elements.messageOverlay) {
            this.elements.messageOverlay.classList.add('hidden');
        }
    }

    /**
     * Show controls help
     */
    showControlsHelp() {
        if (this.elements.controlsHelp) {
            this.elements.controlsHelp.classList.remove('hidden');
        }
    }

    /**
     * Hide controls help
     */
    hideControlsHelp() {
        if (this.elements.controlsHelp) {
            this.elements.controlsHelp.classList.add('hidden');
        }
    }

    /**
     * Update all UI elements at once
     * @param {Object} state - Game state object
     */
    updateAll(state) {
        this.updateScore(state.score);
        this.updateRescuedCount(state.astronautsRescued);
        this.updateLives(state.lives);
        this.updatePhase(state.phase);
        this.updateFuel(state.fuel);
    }

    /**
     * Get start button element
     * @returns {HTMLElement|null}
     */
    getStartButton() {
        return document.getElementById('start-btn');
    }

    /**
     * Get restart button element
     * @returns {HTMLElement|null}
     */
    getRestartButton() {
        return document.getElementById('restart-btn');
    }
}

export default UIManager;
