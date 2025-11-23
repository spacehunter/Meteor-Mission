# Meteor Mission

A web-based 3D remake of the classic **Meteor Mission II** by Big Five Software, originally released for the TRS-80 in 1981.

## About the Original Game

Meteor Mission II was developed by Big Five Software, founded by Bill Hogue, one of the pioneering game developers for the TRS-80 personal computer. The game was inspired by Taito's 1979 arcade game *Lunar Rescue*.

### The Story

> **THE SECOND BIG BANG HAS OCCURRED!**
>
> The galaxy is now full of stray meteors. Brave astronauts are stranded on the planet surface below. Your mission: Navigate your rescue lander through the treacherous meteor field, land on one of the platforms, rescue the astronauts, and return safely to the mothership!

## Gameplay

The game consists of three distinct phases:

### 1. Descent Phase
Navigate your lander ship downward through a field of moving meteors. Use thrust to slow your descent and avoid collisions. Land safely on one of three landing pads at the bottom of the screen.

### 2. Rescue Phase
Once landed, a stranded astronaut will run towards your ship and board. Wait for the rescue to complete before taking off.

### 3. Ascent Phase
With the astronaut aboard, fly back up through the meteor field to dock with the mothership. During this phase, you can fire your weapons to destroy meteors in your path. Shooting also provides a speed boost!

### The Flagship
Occasionally, a meteor will begin flashing. After a few moments, it transforms into the **Flagship** - a UFO-like enemy worth bonus points. It moves faster and is more dangerous, but destroying it rewards you with 500 points!

## Controls

| Key | Action |
|-----|--------|
| `LEFT ARROW` / `A` | Move left |
| `RIGHT ARROW` / `D` | Move right |
| `UP ARROW` / `W` | Thrust (slow descent / speed up ascent) |
| `SPACE` | Fire weapon (ascent phase only) |

## Scoring

| Action | Points |
|--------|--------|
| Safe landing | 100 |
| Astronaut rescue & dock | 200 |
| Destroy meteor | 50 |
| Destroy Flagship | 500 |

## Game Mechanics

- **Fuel**: Thrusting consumes fuel. Land on a pad to refuel.
- **Lives**: You start with 3 lives. Colliding with meteors, the ground, or screen edges costs a life.
- **Levels**: Every 5 astronauts rescued increases the difficulty with more meteors.

## How to Play

Simply open `index.html` in any modern web browser. No installation or build process required!

The game uses Three.js loaded from a CDN, so an internet connection is required for the first load.

## Technical Details

- Built with **Three.js** for 3D graphics
- Pure JavaScript ES6 modules with no build dependencies
- Web Audio API for retro-style sound effects
- Responsive design that adapts to window size

## Project Structure

```
Meteor-Mission/
├── index.html              # Entry point
├── css/
│   └── styles.css          # Game styles
└── src/
    ├── main.js             # Application bootstrap
    ├── core/
    │   ├── Config.js       # Game configuration constants
    │   ├── Game.js         # Main game orchestrator
    │   ├── GameState.js    # State management with observers
    │   └── index.js        # Core module exports
    ├── entities/
    │   ├── Entity.js       # Base entity class
    │   ├── Lander.js       # Player ship
    │   ├── Meteor.js       # Obstacles (transform to Flagship)
    │   ├── Astronaut.js    # Rescue targets
    │   ├── Bullet.js       # Projectiles
    │   ├── Mothership.js   # Docking station
    │   ├── LandingPad.js   # Landing platforms
    │   ├── Explosion.js    # Particle effects
    │   └── index.js        # Entity module exports
    ├── systems/
    │   ├── AudioSystem.js  # Sound effects (Web Audio API)
    │   ├── InputSystem.js  # Keyboard input handling
    │   ├── SceneManager.js # Three.js scene management
    │   ├── CollisionSystem.js # Collision detection
    │   ├── UIManager.js    # DOM UI updates
    │   └── index.js        # Systems module exports
    └── utils/              # Utility functions (future use)
```

## Architecture

The game follows a modular architecture with separation of concerns:

- **Core**: Configuration, game state management, and main game loop
- **Entities**: Game objects with their own update logic and 3D meshes
- **Systems**: Reusable systems for audio, input, rendering, collisions, and UI

Key design patterns used:
- **Observer Pattern**: GameState notifies listeners on state changes
- **Entity-Component**: Base Entity class with specialized subclasses
- **Singleton**: System instances (audio, input) shared across the application

## Historical Context

Big Five Software was one of the most successful TRS-80 game publishers of the early 1980s. Founded by Bill Hogue, the company was known for its high-quality arcade-style games that pushed the limits of the TRS-80 hardware.

The original Meteor Mission (1980) was Bill Hogue's first commercial game - a simpler two-player competitive game. Meteor Mission II (1981) was a completely different game inspired by Lunar Rescue, featuring the rescue gameplay that this remake recreates.

Big Five Software's games were notable for their smooth graphics, addictive gameplay, and the iconic "Flagship" alien that appeared across many of their titles.

## Credits

- **Original Game**: Big Five Software (1981)
- **Original Designer**: Bill Hogue
- **This Remake**: Built with Three.js

## License

This is a fan remake created for educational and entertainment purposes. The original Meteor Mission II is a trademark of Big Five Software.

---

*"Race through the meteor field and rescue the stranded astronauts before time runs out!"*
