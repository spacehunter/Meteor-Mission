/**
 * Meteor Entity
 * Obstacles that the player must avoid or destroy
 */

import * as THREE from 'three';
import { Entity } from './Entity.js';
import { Config } from '../core/Config.js';

export class Meteor extends Entity {
    constructor(level = 1) {
        super();
        this.level = level;
        this.rotation = { x: 0, y: 0, z: 0 };
        this.isFlagship = false;
        this.flashTimer = 0;
        this.willBecomeFlagship = Math.random() < Config.FLAGSHIP_CHANCE;
        this.points = Config.SCORE_METEOR;
        this.createMesh();
        this.randomize();
    }

    createMesh() {
        // Random meteor shape
        const geometries = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.DodecahedronGeometry(0.8, 0),
            new THREE.OctahedronGeometry(0.9, 0)
        ];

        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshPhongMaterial({
            color: 0x888888,
            emissive: 0x222222,
            flatShading: true
        });

        this.mesh = new THREE.Mesh(geometry, material);

        // Random scale
        const scale = 0.5 + Math.random() * 1;
        this.mesh.scale.set(scale, scale, scale);
        this.radius = scale;
    }

    /**
     * Randomize meteor position and velocity
     */
    randomize() {
        // Safe zone at top (15 units from mothership) for player to start
        const topSafeZone = 15;
        const bottomMargin = 8;
        const yRange = Config.GAME_HEIGHT - topSafeZone - bottomMargin;

        this.mesh.position.set(
            (Math.random() - 0.5) * (Config.GAME_WIDTH - 4),
            -Config.GAME_HEIGHT / 2 + bottomMargin + Math.random() * yRange,
            (Math.random() - 0.5) * 4
        );

        this.mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        const speedMultiplier = 1 + this.level * 0.1;
        this.velocity = {
            x: (Math.random() - 0.5) * 0.1 * speedMultiplier,
            y: (Math.random() - 0.5) * 0.05,
            z: 0
        };

        this.rotation = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
    }

    /**
     * Transform into flagship
     * @param {THREE.Scene} scene
     */
    transformToFlagship(scene) {
        // Remove old mesh
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();

        // Create flagship mesh
        const group = new THREE.Group();

        // Torus body
        const bodyGeometry = new THREE.TorusGeometry(1, 0.3, 8, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            emissive: 0x440044
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        group.add(body);

        // Dome
        const domeGeometry = new THREE.SphereGeometry(0.6, 16, 8);
        const domeMaterial = new THREE.MeshPhongMaterial({
            color: 0xff88ff,
            emissive: 0x442244,
            transparent: true,
            opacity: 0.8
        });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        group.add(dome);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.25, 0.2, 0.5);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.25, 0.2, 0.5);
        group.add(rightEye);

        // Copy position
        group.position.copy(this.mesh.position);

        this.mesh = group;
        this.isFlagship = true;
        this.velocity.x *= 2;
        this.radius = 1.2;
        this.points = Config.SCORE_FLAGSHIP;

        scene.add(group);
    }

    /**
     * Update meteor
     * @param {number} deltaTime
     * @param {THREE.Scene} scene - Scene for flagship transformation
     */
    update(deltaTime, scene = null) {
        if (!this.active) return;

        // Move meteor
        this.mesh.position.x += this.velocity.x;
        this.mesh.position.y += this.velocity.y;

        // Rotate
        this.mesh.rotation.x += this.rotation.x;
        this.mesh.rotation.y += this.rotation.y;
        this.mesh.rotation.z += this.rotation.z;

        // Bounce off horizontal edges
        const halfWidth = Config.GAME_WIDTH / 2 - 2;
        if (this.mesh.position.x < -halfWidth || this.mesh.position.x > halfWidth) {
            this.velocity.x *= -1;
        }

        // Wrap vertically (keep meteors out of safe zone near mothership)
        const topBound = Config.GAME_HEIGHT / 2 - 15;
        const bottomBound = -Config.GAME_HEIGHT / 2 + 5;

        if (this.mesh.position.y < bottomBound) {
            this.mesh.position.y = topBound - 3;
        } else if (this.mesh.position.y > topBound) {
            this.mesh.position.y = bottomBound + 3;
        }

        // Flagship transformation
        if (this.willBecomeFlagship && !this.isFlagship && scene) {
            this.flashTimer += 0.05;

            if (this.flashTimer > Config.FLAGSHIP_FLASH_DURATION) {
                this.transformToFlagship(scene);
            } else if (this.flashTimer > 0) {
                // Flash effect
                const flash = Math.sin(this.flashTimer * 10) > 0;
                this.mesh.material.emissive.setHex(flash ? 0xff00ff : 0x222222);
            }
        }

        // Flagship special rotation
        if (this.isFlagship) {
            this.mesh.rotation.z += 0.05;
        }
    }
}

export default Meteor;
