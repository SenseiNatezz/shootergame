// Orbiting Blade — one or more blades rotate around the player and damage any
// enemy they touch. A short per-enemy cooldown stops a blade from deleting an
// enemy in a single frame (it deals repeated hits over time instead).
class OrbitingBlade extends Weapon {
  constructor(id) {
    super(id);
    this.angle = 0;          // current rotation
    this.orbitRadius = 150;  // distance of blades from the player
    this.hitInterval = 0.35; // seconds an enemy is immune after a blade hit
  }

  update(dt, ctx) {
    const s = this.stats;
    this.angle += s.orbitSpeed * dt;

    const px = ctx.player.x;
    const py = ctx.player.y;
    const R  = this.orbitRadius;

    // Tick down this weapon's per-enemy hit cooldown
    for (const e of ctx.enemies) {
      if (e._bladeCd > 0) e._bladeCd -= dt;
    }

    // Check every blade against every enemy
    for (let i = 0; i < s.count; i++) {
      const a  = this.angle + (i / s.count) * Math.PI * 2;
      const bx = px + Math.cos(a) * R;
      const by = py + Math.sin(a) * R;

      for (const e of ctx.enemies) {
        if (!e.active || e._bladeCd > 0) continue;
        const dx = e.x - bx;
        const dy = e.y - by;
        const rr = s.size + e.collisionRadius;
        if (dx * dx + dy * dy < rr * rr) {
          Combat.hit(e, s.damage, ctx.player);
          e._bladeCd = this.hitInterval;
        }
      }
    }
  }

  draw(ctx, camera, player) {
    const s = this.stats;
    const R = this.orbitRadius;
    for (let i = 0; i < s.count; i++) {
      const a  = this.angle + (i / s.count) * Math.PI * 2;
      const wx = player.x + Math.cos(a) * R;
      const wy = player.y + Math.sin(a) * R;
      const p  = camera.toScreen(wx, wy);
      ProceduralSprites.drawBlade(ctx, p.x, p.y, s.size, this.angle * 3);
    }
  }
}
