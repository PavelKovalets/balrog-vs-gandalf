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

## Gameplay rules
See `SPEC.md` — it is the single source of truth for game design (stats, abilities, AI behavior, edge cases). Do not restate rules here; if a rule changes, update `SPEC.md`.

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
