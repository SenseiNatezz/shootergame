// Renders all in-game HUD elements directly onto the canvas.
class UISystem {
  constructor(ctx) {
    this.ctx = ctx;

    // FPS tracking
    this._frameCount  = 0;
    this._fpsTimer    = 0;
    this._displayFps  = 0;
  }

  // Call once per frame before draw() so FPS stays accurate.
  updateFps(dt) {
    this._frameCount++;
    this._fpsTimer += dt;
    if (this._fpsTimer >= 0.5) {
      this._displayFps = Math.round(this._frameCount / this._fpsTimer);
      this._frameCount = 0;
      this._fpsTimer   = 0;
    }
  }

  draw(player, elapsedTime, weaponSystem) {
    const ctx = this.ctx;
    ctx.save();

    if (weaponSystem) this._drawWeapons(weaponSystem.weapons);

    // --- Game title (top center, subtle) ---
    ctx.font      = 'bold 32px monospace';
    ctx.fillStyle = 'rgba(100, 200, 255, 0.35)';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('ASTRAL SIEGE', 960, 18);

    // --- Elapsed timer (below title) ---
    const mm = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const ss = Math.floor(elapsedTime % 60).toString().padStart(2, '0');
    ctx.font      = 'bold 26px monospace';
    ctx.fillStyle = '#ccddff';
    ctx.textAlign = 'center';
    ctx.fillText(`${mm}:${ss}`, 960, 56);

    // --- HP bar (top left) ---
    this._drawBar(ctx, 20, 20, 280, 24, player.hp / player.maxHp, '#dd3333', '#2a0808', `HP  ${player.hp}/${player.maxHp}`);

    // --- XP bar (below HP bar) ---
    this._drawBar(ctx, 20, 52, 280, 16, player.xp / player.xpToNext, '#44aaff', '#051830', `LVL ${player.level}`);

    // --- Kill count (top right) ---
    ctx.font         = '22px monospace';
    ctx.fillStyle    = '#aaccff';
    ctx.textAlign    = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`Kills: ${player.kills}`, 1900, 20);

    // --- FPS (top right, below kills) ---
    ctx.font      = '18px monospace';
    ctx.fillStyle = '#556677';
    ctx.fillText(`FPS: ${this._displayFps}`, 1900, 48);

    // --- Player world position (top right, below FPS) ---
    ctx.font      = '16px monospace';
    ctx.fillStyle = '#445566';
    ctx.fillText(`${Math.round(player.x)}, ${Math.round(player.y)}`, 1900, 72);

    ctx.restore();
  }

  // Owned weapons + their levels, as icon slots along the bottom-left.
  _drawWeapons(weapons) {
    const ctx = this.ctx;
    const size = 78, gap = 12;
    let x = 24;
    const y = 1080 - size - 22;

    for (const w of weapons) {
      const maxed = w.isMax();

      // Slot background + frame
      ctx.fillStyle = 'rgba(8, 14, 30, 0.72)';
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = maxed ? '#ffd24d' : 'rgba(120, 160, 220, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, size, size);

      // Icon
      this._weaponIcon(w.id, x + size / 2, y + size / 2 - 8);

      // Level label
      PixelText.draw(ctx, maxed ? 'MAX' : ('Lv' + w.level), x + size / 2, y + size - 13, {
        scale: 2, baseSize: 14, align: 'center', valign: 'middle',
        color: maxed ? '#ffe08a' : '#cfe0ff', outline: '#06101f'
      });

      x += size + gap;
    }
  }

  // Small distinct glyph per weapon type.
  _weaponIcon(id, cx, cy) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    if (id === 'arcane_bolt') {
      ctx.fillStyle = '#7fd8ff';
      ctx.beginPath();
      ctx.moveTo(0, -16); ctx.lineTo(5, -3); ctx.lineTo(16, 0);
      ctx.lineTo(5, 3); ctx.lineTo(0, 16); ctx.lineTo(-5, 3);
      ctx.lineTo(-16, 0); ctx.lineTo(-5, -3); ctx.closePath();
      ctx.fill();
    } else if (id === 'orbiting_blade') {
      ctx.strokeStyle = '#aee9ff'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(14, 0, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(-14, 0, 4, 0, Math.PI * 2); ctx.fill();
    } else if (id === 'holy_pulse') {
      ctx.strokeStyle = '#ffd24d'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff2a8';
      ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
    } else if (id === 'lightning_mark') {
      ctx.strokeStyle = '#9fc8ff'; ctx.lineWidth = 4; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(4, -16); ctx.lineTo(-6, -2); ctx.lineTo(2, -2);
      ctx.lineTo(-4, 16); ctx.lineTo(10, -4); ctx.lineTo(2, -4); ctx.closePath();
      ctx.fillStyle = '#cfe6ff'; ctx.fill(); ctx.stroke();
    }

    ctx.restore();
  }

  // Draws a labeled progress bar.
  _drawBar(ctx, x, y, w, h, fraction, fillColor, bgColor, label) {
    fraction = Math.max(0, Math.min(1, fraction));

    // Background track
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, w, h);

    // Filled portion
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, w * fraction, h);

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth   = 1;
    ctx.strokeRect(x, y, w, h);

    // Label centered inside the bar
    const fontSize = Math.max(10, h - 5);
    ctx.font         = `bold ${fontSize}px monospace`;
    ctx.fillStyle    = '#ffffff';
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + 6, y + h / 2);
  }
}
