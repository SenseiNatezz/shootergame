// Arcane Bolt — fires a piercing projectile at the nearest enemy on cooldown.
class ArcaneBolt extends Weapon {
  update(dt, ctx) {
    const s = this.stats;
    this.timer += dt;
    if (this.timer < s.cooldown) return;

    const target = Combat.nearestEnemy(ctx.player.x, ctx.player.y, ctx.enemies);
    if (!target) return; // hold fire until an enemy exists

    this.timer = 0;
    const dx = target.x - ctx.player.x;
    const dy = target.y - ctx.player.y;
    const d  = Math.hypot(dx, dy) || 1;
    const vx = (dx / d) * s.speed;
    const vy = (dy / d) * s.speed;

    ctx.projectiles.push(
      new Projectile(ctx.player.x, ctx.player.y, vx, vy, s.damage, s.range, s.pierce)
    );
  }
}
