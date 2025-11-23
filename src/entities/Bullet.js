/**
 * Bullet Entity
 * Projectile fired by the lander during ascent
 */

import * as THREE from 'three';
import { Entity } from './Entity.js';
import { Config } from '../core/Config.js';

export class Bullet extends Entity {
    constructor(startPosition) {
        super();
        this.radius = 0.2;
        this.speed = Config.BULLET_SPEED;
        this.createMesh();
        this.setPosition(startPosition.x, startPosition.y + 1.5, startPosition.z);
    }

    createMesh() {
        const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0x888800
        });

        this.mesh = new THREE.Mesh(geometry, material);
    }

    /**
     * Update bullet position
     * @param {number} deltaTime
     * @returns {boolean} True if bullet is still active (on screen)
     */
    update(deltaTime) {
        if (!this.active) return false;

        this.mesh.position.y += this.speed;

        // Deactivate if off screen
        if (this.mesh.position.y > Config.GAME_HEIGHT / 2) {
            this.active = false;
            return false;
        }

        return true;
    }
}

export default Bullet;
