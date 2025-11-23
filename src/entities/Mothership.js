/**
 * Mothership Entity
 * The space station at the top of the screen
 */

import * as THREE from 'three';
import { Entity } from './Entity.js';
import { Config } from '../core/Config.js';

export class Mothership extends Entity {
    constructor() {
        super();
        this.baseY = Config.GAME_HEIGHT / 2 - 3;
        this.createMesh();
        this.setPosition(0, this.baseY, 0);
    }

    createMesh() {
        this.mesh = new THREE.Group();

        // Main body
        const bodyGeometry = new THREE.CylinderGeometry(3, 4, 2, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x4444ff,
            emissive: 0x111144,
            shininess: 100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        this.mesh.add(body);

        // Dome
        const domeGeometry = new THREE.SphereGeometry(2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshPhongMaterial({
            color: 0x88ccff,
            emissive: 0x224466,
            transparent: true,
            opacity: 0.8
        });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.rotation.x = -Math.PI / 2;
        this.mesh.add(dome);

        // Docking bay indicator
        const dockingGeometry = new THREE.RingGeometry(0.5, 1, 16);
        const dockingMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide
        });
        this.dockingBay = new THREE.Mesh(dockingGeometry, dockingMaterial);
        this.dockingBay.position.z = 1.1;
        this.mesh.add(this.dockingBay);

        // Engine glow
        const engineGeometry = new THREE.CylinderGeometry(1.5, 2, 0.5, 16);
        const engineMaterial = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.6
        });
        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.rotation.x = Math.PI / 2;
        engine.position.z = -1.2;
        this.mesh.add(engine);
    }

    /**
     * Update mothership animation
     * @param {number} deltaTime
     */
    update(deltaTime) {
        // Gentle bob animation
        this.mesh.position.y = this.baseY + Math.sin(Date.now() * 0.001) * 0.5;

        // Docking bay pulse
        const pulse = (Math.sin(Date.now() * 0.005) + 1) / 2;
        this.dockingBay.material.color.setRGB(0, pulse, 0);
    }
}

export default Mothership;
