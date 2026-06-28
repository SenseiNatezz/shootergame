// A single auto-attack projectile fired by the player.
class Projectile {
  constructor(x, y, vx, vy, damage, maxRange, pierce = 0) {
    this.x      = x;
    this.y      = y;
    this.vx     = vx;      // velocity in world units/s
    this.vy     = vy;
    this.damage = damage;
    this.radius = 7;       // collision radius
    this.active = true;

    this.pierce = pierce;  // extra enemies it can pass through after the first
    this.hitSet = new Set(); // enemies already hit (so each is hit at most once)

    this._maxRange = maxRange;
    this._traveled = 0;    // distance covered so far
  }

  update(dt) {
    const mx = this.vx * dt;
    const my = this.vy * dt;
    this.x += mx;
    this.y += my;
    this._traveled += Math.sqrt(mx * mx + my * my);

    if (this._traveled >= this._maxRange) this.active = false;
  }

  draw(ctx, camera) {
    if (!this.active) return;
    if (!camera.isVisible(this.x, this.y, 30)) return;
    const s = camera.toScreen(this.x, this.y);
    ProceduralSprites.drawProjectile(ctx, s.x, s.y);
  }
}
