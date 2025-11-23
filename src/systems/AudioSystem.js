/**
 * Audio System
 * Handles all game sound effects using Web Audio API
 */

class AudioSystem {
    constructor() {
        this.context = null;
        this.enabled = true;
        this.masterVolume = 0.5;
    }

    /**
     * Initialize the audio context (must be called after user interaction)
     */
    init() {
        if (this.context) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            this.enabled = false;
        }
    }

    /**
     * Set master volume
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Toggle audio on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Play a sound effect
     * @param {string} type - Sound type to play
     */
    play(type) {
        if (!this.context || !this.enabled) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        const now = this.context.currentTime;
        const volume = this.masterVolume;

        switch (type) {
            case 'thrust':
                this._playThrust(oscillator, gainNode, now, volume);
                break;
            case 'shoot':
                this._playShoot(oscillator, gainNode, now, volume);
                break;
            case 'explosion':
                this._playExplosion(oscillator, gainNode, now, volume);
                break;
            case 'pickup':
                this._playPickup(oscillator, gainNode, now, volume);
                break;
            case 'dock':
                this._playDock(oscillator, gainNode, now, volume);
                break;
            case 'land':
                this._playLand(oscillator, gainNode, now, volume);
                break;
            default:
                console.warn(`Unknown sound type: ${type}`);
                return;
        }
    }

    _playThrust(osc, gain, now, vol) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        gain.gain.setValueAtTime(0.1 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    _playShoot(osc, gain, now, vol) {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(0.2 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    _playExplosion(osc, gain, now, vol) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        gain.gain.setValueAtTime(0.3 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    _playPickup(osc, gain, now, vol) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        gain.gain.setValueAtTime(0.2 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    _playDock(osc, gain, now, vol) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(800, now + 0.1);
        osc.frequency.setValueAtTime(1000, now + 0.2);
        gain.gain.setValueAtTime(0.2 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    _playLand(osc, gain, now, vol) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
        gain.gain.setValueAtTime(0.2 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Clean up audio context
     */
    dispose() {
        if (this.context) {
            this.context.close();
            this.context = null;
        }
    }
}

// Export singleton instance
export const audioSystem = new AudioSystem();
export default audioSystem;
