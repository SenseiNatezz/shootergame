// Handles all collision checks each frame.
// Uses simple circle vs circle tests for everything.
class CollisionSystem {
  update(dt, player, enemies, projectiles) {
    this._projectilesVsEnemies(player, projectiles, enemies);
    this._enemiesVsPlayer(dt, player, enemies);
  }

  _projectilesVsEnemies(player, projectiles, enemies) {
    for (const proj of projectiles) {
      if (!proj.active) continue;

      for (const enemy of enemies) {
        if (!enemy.active) continue;
        if (proj.hitSet.has(enemy)) continue; // never hit the same enemy twice

        const dx = proj.x - enemy.x;
        const dy = proj.y - enemy.y;
        const rr = proj.radius + enemy.collisionRadius;

        if (dx * dx + dy * dy < rr * rr) {
          proj.hitSet.add(enemy);
          Combat.hit(enemy, proj.damage, player);

          if (proj.pierce > 0) {
            proj.pierce--; // pass through, keep flying
          } else {
            proj.active = false; // out of pierce — done
            break;
          }
        }
      }
    }
  }

  _enemiesVsPlayer(dt, player, enemies) {
    for (const enemy of enemies) {
      if (!enemy.active) continue;

      const dx   = enemy.x - player.x;
      const dy   = enemy.y - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < enemy.collisionRadius + player.collisionRadius) {
        // Drain player HP proportional to time (damage per second)
        player.hp = Math.max(0, player.hp - enemy.damage * dt);

        // Push enemy back so it doesn't phase through
        if (dist > 0) {
          const push = 2;
          enemy.x += (dx / dist) * push;
          enemy.y += (dy / dist) * push;
        }
      }
    }
  }
}
