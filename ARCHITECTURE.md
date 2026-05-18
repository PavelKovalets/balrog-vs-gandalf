# Architecture — Gandalf vs Balrog

How the game described in `SPEC.md` is realized in code. Vanilla HTML/CSS/JS — no frameworks, no build tools.

## Files
- `index.html` — DOM structure
- `style.css` — Moria-themed visuals, HP bar transitions, animations, responsive layout
- `game.js` — state, turn flow, abilities, enemy AI, audio, reset

## Turn flow timing
- Player click resolves immediately
- Enemy turn fires ~700ms after the player's action (for readability)
- All action buttons are `disabled` during the enemy's turn and re-enabled afterward; Fire Spell respects its own cooldown when re-enabled

## State
A single `state` object in `game.js`:
- `gandalfHP`, `balrogHP` — integers
- `fireCooldown` — integer counter, decremented at the end of each player turn
- `shieldActive`, `balrogStunned`, `balrogRaged` — booleans
- `gameOver`, `playerTurn` — booleans

## DOM contract
`game.js` reads and updates these elements defined in `index.html`. Keep IDs stable — JS, CSS, and HTML all rely on them.

- `#turn-indicator` — text updated to show whose turn it is
- `#gandalf-hp-fill`, `#balrog-hp-fill` — `style.width` set to `<percent>%`
- `#gandalf-hp-text`, `#balrog-hp-text` — `<current> / <max>` text
- `#gandalf-portrait`, `#balrog-portrait` — receive transient animation classes
- `#gandalf`, `#balrog` — combatant containers; receive persistent state classes
- `#btn-strike`, `#btn-fire`, `#btn-shield`, `#btn-light` — action buttons; `disabled` toggled by JS
- `#battle-log` — `<li>` entries appended with class `log-player`, `log-enemy`, or `log-system`
- `#btn-reset` — `hidden` attribute removed on game over; click handler resets state

## CSS class hooks
JS toggles these classes; CSS defines the visuals.

Transient (added briefly via `setTimeout`, ~400–600ms):
- `.shake` — portrait shake on hit
- `.flash-hit` — red flash for normal damage
- `.flash-fire` — orange/yellow pulse when Fire Spell hits

Persistent (added when state begins, removed when it ends):
- `.shielded` — cyan shimmer on `#gandalf` while Shield is active
- `.stunned` — dimmed + spinning 💫 on `#balrog` while stunned
- `.raged` — red glow on `#balrog` while the Rage buff is queued
- `.cooldown` — darker tint on `#btn-fire` while cooling down (combined with `:disabled`)

## Battle log
- Color-coded entries: gold/blue for player actions, ember red for enemy, muted gray italic for system messages
- Scrolls to the latest entry on append
- Cleared on reset

## Audio
- Short tones via the Web Audio API — no external audio assets
- `AudioContext` is initialized lazily on the first user click (browser autoplay policy)
- Each action uses a distinct frequency (e.g. Strike 440 Hz, Fire 660 Hz, Light 880 Hz, Whip 220 Hz, Smash 150 Hz)
- Fails silently if `AudioContext` is unavailable

## Reset flow
The "New Battle" button:
- Clears `#battle-log`
- Restores starting HP and resets all state flags
- Removes the `.cooldown` class from `#btn-fire`
- Hides itself (re-applies the `hidden` attribute)
- Logs the opening system line again
