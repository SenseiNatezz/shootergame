// Holy Pulse — every few seconds, damages all enemies within a radius of the
// player and spawns an expanding ring visual. Damage is applied once per pulse
// (cheap: a single pass over enemies on trigger, not every frame).
class HolyPulse extends Weapon {
  update(dt, ctx) {
    const s = this.stats;
    this.timer += dt;
    if (this.timer < s.cooldown) return;
    this.timer = 0;

    const p  = ctx.player;
    const r2 = s.radius * s.radius;
    for (const e of ctx.enemies) {
      if (!e.active) continue;
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      if (dx * dx + dy * dy <= r2) {
        Combat.hit(e, s.damage, p);
      }
    }

    ctx.effects.push(new PulseEffect(p.x, p.y, s.radius));
  }
}
