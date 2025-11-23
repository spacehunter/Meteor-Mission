/**
 * LandingPad Entity
 * Platform where the lander can safely land
 */

import * as THREE from 'three';
import { Entity } from './Entity.js';
import { Config } from '../core/Config.js';

export class LandingPad extends Entity {
    constructor(x, index) {
        super();
        this.padX = x;
        this.padIndex = index;
        this.width = 4;
        this.lights = [];
        this.createMesh();
        this.setPosition(x, -Config.GAME_HEIGHT / 2 + 2, 0);
    }

    createMesh() {
        this.mesh = new THREE.Group();

        // Platform
        const platformGeometry = new THREE.BoxGeometry(this.width, 0.5, 2);
        const platformMaterial = new THREE.MeshPhongMaterial({
            color: 0x888888,
            emissive: 0x222222
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        this.mesh.add(platform);

        // Landing lights
        const lightGeometry = new THREE.SphereGeometry(0.2, 8, 8);

        for (let j = -1; j <= 1; j++) {
            const lightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(j * 1.5, 0.35, 0);
            this.lights.push(light);
            this.mesh.add(light);
        }

        // Support legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.2, 2, 8);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });

        for (let j = -1; j <= 1; j += 2) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(j * 1.5, -1.2, 0);
            this.mesh.add(leg);
        }
    }

    /**
     * Check if a position is over this pad
     * @param {number} x - X position to check
     * @returns {boolean}
     */
    isPositionOverPad(x) {
        return Math.abs(x - this.padX) < (this.width / 2 - 0.5);
    }

    /**
     * Update landing light animation
     * @param {number} deltaTime
     */
    update(deltaTime) {
        const time = Date.now() * 0.003;

        this.lights.forEach((light, index) => {
            const brightness = (Math.sin(time + index * 0.5) + 1) / 2;
            light.material.color.setRGB(0, brightness, 0);
        });
    }
}

export default LandingPad;
