// Maps a weapon id/type to its class. Defined here because it must run after
// the weapon classes are loaded.
const WEAPON_CLASSES = {
  arcane_bolt:    ArcaneBolt,
  orbiting_blade: OrbitingBlade,
  holy_pulse:     HolyPulse,
  lightning_mark: LightningMark
};

function createWeapon(id) {
  const Cls = WEAPON_CLASSES[id];
  return Cls ? new Cls(id) : null;
}

// Owns all of the player's weapons. The player starts with Arcane Bolt.
class WeaponSystem {
  constructor() {
    this.weapons = [];
    this.add('arcane_bolt');
  }

  add(id) {
    if (this.has(id)) return this.get(id);
    const w = createWeapon(id);
    if (w) this.weapons.push(w);
    return w;
  }

  has(id) { return this.weapons.some(w => w.id === id); }
  get(id) { return this.weapons.find(w => w.id === id); }

  // Give a new weapon, or level up an existing one.
  grantOrUpgrade(id) {
    const w = this.get(id);
    if (w) w.levelUp();
    else   this.add(id);
  }

  update(dt, ctx) {
    for (const w of this.weapons) w.update(dt, ctx);
  }

  // Persistent weapon visuals (orbiting blades, etc).
  draw(ctx, camera, player) {
    for (const w of this.weapons) w.draw(ctx, camera, player);
  }

  // Build a pool of level-up options: an upgrade for each owned, non-max weapon,
  // plus a "new weapon" entry for each unowned weapon. Returns up to `count`
  // randomized choices. (Ready for the level-up screen; not wired to XP yet.)
  getUpgradeChoices(count = 3) {
    const pool = [];

    for (const w of this.weapons) {
      if (!w.isMax()) {
        pool.push({
          kind: 'upgrade',
          id: w.id,
          name: w.name,
          level: w.level + 1,
          description: `Upgrade to level ${w.level + 1}`,
          apply: () => w.levelUp()
        });
      }
    }

    for (const id of WEAPON_ORDER) {
      if (!this.has(id)) {
        pool.push({
          kind: 'new',
          id,
          name: WEAPONS[id].name,
          level: 1,
          description: 'New weapon',
          apply: () => this.add(id)
        });
      }
    }

    // Fisher–Yates shuffle, then take the first `count`
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
  }
}
