/**
 * Lander Entity
 * Player-controlled rescue ship
 */

import * as THREE from 'three';
import { Entity } from './Entity.js';
import { Config } from '../core/Config.js';

export class Lander extends Entity {
    constructor() {
        super();
        this.radius = 1;
        this.thrusterVisible = false;
        this.createMesh();
    }

    createMesh() {
        this.mesh = new THREE.Group();

        // Main body (cone pointing down)
        const bodyGeometry = new THREE.ConeGeometry(0.8, 2, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x004400
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI;
        this.mesh.add(body);

        // Cockpit
        const cockpitGeometry = new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const cockpitMaterial = new THREE.MeshPhongMaterial({
            color: 0x88ffff,
            emissive: 0x224444,
            transparent: true,
            opacity: 0.7
        });
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.y = 1;
        cockpit.rotation.x = Math.PI;
        this.mesh.add(cockpit);

        // Landing legs
        const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });

        for (let i = 0; i < 3; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            const angle = (i / 3) * Math.PI * 2;
            leg.position.set(Math.cos(angle) * 0.6, -1.2, Math.sin(angle) * 0.6);
            leg.rotation.z = Math.cos(angle) * 0.3;
            leg.rotation.x = Math.sin(angle) * 0.3;
            this.mesh.add(leg);

            // Foot
            const footGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const foot = new THREE.Mesh(footGeometry, legMaterial);
            foot.position.set(Math.cos(angle) * 0.8, -1.6, Math.sin(angle) * 0.8);
            this.mesh.add(foot);
        }

        // Thruster flame
        const thrusterGeometry = new THREE.ConeGeometry(0.3, 1, 8);
        const thrusterMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0
        });
        this.thruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
        this.thruster.position.y = -1.8;
        this.mesh.add(this.thruster);
    }

    /**
     * Reset lander to starting position
     */
    reset() {
        this.setPosition(0, Config.GAME_HEIGHT / 2 - 6, 0);
        this.velocity = { x: 0, y: Config.DESCENT_SPEED, z: 0 };
        this.mesh.rotation.z = 0;
        this.setThrusterVisible(false);
    }

    /**
     * Apply thrust force
     */
    applyThrust() {
        this.velocity.y += Config.THRUST;
        this.setThrusterVisible(true);
    }

    /**
     * Move horizontally
     * @param {number} direction - -1 for left, 1 for right
     * @param {number} speedMultiplier - Speed multiplier (default 1)
     */
    moveHorizontal(direction, speedMultiplier = 1) {
        this.mesh.position.x += direction * Config.HORIZONTAL_SPEED * speedMultiplier;
        this.mesh.rotation.z = -direction * 0.2;
    }

    /**
     * Apply gravity
     */
    applyGravity() {
        this.velocity.y += Config.GRAVITY;
        // Limit descent speed
        this.velocity.y = Math.max(this.velocity.y, Config.MAX_DESCENT_SPEED);
    }

    /**
     * Set thruster visibility
     * @param {boolean} visible
     * @param {number} intensity - 0 to 1
     */
    setThrusterVisible(visible, intensity = 0.8) {
        this.thruster.material.opacity = visible ? intensity : 0;
        this.thrusterVisible = visible;
    }

    /**
     * Ease rotation back to neutral
     */
    easeRotation() {
        this.mesh.rotation.z *= 0.9;
    }

    /**
     * Clamp position within game boundaries
     */
    clampPosition() {
        const halfWidth = Config.GAME_WIDTH / 2 - 1;
        this.mesh.position.x = Math.max(-halfWidth, Math.min(halfWidth, this.mesh.position.x));
    }

    /**
     * Update lander position
     * @param {number} deltaTime
     */
    update(deltaTime) {
        if (!this.active) return;

        // Apply velocity
        this.mesh.position.x += this.velocity.x;
        this.mesh.position.y += this.velocity.y;

        // Clamp position
        this.clampPosition();
    }

    /**
     * Set for ascent mode
     */
    startAscent() {
        this.velocity.y = Config.ASCENT_SPEED;
    }

    /**
     * Boost ascent speed
     */
    boostAscent() {
        this.velocity.y = Config.ASCENT_SPEED * 1.5;
    }

    /**
     * Check if lander is at ground level
     * @returns {boolean}
     */
    isAtGroundLevel() {
        return this.mesh.position.y < -Config.GAME_HEIGHT / 2 + 3;
    }

    /**
     * Check if lander reached mothership level
     * @returns {boolean}
     */
    reachedMothership() {
        return this.mesh.position.y > Config.GAME_HEIGHT / 2 - 6;
    }

    /**
     * Check if lander is within docking range
     * @returns {boolean}
     */
    isInDockingRange() {
        return Math.abs(this.mesh.position.x) < 2;
    }

    /**
     * Check if lander is outside horizontal boundaries
     * @returns {boolean}
     */
    isOutOfBounds() {
        const halfWidth = Config.GAME_WIDTH / 2 - 1;
        return this.mesh.position.x < -halfWidth || this.mesh.position.x > halfWidth;
    }
}

export default Lander;
