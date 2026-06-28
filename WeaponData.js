// ───────────────────────────────────────────────────────────────────────────
// WEAPON DATA  —  the single source of truth for every weapon.
//
// Each weapon has 8 levels. `levels[i]` holds the ABSOLUTE stats at level i+1
// (not deltas), which keeps balancing readable — just edit the number you want.
// `evolution: null` is a placeholder so evolutions can be added here later.
// ───────────────────────────────────────────────────────────────────────────
const WEAPONS = {
  // 1) Arcane Bolt — single-target projectile at the nearest enemy.
  arcane_bolt: {
    name: 'Arcane Bolt',
    type: 'arcane_bolt',
    maxLevel: 8,
    evolution: null,
    levels: [
      { damage: 20, cooldown: 0.90, speed: 560, pierce: 0, range: 820 },
      { damage: 24, cooldown: 0.84, speed: 560, pierce: 0, range: 820 },
      { damage: 29, cooldown: 0.78, speed: 620, pierce: 1, range: 860 },
      { damage: 35, cooldown: 0.72, speed: 620, pierce: 1, range: 860 },
      { damage: 42, cooldown: 0.64, speed: 680, pierce: 1, range: 900 },
      { damage: 51, cooldown: 0.57, speed: 680, pierce: 2, range: 900 },
      { damage: 62, cooldown: 0.50, speed: 740, pierce: 2, range: 940 },
      { damage: 78, cooldown: 0.42, speed: 800, pierce: 3, range: 1000 }
    ]
  },

  // 2) Orbiting Blade — blades circle the player, damaging on contact.
  orbiting_blade: {
    name: 'Orbiting Blade',
    type: 'orbiting_blade',
    maxLevel: 8,
    evolution: null,
    levels: [
      { count: 1, damage: 14, orbitSpeed: 2.2, size: 16 },
      { count: 2, damage: 16, orbitSpeed: 2.2, size: 16 },
      { count: 2, damage: 20, orbitSpeed: 2.6, size: 18 },
      { count: 3, damage: 24, orbitSpeed: 2.6, size: 18 },
      { count: 3, damage: 30, orbitSpeed: 3.0, size: 20 },
      { count: 4, damage: 36, orbitSpeed: 3.0, size: 22 },
      { count: 4, damage: 44, orbitSpeed: 3.4, size: 24 },
      { count: 5, damage: 56, orbitSpeed: 3.8, size: 26 }
    ]
  },

  // 3) Holy Pulse — periodic AoE burst centered on the player.
  holy_pulse: {
    name: 'Holy Pulse',
    type: 'holy_pulse',
    maxLevel: 8,
    evolution: null,
    levels: [
      { radius: 180, damage: 26, cooldown: 3.2 },
      { radius: 200, damage: 30, cooldown: 3.0 },
      { radius: 220, damage: 36, cooldown: 2.8 },
      { radius: 250, damage: 44, cooldown: 2.6 },
      { radius: 280, damage: 54, cooldown: 2.4 },
      { radius: 310, damage: 66, cooldown: 2.2 },
      { radius: 345, damage: 80, cooldown: 2.0 },
      { radius: 390, damage: 100, cooldown: 1.8 }
    ]
  },

  // 4) Lightning Mark — strikes random on-screen enemies.
  lightning_mark: {
    name: 'Lightning Mark',
    type: 'lightning_mark',
    maxLevel: 8,
    evolution: null,
    levels: [
      { strikes: 1, damage: 40,  cooldown: 2.4 },
      { strikes: 2, damage: 44,  cooldown: 2.3 },
      { strikes: 2, damage: 52,  cooldown: 2.1 },
      { strikes: 3, damage: 60,  cooldown: 2.0 },
      { strikes: 4, damage: 72,  cooldown: 1.8 },
      { strikes: 5, damage: 86,  cooldown: 1.7 },
      { strikes: 6, damage: 104, cooldown: 1.5 },
      { strikes: 8, damage: 130, cooldown: 1.3 }
    ]
  }
};

// Display order for the HUD / upgrade pools.
const WEAPON_ORDER = ['arcane_bolt', 'orbiting_blade', 'holy_pulse', 'lightning_mark'];
