// Lightning Mark — strikes a number of random ON-SCREEN enemies on cooldown.
// Each strike applies damage instantly and spawns a brief bolt visual.
class LightningMark extends Weapon {
  update(dt, ctx) {
    const s = this.stats;
    this.timer += dt;
    if (this.timer < s.cooldown) return;

    // Only target enemies the player can actually see
    const onScreen = [];
    for (const e of ctx.enemies) {
      if (e.active && ctx.camera.isVisible(e.x, e.y, 0)) onScreen.push(e);
    }
    if (onScreen.length === 0) return; // wait for a visible target

    this.timer = 0;
    const n = Math.min(s.strikes, onScreen.length);
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * onScreen.length);
      const e   = onScreen.splice(idx, 1)[0]; // pick distinct targets
      Combat.hit(e, s.damage, ctx.player);
      ctx.effects.push(new BoltEffect(e.x, e.y));
    }
  }
}
