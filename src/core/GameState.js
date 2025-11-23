/**
 * Game State Manager
 * Manages the current state of the game using an observable pattern
 */

import { Config } from './Config.js';

class GameStateManager {
    constructor() {
        this.listeners = new Map();
        this.reset();
    }

    /**
     * Reset game state to initial values
     */
    reset() {
        this.state = {
            phase: Config.PHASE.TITLE,
            score: 0,
            lives: Config.INITIAL_LIVES,
            astronautsRescued: 0,
            fuel: Config.FUEL_MAX,
            hasAstronaut: false,
            level: 1
        };
        this.notify('reset', this.state);
    }

    /**
     * Get current state value
     * @param {string} key - State key to retrieve
     * @returns {*} State value
     */
    get(key) {
        return this.state[key];
    }

    /**
     * Set state value and notify listeners
     * @param {string} key - State key to update
     * @param {*} value - New value
     */
    set(key, value) {
        const oldValue = this.state[key];
        if (oldValue !== value) {
            this.state[key] = value;
            this.notify(key, value, oldValue);
        }
    }

    /**
     * Update multiple state values at once
     * @param {Object} updates - Object containing key-value pairs to update
     */
    update(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    /**
     * Add score points
     * @param {number} points - Points to add
     */
    addScore(points) {
        this.set('score', this.state.score + points);
    }

    /**
     * Consume fuel
     * @param {number} amount - Amount of fuel to consume
     * @returns {boolean} True if fuel was available
     */
    consumeFuel(amount) {
        if (this.state.fuel <= 0) return false;
        this.set('fuel', Math.max(0, this.state.fuel - amount));
        return true;
    }

    /**
     * Refill fuel
     * @param {number} amount - Amount to refill
     */
    refillFuel(amount) {
        this.set('fuel', Math.min(Config.FUEL_MAX, this.state.fuel + amount));
    }

    /**
     * Lose a life
     * @returns {boolean} True if game continues, false if game over
     */
    loseLife() {
        const newLives = this.state.lives - 1;
        this.set('lives', newLives);
        return newLives > 0;
    }

    /**
     * Rescue an astronaut
     */
    rescueAstronaut() {
        const rescued = this.state.astronautsRescued + 1;
        this.set('astronautsRescued', rescued);
        this.addScore(Config.SCORE_RESCUE);

        // Check for level up
        if (rescued % Config.ASTRONAUTS_PER_LEVEL === 0) {
            this.set('level', this.state.level + 1);
            this.notify('levelUp', this.state.level);
        }
    }

    /**
     * Subscribe to state changes
     * @param {string} event - Event name to listen for
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * Unsubscribe from state changes
     * @param {string} event - Event name
     * @param {Function} callback - Callback to remove
     */
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Notify listeners of state change
     * @param {string} event - Event name
     * @param {*} newValue - New value
     * @param {*} oldValue - Previous value
     */
    notify(event, newValue, oldValue) {
        // Notify specific event listeners
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(cb => cb(newValue, oldValue));
        }
        // Notify general change listeners
        if (this.listeners.has('change')) {
            this.listeners.get('change').forEach(cb => cb(event, newValue, oldValue));
        }
    }
}

// Export singleton instance
export const gameState = new GameStateManager();
export default gameState;
