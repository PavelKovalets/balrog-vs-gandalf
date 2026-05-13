# Game Spec — Gandalf vs Balrog

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
   - Cooldown: 2 turns

3. Shield
   - Blocks next incoming attack only

4. Light Blast
   - 50% chance to stun enemy (skip enemy turn)

## Enemy actions
1. Whip (10–15 damage)
2. Smash (20–30 damage, 50% hit chance)
3. Rage (increases next attack damage)

## Design goals
- Fast turn resolution
- Clear feedback for every action
- Simple but satisfying combat loop

## UX goals
- Immediate response to clicks (<1s feel delay)
- Clear battle log
- Visual feedback for hits (shake/flash optional)

