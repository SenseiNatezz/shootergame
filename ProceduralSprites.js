// All procedural sprite drawing functions.
// Every sprite is drawn in a 182x182 bounding box, centered at (cx, cy).

const ProceduralSprites = {

  // ─── Player ───────────────────────────────────────────────────────────────
  // Glowing sci-fi orb with a directional pointer and orbit accent dots.
  // angle = facing direction in radians (0 = right).
  drawPlayer(ctx, cx, cy, angle = 0, scale = 1) {
    const R = 91 * scale;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const glow = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 0.9);
    glow.addColorStop(0, 'rgba(80, 180, 255, 0.18)');
    glow.addColorStop(1, 'rgba(40, 90, 200, 0)');
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, R * 0.46, 0, Math.PI * 2);
    ctx.fillStyle = '#0d1e3a';
    ctx.fill();
    ctx.strokeStyle = '#44aaff';
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();

    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.26);
    core.addColorStop(0, '#aaddff');
    core.addColorStop(1, '#2288ee');
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.26, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo( R * 0.56,  0);
    ctx.lineTo( R * 0.38, -R * 0.18);
    ctx.lineTo( R * 0.38,  R * 0.18);
    ctx.closePath();
    ctx.fillStyle = '#88ddff';
    ctx.fill();

    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 - Math.PI / 6;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * R * 0.64, Math.sin(a) * R * 0.64, R * 0.07, 0, Math.PI * 2);
      ctx.fillStyle = '#44aaff';
      ctx.fill();
    }

    ctx.restore();
  },

  // ─── Enemies ──────────────────────────────────────────────────────────────
  // Dispatches to the correct enemy drawing function by type.
  drawEnemy(ctx, cx, cy, type) {
    if (type === 'slime') {
      this._drawSlime(ctx, cx, cy);
    } else if (type === 'bat') {
      this._drawBat(ctx, cx, cy);
    }
  },

  // Slime: round green blob with eyes, fits inside 182x182.
  _drawSlime(ctx, cx, cy) {
    const R = 36;

    ctx.save();
    ctx.translate(cx, cy);

    // Soft outer glow
    const glow = ctx.createRadialGradient(0, 6, R * 0.15, 0, 6, R * 1.5);
    glow.addColorStop(0, 'rgba(50, 200, 50, 0.22)');
    glow.addColorStop(1, 'rgba(20, 100, 20, 0)');
    ctx.beginPath();
    ctx.arc(0, 6, R * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.arc(0, 5, R, 0, Math.PI * 2);
    ctx.fillStyle = '#1e7a1e';
    ctx.fill();
    ctx.strokeStyle = '#55ee55';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Specular highlight
    ctx.beginPath();
    ctx.arc(-R * 0.28, -R * 0.15, R * 0.32, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(170, 255, 170, 0.22)';
    ctx.fill();

    // Eyes (whites)
    ctx.fillStyle = '#dfffdf';
    ctx.beginPath();
    ctx.arc(-R * 0.32, -R * 0.05, R * 0.19, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc( R * 0.32, -R * 0.05, R * 0.19, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#0a2a0a';
    ctx.beginPath();
    ctx.arc(-R * 0.30, -R * 0.03, R * 0.11, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc( R * 0.34, -R * 0.03, R * 0.11, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  // Bat: winged creature with red eyes, fits inside 182x182.
  _drawBat(ctx, cx, cy) {
    const R = 28;

    ctx.save();
    ctx.translate(cx, cy);

    // Wing glow
    const glow = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 2.8);
    glow.addColorStop(0, 'rgba(160, 80, 220, 0.20)');
    glow.addColorStop(1, 'rgba(60, 10, 100, 0)');
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 2.8, R * 1.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Left wing
    ctx.beginPath();
    ctx.moveTo(0, R * 0.1);
    ctx.quadraticCurveTo(-R * 2.1, -R * 0.9, -R * 2.2, R * 0.7);
    ctx.quadraticCurveTo(-R * 1.1, R * 0.55, 0, R * 0.3);
    ctx.closePath();
    ctx.fillStyle = '#5511aa';
    ctx.fill();
    ctx.strokeStyle = '#8833cc';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Right wing (mirrored)
    ctx.beginPath();
    ctx.moveTo(0, R * 0.1);
    ctx.quadraticCurveTo( R * 2.1, -R * 0.9,  R * 2.2, R * 0.7);
    ctx.quadraticCurveTo( R * 1.1, R * 0.55, 0, R * 0.3);
    ctx.closePath();
    ctx.fillStyle = '#5511aa';
    ctx.fill();
    ctx.strokeStyle = '#8833cc';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, R * 0.52, R * 0.72, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#220844';
    ctx.fill();
    ctx.strokeStyle = '#9944ee';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#ff3333';
    ctx.beginPath();
    ctx.arc(-R * 0.26, -R * 0.18, R * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc( R * 0.26, -R * 0.18, R * 0.16, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  },

  // ─── Orbiting Blade ───────────────────────────────────────────────────────
  drawBlade(ctx, cx, cy, size, angle) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Soft glow
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.35, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120, 220, 255, 0.22)';
    ctx.fill();

    // Blade body (sharp diamond)
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(0, size * 0.5);
    ctx.lineTo(-size, 0);
    ctx.lineTo(0, -size * 0.5);
    ctx.closePath();
    ctx.fillStyle = '#aee9ff';
    ctx.fill();
    ctx.strokeStyle = '#3aa6e0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center spark
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  },

  // ─── Projectile ───────────────────────────────────────────────────────────
  drawProjectile(ctx, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);

    // Outer glow
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
    glow.addColorStop(0, 'rgba(255, 230, 80, 0.85)');
    glow.addColorStop(1, 'rgba(255, 130, 20, 0)');
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Bright core
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fff5aa';
    ctx.fill();
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
};
