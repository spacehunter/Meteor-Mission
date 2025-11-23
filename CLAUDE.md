# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

This is a browser-based game with no build process. Due to ES6 module restrictions, a local server is required:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then open http://localhost:8000
```

## Architecture Overview

This is a Three.js-based 3D remake of Meteor Mission II (TRS-80, 1981). The game uses pure ES6 modules with no build dependencies.

### Core Architecture

- **Game.js** (`src/core/Game.js`): Main orchestrator - manages game loop, entity lifecycle, collision handling, and phase transitions
- **GameState.js** (`src/core/GameState.js`): Singleton state manager using Observer pattern. Subscribe to changes via `gameState.on('change', callback)` or specific events like `'levelUp'`
- **Config.js** (`src/core/Config.js`): All game constants (physics, scoring, dimensions). Modify here to adjust difficulty

### Entity System

All game objects extend the base `Entity` class (`src/entities/Entity.js`) which provides:
- Three.js mesh management (`addToScene`, `removeFromScene`)
- Velocity-based movement
- Collision radius for sphere-based collision detection
- Resource cleanup via `dispose()`

Key entities:
- **Lander**: Player ship with thrust, gravity, and phase-specific behavior
- **Meteor**: Can transform into Flagship (500 pts) after flashing
- **Astronaut**: Moves toward lander during LANDED phase

### Systems

- **SceneManager**: Three.js renderer, camera, and scene setup
- **CollisionSystem**: All collision detection (lander-meteor, bullet-meteor, landing, docking)
- **InputSystem**: Singleton keyboard handler with event subscription
- **AudioSystem**: Web Audio API sound effects
- **UIManager**: DOM-based HUD and overlay management

### Game Phases

The game progresses through phases defined in `Config.PHASE`:
1. `TITLE` → `DESCENT` (start game)
2. `DESCENT` → `LANDED` (safe landing on pad)
3. `LANDED` → `ASCENT` (astronaut boards)
4. `ASCENT` → `DESCENT` (dock with mothership)

### Physics Notes

- During **descent phase**, thrust only slows the fall - the ship cannot ascend (velocity.y capped at 0)
- Meteors have a **safe zone** (15 units) near the mothership where they cannot spawn or drift
- Physics constants in `Config.js`: `GRAVITY`, `THRUST`, `DESCENT_SPEED`, `MAX_DESCENT_SPEED`

### Adding New Entities

1. Create class in `src/entities/` extending `Entity`
2. Implement `createMesh()` (called in constructor) and `update(deltaTime)`
3. Export from `src/entities/index.js`
4. Instantiate and manage in `Game.js`
