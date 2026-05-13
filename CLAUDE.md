# Claude Instructions — Balrog vs Gandalf Game

## Project type
Simple browser-based turn-based duel game (vanilla HTML/CSS/JS)

## Hard constraints (DO NOT BREAK)
- No frameworks (no React, Phaser, Vue, etc.)
- No build tools (no Webpack, Vite, etc.)
- Only vanilla HTML, CSS, JavaScript
- Keep changes minimal and incremental
- Do NOT refactor unrelated code
- Do NOT introduce new architecture unless explicitly requested

## Core files
- index.html → UI structure
- style.css → visuals + animations
- game.js → game logic (state, actions, AI)

## Game design summary
Theme: Gandalf vs Balrog on the Bridge of Khazad-dûm

Turn-based combat:
1. Player turn (Gandalf)
2. Enemy turn (Balrog AI)

## Player abilities
- Strike: 8–12 damage
- Fire Spell: 18–25 damage, 2-turn cooldown
- Shield: blocks next attack
- Light: 50% chance to stun enemy

## Enemy AI
Simple probabilistic behavior:
- Whip (common)
- Smash (less common, higher damage, 50% hit chance)
- Rage (buff next attack)

## UI expectations
- HP bars visible for both characters
- Buttons for actions
- Battle log with events
- Minimal but readable layout

## Development style
- Prefer small diffs over large rewrites
- Explain changes briefly when modifying logic
- Preserve working behavior unless fixing a bug
- Avoid over-engineering

## Priority order
1. Correct gameplay logic
2. Stability of state system
3. UI polish
4. Visual effects

## Golden rule
If unsure: keep it simpler, not more complex.
