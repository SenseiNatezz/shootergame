// Transient visual effects. Each has update(dt) and draw(ctx, camera) and sets
// `dead = true` when finished. They carry no gameplay logic (damage is applied
// by the weapon that spawns them) so they're cheap and easy to add to.

// Expanding ring used by Holy Pulse.
class PulseEffect {
  constructor(x, y, maxRadius) {
    this.x = x;
    this.y = y;
    this.maxR = maxRadius;
    this.life = 0;
    this.dur  = 0.45;
    this.dead = false;
  }

  update(dt) {
    this.life += dt;
    if (this.life >= this.dur) this.dead = true;
  }

  draw(ctx, camera) {
    const t = this.life / this.dur;
    const r = this.maxR * t;
    const p = camera.toScreen(this.x, this.y);
    ctx.save();
    ctx.globalAlpha = (1 - t) * 0.85;
    ctx.strokeStyle = '#fff2a8';
    ctx.lineWidth   = 8;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = (1 - t) * 0.4;
    ctx.strokeStyle = '#ffd24d';
    ctx.lineWidth   = 18;
    ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.92, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
}

// Jagged bolt from above onto a target, used by Lightning Mark.
class BoltEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.dur  = 0.22;
    this.dead = false;
    this.points = this._generate();
  }

  _generate() {
    const pts = [];
    const top = this.y - 280;
    for (let yy = top; yy < this.y; yy += 38) {
      pts.push([this.x + (Math.random() * 44 - 22), yy]);
    }
    pts.push([this.x, this.y]);
    return pts;
  }

  update(dt) {
    this.life += dt;
    if (this.life >= this.dur) this.dead = true;
  }

  draw(ctx, camera) {
    const a = 1 - this.life / this.dur;
    ctx.save();
    ctx.globalAlpha = a;

    ctx.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const p = camera.toScreen(this.points[i][0], this.points[i][1]);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else         ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = '#7fb8ff';
    ctx.lineWidth   = 7;
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth   = 2.5;
    ctx.stroke();

    // Impact flash
    const p = camera.toScreen(this.x, this.y);
    ctx.globalAlpha = a * 0.6;
    ctx.fillStyle = '#cfe6ff';
    ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}
