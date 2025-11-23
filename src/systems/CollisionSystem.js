/**
 * Collision System
 * Handles all collision detection in the game
 */

import { Config } from '../core/Config.js';

export class CollisionSystem {
    constructor() {
        this.callbacks = new Map();
    }

    /**
     * Register a collision callback
     * @param {string} type - Collision type (e.g., 'lander-meteor', 'bullet-meteor')
     * @param {Function} callback - Callback function (entityA, entityB) => void
     */
    onCollision(type, callback) {
        if (!this.callbacks.has(type)) {
            this.callbacks.set(type, []);
        }
        this.callbacks.get(type).push(callback);
    }

    /**
     * Trigger collision callbacks
     * @param {string} type
     * @param {*} entityA
     * @param {*} entityB
     */
    triggerCollision(type, entityA, entityB) {
        if (this.callbacks.has(type)) {
            this.callbacks.get(type).forEach(cb => cb(entityA, entityB));
        }
    }

    /**
     * Check collision between lander and meteors
     * @param {Lander} lander
     * @param {Meteor[]} meteors
     * @returns {Meteor|null} Collided meteor or null
     */
    checkLanderMeteorCollision(lander, meteors) {
        if (!lander.active) return null;

        for (const meteor of meteors) {
            if (!meteor.active) continue;

            if (lander.collidesWith(meteor)) {
                this.triggerCollision('lander-meteor', lander, meteor);
                return meteor;
            }
        }

        return null;
    }

    /**
     * Check collision between bullets and meteors
     * @param {Bullet[]} bullets
     * @param {Meteor[]} meteors
     * @returns {Array<{bullet: Bullet, meteor: Meteor}>} Array of collisions
     */
    checkBulletMeteorCollisions(bullets, meteors) {
        const collisions = [];

        for (const bullet of bullets) {
            if (!bullet.active) continue;

            for (const meteor of meteors) {
                if (!meteor.active) continue;

                if (bullet.collidesWith(meteor)) {
                    collisions.push({ bullet, meteor });
                    this.triggerCollision('bullet-meteor', bullet, meteor);
                }
            }
        }

        return collisions;
    }

    /**
     * Check if lander is on a landing pad
     * @param {Lander} lander
     * @param {LandingPad[]} pads
     * @returns {LandingPad|null} The pad the lander is on, or null
     */
    checkLandingPadCollision(lander, pads) {
        if (!lander.isAtGroundLevel()) return null;

        for (const pad of pads) {
            if (pad.isPositionOverPad(lander.position.x)) {
                this.triggerCollision('lander-pad', lander, pad);
                return pad;
            }
        }

        return null;
    }

    /**
     * Check if lander hit the ground (not on a pad)
     * @param {Lander} lander
     * @param {LandingPad[]} pads
     * @returns {boolean}
     */
    checkGroundCollision(lander, pads) {
        if (!lander.isAtGroundLevel()) return false;

        // Check if on any pad
        for (const pad of pads) {
            if (pad.isPositionOverPad(lander.position.x)) {
                return false; // On a pad, not crashed
            }
        }

        this.triggerCollision('lander-ground', lander, null);
        return true;
    }

    /**
     * Check if lander can dock with mothership
     * @param {Lander} lander
     * @param {Mothership} mothership
     * @returns {boolean}
     */
    checkDockingCollision(lander, mothership) {
        if (lander.reachedMothership() && lander.isInDockingRange()) {
            this.triggerCollision('lander-mothership', lander, mothership);
            return true;
        }
        return false;
    }

    /**
     * Check if lander is out of horizontal bounds
     * @param {Lander} lander
     * @returns {boolean}
     */
    checkBoundaryCollision(lander) {
        if (lander.isOutOfBounds()) {
            this.triggerCollision('lander-boundary', lander, null);
            return true;
        }
        return false;
    }

    /**
     * Clear all callbacks
     */
    clear() {
        this.callbacks.clear();
    }
}

export default CollisionSystem;
