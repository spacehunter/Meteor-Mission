/**
 * Game Configuration
 * Central location for all game constants and settings
 */

export const Config = {
    // Game dimensions
    GAME_WIDTH: 40,
    GAME_HEIGHT: 60,

    // Gameplay settings
    METEOR_COUNT: 25,
    LANDING_PADS: 3,
    INITIAL_LIVES: 3,
    MAX_BULLETS: 3,

    // Fuel settings
    FUEL_MAX: 100,
    FUEL_CONSUMPTION_RATE: 15,
    FUEL_REFILL_ON_LAND: 50,

    // Physics
    GRAVITY: -0.015,
    THRUST: 0.04,
    HORIZONTAL_SPEED: 0.3,
    DESCENT_SPEED: -0.08,
    ASCENT_SPEED: 0.1,
    BULLET_SPEED: 0.8,
    MAX_DESCENT_SPEED: -0.3,

    // Scoring
    SCORE_LANDING: 100,
    SCORE_RESCUE: 200,
    SCORE_METEOR: 50,
    SCORE_FLAGSHIP: 500,

    // Level progression
    ASTRONAUTS_PER_LEVEL: 5,
    METEORS_PER_LEVEL: 3,

    // Flagship
    FLAGSHIP_CHANCE: 0.05,
    FLAGSHIP_FLASH_DURATION: 3,

    // Visual settings
    STAR_COUNT: 500,

    // Game phases
    PHASE: {
        TITLE: 'title',
        DESCENT: 'descent',
        LANDED: 'landed',
        ASCENT: 'ascent',
        GAME_OVER: 'gameover'
    }
};

export default Config;
