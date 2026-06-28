// Base class for every weapon. Reads its stats from the WEAPONS data table by
// id, tracks its own level (1..maxLevel) and cooldown timer. Subclasses only
// implement update() (firing/behavior) and optionally draw() (persistent art).
class Weapon {
  constructor(id) {
    this.id    = id;
    this.def   = WEAPONS[id];
    this.level = 1;
    this.timer = 0; // counts up toward the current cooldown
  }

  // Stats for the current level.
  get stats()    { return this.def.levels[this.level - 1]; }
  get name()     { return this.def.name; }
  get maxLevel() { return this.def.maxLevel; }

  isMax()   { return this.level >= this.maxLevel; }
  levelUp() { if (!this.isMax()) this.level++; }

  // ctx = { player, enemies, projectiles, effects, camera }
  update(_dt, _ctx) {}

  // Persistent visuals (e.g. orbiting blades). Transient FX use the effects list.
  draw(_ctx, _camera, _player) {}
}
