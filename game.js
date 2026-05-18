(function () {
  'use strict';

  // --- Constants ---
  const GANDALF_MAX_HP = 100;
  const BALROG_MAX_HP = 120;
  const ENEMY_TURN_DELAY_MS = 700;
  const FLASH_MS = 500;

  // --- State ---
  let state;

  function initialState() {
    return {
      gandalfHP: GANDALF_MAX_HP,
      balrogHP: BALROG_MAX_HP,
      fireCooldown: 0,
      shieldActive: false,
      balrogStunned: false,
      balrogRaged: false,
      gameOver: false,
      playerTurn: true,
    };
  }

  // --- DOM refs (resolved after DOMContentLoaded) ---
  let el = {};

  function cacheDOM() {
    el = {
      turnIndicator: document.getElementById('turn-indicator'),
      gandalfHpFill: document.getElementById('gandalf-hp-fill'),
      balrogHpFill: document.getElementById('balrog-hp-fill'),
      gandalfHpText: document.getElementById('gandalf-hp-text'),
      balrogHpText: document.getElementById('balrog-hp-text'),
      gandalfPortrait: document.getElementById('gandalf-portrait'),
      balrogPortrait: document.getElementById('balrog-portrait'),
      gandalf: document.getElementById('gandalf'),
      balrog: document.getElementById('balrog'),
      btnStrike: document.getElementById('btn-strike'),
      btnFire: document.getElementById('btn-fire'),
      btnShield: document.getElementById('btn-shield'),
      btnLight: document.getElementById('btn-light'),
      btnReset: document.getElementById('btn-reset'),
      battleLog: document.getElementById('battle-log'),
    };
  }

  // --- Helpers ---
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function flash(elm, className, ms) {
    if (!elm) return;
    elm.classList.add(className);
    setTimeout(() => elm.classList.remove(className), ms);
  }

  function log(text, type) {
    if (!el.battleLog) return;
    const li = document.createElement('li');
    li.className = 'log-' + type;
    li.textContent = text;
    el.battleLog.appendChild(li);
    el.battleLog.scrollTop = el.battleLog.scrollHeight;
  }

  function renderHP() {
    const gPct = Math.max(0, (state.gandalfHP / GANDALF_MAX_HP) * 100);
    const bPct = Math.max(0, (state.balrogHP / BALROG_MAX_HP) * 100);
    if (el.gandalfHpFill) el.gandalfHpFill.style.width = gPct + '%';
    if (el.balrogHpFill) el.balrogHpFill.style.width = bPct + '%';
    if (el.gandalfHpText) {
      el.gandalfHpText.textContent = Math.max(0, state.gandalfHP) + ' / ' + GANDALF_MAX_HP;
    }
    if (el.balrogHpText) {
      el.balrogHpText.textContent = Math.max(0, state.balrogHP) + ' / ' + BALROG_MAX_HP;
    }
  }

  function renderStatusClasses() {
    if (el.gandalf) el.gandalf.classList.toggle('shielded', state.shieldActive);
    if (el.balrog) {
      el.balrog.classList.toggle('stunned', state.balrogStunned);
      el.balrog.classList.toggle('raged', state.balrogRaged);
    }
  }

  function setButtonsDisabled(disabled) {
    [el.btnStrike, el.btnFire, el.btnShield, el.btnLight].forEach((b) => {
      if (!b) return;
      b.disabled = disabled;
    });
    // Fire button respects its own cooldown when re-enabling
    if (!disabled && el.btnFire) {
      el.btnFire.disabled = state.fireCooldown > 0;
    }
  }

  function renderFireCooldown() {
    if (!el.btnFire) return;
    if (state.fireCooldown > 0) {
      el.btnFire.classList.add('cooldown');
      el.btnFire.disabled = true;
    } else {
      el.btnFire.classList.remove('cooldown');
      if (state.playerTurn && !state.gameOver) el.btnFire.disabled = false;
    }
  }

  function setTurnIndicator(text) {
    if (el.turnIndicator) el.turnIndicator.textContent = text;
  }

  // --- Audio ---
  let audioCtx = null;
  function ensureAudio() {
    if (audioCtx) return audioCtx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    } catch (e) {
      audioCtx = null;
    }
    return audioCtx;
  }
  function beep(freq, durationMs) {
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000 + 0.02);
    } catch (e) {
      // fail silently
    }
  }

  // --- Player actions ---
  function playerStrike() {
    const dmg = randInt(8, 12);
    state.balrogHP -= dmg;
    log('Gandalf strikes the Balrog for ' + dmg + ' damage.', 'player');
    flash(el.balrogPortrait, 'shake', FLASH_MS);
    flash(el.balrogPortrait, 'flash-hit', FLASH_MS);
    beep(440, 120);
    endPlayerAction();
  }

  function playerFire() {
    if (state.fireCooldown > 0) return;
    const dmg = randInt(18, 25);
    state.balrogHP -= dmg;
    state.fireCooldown = 2; // unavailable for next 2 player turns
    log('Gandalf unleashes a Fire Spell! ' + dmg + ' damage.', 'player');
    flash(el.balrogPortrait, 'shake', FLASH_MS);
    flash(el.balrogPortrait, 'flash-fire', FLASH_MS);
    beep(660, 220);
    endPlayerAction();
  }

  function playerShield() {
    state.shieldActive = true;
    log('Gandalf raises a shield of light.', 'player');
    beep(520, 160);
    endPlayerAction();
  }

  function playerLight() {
    const hit = Math.random() < 0.5;
    if (hit) {
      state.balrogStunned = true;
      log('Gandalf casts a burst of Light — the Balrog is stunned!', 'player');
    } else {
      log('Gandalf casts Light, but the Balrog shrugs it off.', 'player');
    }
    beep(880, 180);
    endPlayerAction();
  }

  function endPlayerAction() {
    renderHP();
    renderStatusClasses();

    if (state.balrogHP <= 0) {
      state.balrogHP = 0;
      renderHP();
      gameOver(true);
      return;
    }

    // Tick down fire cooldown at end of player turn (it was just used or carrying)
    if (state.fireCooldown > 0) {
      state.fireCooldown -= 1;
    }
    renderFireCooldown();

    state.playerTurn = false;
    setTurnIndicator("Balrog's turn");
    setButtonsDisabled(true);

    setTimeout(enemyTurn, ENEMY_TURN_DELAY_MS);
  }

  // --- Enemy turn ---
  function enemyTurn() {
    if (state.gameOver) return;

    if (state.balrogStunned) {
      log('The Balrog is stunned and cannot act.', 'system');
      state.balrogStunned = false;
      renderStatusClasses();
      finishEnemyTurn();
      return;
    }

    const roll = Math.random();
    if (roll < 0.55) {
      enemyWhip();
    } else if (roll < 0.80) {
      enemySmash();
    } else {
      enemyRage();
    }
  }

  function applyRageMultiplier(dmg) {
    if (state.balrogRaged) {
      dmg = Math.round(dmg * 1.5);
      state.balrogRaged = false;
      renderStatusClasses();
    }
    return dmg;
  }

  function dealToGandalf(dmg, attackName) {
    if (state.shieldActive) {
      log('Gandalf\'s shield absorbs the ' + attackName + '!', 'system');
      state.shieldActive = false;
      renderStatusClasses();
      return;
    }
    state.gandalfHP -= dmg;
    log('The Balrog\'s ' + attackName + ' hits Gandalf for ' + dmg + ' damage.', 'enemy');
    flash(el.gandalfPortrait, 'shake', FLASH_MS);
    flash(el.gandalfPortrait, 'flash-hit', FLASH_MS);
  }

  function enemyWhip() {
    let dmg = randInt(10, 15);
    dmg = applyRageMultiplier(dmg);
    beep(220, 140);
    dealToGandalf(dmg, 'whip');
    finishEnemyTurn();
  }

  function enemySmash() {
    const hit = Math.random() < 0.5;
    if (!hit) {
      // Miss does NOT consume shield, does NOT consume rage buff per spec
      // (spec: rage clears after next attack "lands or misses" — so missed smash clears rage)
      log('The Balrog smashes — but misses!', 'enemy');
      if (state.balrogRaged) {
        state.balrogRaged = false;
        renderStatusClasses();
      }
      beep(160, 200);
      finishEnemyTurn();
      return;
    }
    let dmg = randInt(20, 30);
    dmg = applyRageMultiplier(dmg);
    beep(150, 260);
    dealToGandalf(dmg, 'smash');
    finishEnemyTurn();
  }

  function enemyRage() {
    state.balrogRaged = true;
    renderStatusClasses();
    log('The Balrog roars in rage — its next attack will be devastating.', 'enemy');
    beep(110, 300);
    finishEnemyTurn();
  }

  function finishEnemyTurn() {
    renderHP();

    if (state.gandalfHP <= 0) {
      state.gandalfHP = 0;
      renderHP();
      gameOver(false);
      return;
    }

    state.playerTurn = true;
    setTurnIndicator('Your turn');
    setButtonsDisabled(false);
    renderFireCooldown();
  }

  // --- Game over / reset ---
  function gameOver(playerWon) {
    state.gameOver = true;
    state.playerTurn = false;
    setButtonsDisabled(true);
    if (playerWon) {
      log('The Balrog falls into the abyss. Gandalf prevails!', 'system');
      setTurnIndicator('Victory');
    } else {
      log('Gandalf has fallen. The Balrog reigns over the bridge.', 'system');
      setTurnIndicator('Defeat');
    }
    if (el.btnReset) el.btnReset.removeAttribute('hidden');
  }

  function resetGame() {
    state = initialState();
    if (el.battleLog) el.battleLog.innerHTML = '';
    if (el.btnFire) el.btnFire.classList.remove('cooldown');
    renderHP();
    renderStatusClasses();
    setTurnIndicator('Your turn');
    setButtonsDisabled(false);
    renderFireCooldown();
    if (el.btnReset) el.btnReset.setAttribute('hidden', '');
    log('The Balrog blocks the bridge. The duel begins.', 'system');
  }

  // --- Wiring ---
  function wireButtons() {
    function guarded(fn) {
      return function () {
        ensureAudio();
        if (state.gameOver || !state.playerTurn) return;
        fn();
      };
    }
    if (el.btnStrike) el.btnStrike.addEventListener('click', guarded(playerStrike));
    if (el.btnFire) el.btnFire.addEventListener('click', guarded(playerFire));
    if (el.btnShield) el.btnShield.addEventListener('click', guarded(playerShield));
    if (el.btnLight) el.btnLight.addEventListener('click', guarded(playerLight));
    if (el.btnReset) el.btnReset.addEventListener('click', function () {
      ensureAudio();
      resetGame();
    });
  }

  function init() {
    cacheDOM();
    state = initialState();
    wireButtons();
    renderHP();
    renderStatusClasses();
    setTurnIndicator('Your turn');
    renderFireCooldown();
    log('The Balrog blocks the bridge. The duel begins.', 'system');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
