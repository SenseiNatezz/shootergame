// Shared damage helper so every weapon counts kills the same way.
const Combat = {
  // Apply `amount` damage to an enemy. Returns true if it died from this hit.
  hit(enemy, amount, player) {
    if (!enemy.active) return false;
    enemy.takeDamage(amount);
    if (!enemy.active) {
      player.kills++;
      return true;
    }
    return false;
  },

  // Nearest active enemy to a point, or null. Uses squared distance (no sqrt).
  nearestEnemy(x, y, enemies) {
    let best = null;
    let bestSq = Infinity;
    for (const e of enemies) {
      if (!e.active) continue;
      const dx = e.x - x;
      const dy = e.y - y;
      const sq = dx * dx + dy * dy;
      if (sq < bestSq) { bestSq = sq; best = e; }
    }
    return best;
  }
};
