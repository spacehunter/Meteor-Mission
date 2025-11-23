/**
 * Input System
 * Handles keyboard input with configurable key bindings
 */

class InputSystem {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            up: false,
            space: false
        };

        this.keyBindings = {
            'ArrowLeft': 'left',
            'KeyA': 'left',
            'ArrowRight': 'right',
            'KeyD': 'right',
            'ArrowUp': 'up',
            'KeyW': 'up',
            'Space': 'space'
        };

        this.listeners = new Map();
        this.enabled = true;

        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
    }

    /**
     * Initialize input listeners
     */
    init() {
        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup', this._onKeyUp);
    }

    /**
     * Check if an action is currently pressed
     * @param {string} action - Action name (left, right, up, space)
     * @returns {boolean}
     */
    isPressed(action) {
        return this.enabled && this.keys[action];
    }

    /**
     * Enable or disable input
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            // Reset all keys when disabled
            Object.keys(this.keys).forEach(key => {
                this.keys[key] = false;
            });
        }
    }

    /**
     * Subscribe to input events
     * @param {string} event - Event name ('keydown', 'keyup', or action name)
     * @param {Function} callback
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * Unsubscribe from input events
     * @param {string} event
     * @param {Function} callback
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
     * Notify listeners of input event
     * @param {string} event
     * @param {*} data
     */
    _notify(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(cb => cb(data));
        }
    }

    /**
     * Handle keydown event
     * @param {KeyboardEvent} event
     */
    _onKeyDown(event) {
        if (!this.enabled) return;

        const action = this.keyBindings[event.code];
        if (action) {
            const wasPressed = this.keys[action];
            this.keys[action] = true;

            // Notify on first press only
            if (!wasPressed) {
                this._notify(action, true);
                this._notify('keydown', action);
            }

            // Prevent default for space to avoid page scrolling
            if (event.code === 'Space') {
                event.preventDefault();
            }
        }
    }

    /**
     * Handle keyup event
     * @param {KeyboardEvent} event
     */
    _onKeyUp(event) {
        const action = this.keyBindings[event.code];
        if (action) {
            this.keys[action] = false;
            this._notify(action, false);
            this._notify('keyup', action);
        }
    }

    /**
     * Clean up event listeners
     */
    dispose() {
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup', this._onKeyUp);
        this.listeners.clear();
    }
}

// Export singleton instance
export const inputSystem = new InputSystem();
export default inputSystem;
