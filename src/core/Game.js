/**
 * Main Game Class
 * Orchestrates all game systems and manages the game loop
 */

import { Config } from './Config.js';
import { gameState } from './GameState.js';
import { SceneManager } from '../systems/SceneManager.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { UIManager } from '../systems/UIManager.js';
import { audioSystem } from '../systems/AudioSystem.js';
import { inputSystem } from '../systems/InputSystem.js';
import {
    Lander,
    Meteor,
    Astronaut,
    Bullet,
    Mothership,
    LandingPad,
    Explosion
} from '../entities/index.js';

export class Game {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container element '${containerId}' not found`);
        }

        // Systems
        this.sceneManager = new SceneManager(this.container);
        this.collisionSystem = new CollisionSystem();
        this.uiManager = new UIManager();

        // Entities
        this.lander = null;
        this.mothership = null;
        this.meteors = [];
        this.landingPads = [];
        this.bullets = [];
        this.explosions = [];
        this.astronaut = null;

        // Timing
        this.lastTime = 0;
        this.animationId = null;

        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
        this.handleSpacePress = this.handleSpacePress.bind(this);

        this.init();
    }

    /**
     * Initialize game
     */
    init() {
        // Setup input
        inputSystem.init();
        inputSystem.on('space', this.handleSpacePress);

        // Create static entities
        this.createMothership();
        this.createLandingPads();

        // Show title screen
        this.uiManager.showTitleScreen();
        this.setupStartButton();

        // Subscribe to game state changes
        this.setupStateListeners();

        // Start render loop (for title screen animation)
        this.startLoop();
    }

    /**
     * Setup game state change listeners
     */
    setupStateListeners() {
        gameState.on('change', (key, value) => {
            this.uiManager.updateAll(gameState.state);
        });

        gameState.on('levelUp', (level) => {
            this.createMeteors();
        });
    }

    /**
     * Setup start button click handler
     */
    setupStartButton() {
        const startBtn = this.uiManager.getStartButton();
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
    }

    /**
     * Setup restart button click handler
     */
    setupRestartButton() {
        const restartBtn = this.uiManager.getRestartButton();
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.startGame());
        }
    }

    /**
     * Create mothership
     */
    createMothership() {
        this.mothership = new Mothership();
        this.mothership.addToScene(this.sceneManager.getScene());
    }

    /**
     * Create landing pads
     */
    createLandingPads() {
        const padSpacing = Config.GAME_WIDTH / (Config.LANDING_PADS + 1);

        for (let i = 0; i < Config.LANDING_PADS; i++) {
            const x = -Config.GAME_WIDTH / 2 + padSpacing * (i + 1);
            const pad = new LandingPad(x, i);
            pad.addToScene(this.sceneManager.getScene());
            this.landingPads.push(pad);
        }
    }

    /**
     * Create meteors
     */
    createMeteors() {
        // Remove existing meteors
        this.meteors.forEach(m => m.removeFromScene(this.sceneManager.getScene()));
        this.meteors = [];

        const count = Config.METEOR_COUNT + gameState.get('level') * Config.METEORS_PER_LEVEL;

        for (let i = 0; i < count; i++) {
            const meteor = new Meteor(gameState.get('level'));
            meteor.addToScene(this.sceneManager.getScene());
            this.meteors.push(meteor);
        }
    }

    /**
     * Create lander
     */
    createLander() {
        if (this.lander) {
            this.lander.removeFromScene(this.sceneManager.getScene());
        }

        this.lander = new Lander();
        this.lander.reset();
        this.lander.addToScene(this.sceneManager.getScene());
    }

    /**
     * Create astronaut at landing pad
     * @param {LandingPad} pad
     */
    createAstronaut(pad) {
        if (this.astronaut) {
            this.astronaut.removeFromScene(this.sceneManager.getScene());
        }

        this.astronaut = new Astronaut(pad.padX);
        this.astronaut.addToScene(this.sceneManager.getScene());
    }

    /**
     * Create bullet
     */
    createBullet() {
        if (this.bullets.length >= Config.MAX_BULLETS) return;

        const bullet = new Bullet(this.lander.position);
        bullet.addToScene(this.sceneManager.getScene());
        this.bullets.push(bullet);
        audioSystem.play('shoot');
    }

    /**
     * Create explosion at position
     * @param {THREE.Vector3} position
     */
    createExplosion(position) {
        const explosion = new Explosion(position.clone());
        explosion.addToScene(this.sceneManager.getScene());
        this.explosions.push(explosion);
    }

    /**
     * Handle space key press
     * @param {boolean} pressed
     */
    handleSpacePress(pressed) {
        if (pressed && gameState.get('phase') === Config.PHASE.ASCENT) {
            this.createBullet();
        }
    }

    /**
     * Start the game
     */
    startGame() {
        audioSystem.init();

        // Reset game state
        gameState.reset();
        gameState.set('phase', Config.PHASE.DESCENT);

        // Create game entities
        this.createMeteors();
        this.createLander();

        // Clear bullets and explosions
        this.bullets.forEach(b => b.removeFromScene(this.sceneManager.getScene()));
        this.bullets = [];
        this.explosions.forEach(e => e.removeFromScene(this.sceneManager.getScene()));
        this.explosions = [];

        if (this.astronaut) {
            this.astronaut.removeFromScene(this.sceneManager.getScene());
            this.astronaut = null;
        }

        // Update UI
        this.uiManager.hideMessageOverlay();
        this.uiManager.showControlsHelp();
        this.uiManager.updateAll(gameState.state);
    }

    /**
     * Handle game over
     */
    gameOver() {
        gameState.set('phase', Config.PHASE.GAME_OVER);
        this.uiManager.showGameOver(
            gameState.get('score'),
            gameState.get('astronautsRescued'),
            gameState.get('level')
        );
        this.setupRestartButton();
    }

    /**
     * Handle losing a life
     */
    loseLife() {
        audioSystem.play('explosion');
        this.createExplosion(this.lander.position);

        const hasLives = gameState.loseLife();

        if (!hasLives) {
            this.gameOver();
        } else {
            // Reset for next attempt
            setTimeout(() => {
                gameState.set('phase', Config.PHASE.DESCENT);
                gameState.set('hasAstronaut', false);
                this.lander.reset();
                gameState.refillFuel(Config.FUEL_MAX);

                if (this.astronaut) {
                    this.astronaut.removeFromScene(this.sceneManager.getScene());
                    this.astronaut = null;
                }
            }, 1000);
        }
    }

    /**
     * Update lander based on input and phase
     * @param {number} deltaTime
     */
    updateLander(deltaTime) {
        if (!this.lander || !this.lander.active) return;

        const phase = gameState.get('phase');

        if (phase === Config.PHASE.DESCENT) {
            this.updateDescentPhase(deltaTime);
        } else if (phase === Config.PHASE.ASCENT) {
            this.updateAscentPhase(deltaTime);
        }

        this.lander.update(deltaTime);
    }

    /**
     * Update descent phase logic
     * @param {number} deltaTime
     */
    updateDescentPhase(deltaTime) {
        // Apply gravity
        this.lander.applyGravity();

        // Horizontal movement
        if (inputSystem.isPressed('left')) {
            this.lander.moveHorizontal(-1);
        } else if (inputSystem.isPressed('right')) {
            this.lander.moveHorizontal(1);
        } else {
            this.lander.easeRotation();
        }

        // Thrust
        if (inputSystem.isPressed('up') && gameState.get('fuel') > 0) {
            this.lander.applyThrust();
            gameState.consumeFuel(Config.FUEL_CONSUMPTION_RATE * deltaTime);
            this.lander.setThrusterVisible(true);
            if (Math.random() < 0.3) audioSystem.play('thrust');
        } else {
            this.lander.setThrusterVisible(false);
        }
    }

    /**
     * Update ascent phase logic
     * @param {number} deltaTime
     */
    updateAscentPhase(deltaTime) {
        // Base ascent
        this.lander.velocity.y = Config.ASCENT_SPEED;

        // Horizontal movement (slower)
        if (inputSystem.isPressed('left')) {
            this.lander.moveHorizontal(-1, 0.7);
        } else if (inputSystem.isPressed('right')) {
            this.lander.moveHorizontal(1, 0.7);
        } else {
            this.lander.easeRotation();
        }

        // Boost
        if (inputSystem.isPressed('space')) {
            this.lander.boostAscent();
            this.lander.setThrusterVisible(true, 0.8);
        } else if (inputSystem.isPressed('up') && gameState.get('fuel') > 0) {
            this.lander.velocity.y = Config.ASCENT_SPEED * 1.3;
            gameState.consumeFuel(Config.FUEL_CONSUMPTION_RATE * deltaTime * 0.5);
            this.lander.setThrusterVisible(true, 0.6);
        } else {
            this.lander.setThrusterVisible(true, 0.4);
        }
    }

    /**
     * Update all meteors
     * @param {number} deltaTime
     */
    updateMeteors(deltaTime) {
        const scene = this.sceneManager.getScene();
        this.meteors.forEach(meteor => meteor.update(deltaTime, scene));
    }

    /**
     * Update astronaut
     * @param {number} deltaTime
     */
    updateAstronaut(deltaTime) {
        if (!this.astronaut || gameState.get('phase') !== Config.PHASE.LANDED) return;

        const isAboard = this.astronaut.update(deltaTime, this.lander.position);

        if (this.astronaut.isBoarding() && !gameState.get('hasAstronaut')) {
            audioSystem.play('pickup');
        }

        if (isAboard) {
            this.astronaut.removeFromScene(this.sceneManager.getScene());
            this.astronaut = null;
            gameState.set('hasAstronaut', true);
            gameState.set('phase', Config.PHASE.ASCENT);
            this.lander.startAscent();
        }
    }

    /**
     * Update bullets
     * @param {number} deltaTime
     */
    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            const active = bullet.update(deltaTime);

            if (!active) {
                bullet.removeFromScene(this.sceneManager.getScene());
                this.bullets.splice(i, 1);
            }
        }
    }

    /**
     * Update explosions
     * @param {number} deltaTime
     */
    updateExplosions(deltaTime) {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            const active = explosion.update(deltaTime);

            if (!active) {
                explosion.removeFromScene(this.sceneManager.getScene());
                this.explosions.splice(i, 1);
            }
        }
    }

    /**
     * Check all collisions
     */
    checkCollisions() {
        const phase = gameState.get('phase');

        if (phase === Config.PHASE.LANDED ||
            phase === Config.PHASE.GAME_OVER ||
            phase === Config.PHASE.TITLE) {
            return;
        }

        // Lander vs Meteors
        const hitMeteor = this.collisionSystem.checkLanderMeteorCollision(this.lander, this.meteors);
        if (hitMeteor) {
            this.loseLife();
            return;
        }

        // Boundary check
        if (this.collisionSystem.checkBoundaryCollision(this.lander)) {
            this.loseLife();
            return;
        }

        // Bullet vs Meteor collisions
        const bulletHits = this.collisionSystem.checkBulletMeteorCollisions(this.bullets, this.meteors);
        bulletHits.forEach(({ bullet, meteor }) => {
            this.createExplosion(meteor.position);
            audioSystem.play('explosion');
            gameState.addScore(meteor.points);

            bullet.removeFromScene(this.sceneManager.getScene());
            meteor.removeFromScene(this.sceneManager.getScene());

            const bulletIndex = this.bullets.indexOf(bullet);
            if (bulletIndex > -1) this.bullets.splice(bulletIndex, 1);

            const meteorIndex = this.meteors.indexOf(meteor);
            if (meteorIndex > -1) this.meteors.splice(meteorIndex, 1);
        });

        // Phase-specific collisions
        if (phase === Config.PHASE.DESCENT) {
            // Landing pad check
            const pad = this.collisionSystem.checkLandingPadCollision(this.lander, this.landingPads);
            if (pad) {
                audioSystem.play('land');
                gameState.set('phase', Config.PHASE.LANDED);
                this.lander.setPosition(this.lander.position.x, -Config.GAME_HEIGHT / 2 + 3.5, 0);
                this.lander.velocity = { x: 0, y: 0, z: 0 };
                gameState.refillFuel(Config.FUEL_REFILL_ON_LAND);
                gameState.addScore(Config.SCORE_LANDING);
                this.createAstronaut(pad);
            } else if (this.collisionSystem.checkGroundCollision(this.lander, this.landingPads)) {
                this.loseLife();
            }
        } else if (phase === Config.PHASE.ASCENT) {
            // Docking check
            if (this.collisionSystem.checkDockingCollision(this.lander, this.mothership)) {
                audioSystem.play('dock');

                if (gameState.get('hasAstronaut')) {
                    gameState.rescueAstronaut();
                    gameState.set('hasAstronaut', false);
                }

                gameState.set('phase', Config.PHASE.DESCENT);
                this.lander.reset();
            }
        }
    }

    /**
     * Update static entities (landing pads, mothership)
     * @param {number} deltaTime
     */
    updateStaticEntities(deltaTime) {
        this.landingPads.forEach(pad => pad.update(deltaTime));
        if (this.mothership) this.mothership.update(deltaTime);
    }

    /**
     * Main game loop
     * @param {number} currentTime
     */
    gameLoop(currentTime) {
        this.animationId = requestAnimationFrame(this.gameLoop);

        const deltaTime = (currentTime - this.lastTime) / 1000 || 0.016;
        this.lastTime = currentTime;

        const phase = gameState.get('phase');

        // Update game logic only during active play
        if (phase !== Config.PHASE.TITLE && phase !== Config.PHASE.GAME_OVER) {
            this.updateLander(deltaTime);
            this.updateMeteors(deltaTime);
            this.updateAstronaut(deltaTime);
            this.updateBullets(deltaTime);
            this.updateExplosions(deltaTime);
            this.checkCollisions();
        }

        // Always update static entities for animation
        this.updateStaticEntities(deltaTime);

        // Render
        this.sceneManager.render();
    }

    /**
     * Start game loop
     */
    startLoop() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.gameLoop);
        }
    }

    /**
     * Stop game loop
     */
    stopLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.stopLoop();
        inputSystem.dispose();
        audioSystem.dispose();
        this.sceneManager.dispose();
        this.collisionSystem.clear();
    }
}

export default Game;
