# Game Spec — Gandalf vs Balrog

Game design only. For how the design is realized in code (files, DOM contract, animations, audio), see `ARCHITECTURE.md`.

## Overview
Turn-based duel between Gandalf and Balrog on the Bridge of Khazad-dûm.

## Win/Lose Conditions
- Win: Opponent HP <= 0
- Lose: Player HP <= 0

## Starting stats
- Gandalf HP: 100
- Balrog HP: 120

## Turn system
- Player acts first
- Then enemy acts
- Repeat until game ends

## Player actions
1. Strike
   - Damage: 8–12

2. Fire Spell
   - Damage: 18–25
   - Cooldown: 2 turns (unavailable on the two player turns after use; available again on the 3rd turn)

3. Shield
   - Blocks the next incoming Balrog attack (damage reduced to 0)
   - Consumed only when an attack actually lands
   - A missed Smash does NOT consume the shield
   - A Rage turn does NOT consume the shield (no attack lands)

4. Light
   - 50% chance to stun the enemy (skip Balrog's next turn)

## Enemy actions
Balrog AI picks a weighted-random action each turn:

1. Whip (55%) — 10–15 damage, always hits
2. Smash (25%) — 20–30 damage, 50% hit chance
3. Rage (20%) — no damage this turn; the next attack's damage is multiplied by 1.5 (rounded)

### Rage interactions
- The rage buff is consumed by the next attack whether it lands OR misses
- A missed Smash still clears the rage buff

### Stun interactions
- If Balrog is stunned, its turn is skipped entirely and the stun clears afterward

## Game over
- Player is told the outcome
- Player can start a new battle to reset all state

## Design goals
- Fast turn resolution
- Clear feedback for every action
- Simple but satisfying combat loop
- Immediate response to clicks (sub-second feel)
