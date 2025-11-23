/**
 * Astronaut Entity
 * Stranded astronaut to be rescued
 */

import * as THREE from 'three';
import { Entity } from './Entity.js';
import { Config } from '../core/Config.js';

export const AstronautState = {
    RUNNING: 'running',
    BOARDING: 'boarding',
    ABOARD: 'aboard'
};

export class Astronaut extends Entity {
    constructor(padX) {
        super();
        this.radius = 0.3;
        this.padX = padX;
        this.state = AstronautState.RUNNING;
        this.speed = 0.05;
        this.createMesh();
        this.setStartPosition(padX);
    }

    createMesh() {
        this.mesh = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.2, 0.4, 4, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0x444444
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.mesh.add(body);

        // Helmet
        const helmetGeometry = new THREE.SphereGeometry(0.25, 8, 8);
        const helmetMaterial = new THREE.MeshPhongMaterial({
            color: 0xffcc00,
            emissive: 0x664400,
            transparent: true,
            opacity: 0.8
        });
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.position.y = 0.45;
        this.mesh.add(helmet);
    }

    /**
     * Set starting position
     * @param {number} padX - X position of landing pad
     */
    setStartPosition(padX) {
        this.mesh.position.set(
            padX - 3,
            -Config.GAME_HEIGHT / 2 + 2.5,
            0
        );
    }

    /**
     * Update astronaut
     * @param {number} deltaTime
     * @param {THREE.Vector3} landerPosition - Current lander position
     * @returns {boolean} True if astronaut is aboard
     */
    update(deltaTime, landerPosition) {
        if (!this.active || this.state === AstronautState.ABOARD) return false;

        if (this.state === AstronautState.RUNNING) {
            // Move towards lander
            const direction = Math.sign(landerPosition.x - this.mesh.position.x);
            this.mesh.position.x += direction * this.speed;

            // Walking animation
            this.mesh.rotation.z = Math.sin(Date.now() * 0.01) * 0.2;

            // Check if reached lander
            if (Math.abs(this.mesh.position.x - landerPosition.x) < 0.5) {
                this.state = AstronautState.BOARDING;
                return false;
            }
        } else if (this.state === AstronautState.BOARDING) {
            // Move up into lander
            this.mesh.position.y += 0.05;
            this.mesh.scale.multiplyScalar(0.95);

            if (this.mesh.scale.x < 0.1) {
                this.state = AstronautState.ABOARD;
                this.active = false;
                return true; // Astronaut is now aboard
            }
        }

        return false;
    }

    /**
     * Check if astronaut has started boarding
     * @returns {boolean}
     */
    isBoarding() {
        return this.state === AstronautState.BOARDING;
    }

    /**
     * Check if astronaut is aboard
     * @returns {boolean}
     */
    isAboard() {
        return this.state === AstronautState.ABOARD;
    }
}

export default Astronaut;
