// Enemy entity. Type is one of the keys in Enemy.TYPES.
class Enemy {
  constructor(x, y, type) {
    this.x      = x;
    this.y      = y;
    this.type   = type;
    this.active = true;

    const cfg            = Enemy.TYPES[type];
    this.hp              = cfg.hp;
    this.maxHp           = cfg.hp;
    this.speed           = cfg.speed;
    this.collisionRadius = cfg.collisionRadius;
    this.damage          = cfg.damage;   // damage per second when touching the player
    this.xpValue         = cfg.xpValue;
  }

  update(dt, player) {
    // Walk straight toward the player
    const dx   = player.x - this.x;
    const dy   = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      this.x += (dx / dist) * this.speed * dt;
      this.y += (dy / dist) * this.speed * dt;
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) this.active = false;
  }

  draw(ctx, camera) {
    if (!camera.isVisible(this.x, this.y, 120)) return;
    const s = camera.toScreen(this.x, this.y);
    ProceduralSprites.drawEnemy(ctx, s.x, s.y, this.type);
  }
}

// Static config for every enemy type.
// Add new types here — no other file needs to change.
Enemy.TYPES = {
  slime: {
    hp:              45,
    speed:           70,
    collisionRadius: 24,
    damage:          8,   // HP/s removed from player
    xpValue:         2
  },
  bat: {
    hp:              18,
    speed:           155,
    collisionRadius: 18,
    damage:          5,
    xpValue:         1
  }
};
