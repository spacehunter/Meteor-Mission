/**
 * Base Entity Class
 * All game objects inherit from this class
 */

import * as THREE from 'three';

export class Entity {
    constructor() {
        this.mesh = null;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.active = true;
        this.radius = 1;
    }

    /**
     * Get entity position
     * @returns {THREE.Vector3}
     */
    get position() {
        return this.mesh ? this.mesh.position : new THREE.Vector3();
    }

    /**
     * Set entity position
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    setPosition(x, y, z = 0) {
        if (this.mesh) {
            this.mesh.position.set(x, y, z);
        }
    }

    /**
     * Update entity (override in subclasses)
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(deltaTime) {
        if (!this.active || !this.mesh) return;

        // Apply velocity
        this.mesh.position.x += this.velocity.x;
        this.mesh.position.y += this.velocity.y;
        this.mesh.position.z += this.velocity.z;
    }

    /**
     * Check collision with another entity
     * @param {Entity} other
     * @returns {boolean}
     */
    collidesWith(other) {
        if (!this.active || !other.active) return false;
        if (!this.mesh || !other.mesh) return false;

        const distance = this.position.distanceTo(other.position);
        return distance < (this.radius + other.radius);
    }

    /**
     * Add mesh to scene
     * @param {THREE.Scene} scene
     */
    addToScene(scene) {
        if (this.mesh) {
            scene.add(this.mesh);
        }
    }

    /**
     * Remove mesh from scene
     * @param {THREE.Scene} scene
     */
    removeFromScene(scene) {
        if (this.mesh) {
            scene.remove(this.mesh);
        }
    }

    /**
     * Clean up resources
     */
    dispose() {
        if (this.mesh) {
            if (this.mesh.geometry) {
                this.mesh.geometry.dispose();
            }
            if (this.mesh.material) {
                if (Array.isArray(this.mesh.material)) {
                    this.mesh.material.forEach(m => m.dispose());
                } else {
                    this.mesh.material.dispose();
                }
            }
        }
        this.active = false;
    }
}

export default Entity;
