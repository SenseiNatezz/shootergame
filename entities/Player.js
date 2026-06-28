// ───────────────────────────────────────────────────────────────────────────
// PLAYER SPRITE CONFIG  —  edit this block to match your saved sprite sheet.
//
// Your sheet is an 8 x 8 grid (512 x 512 px → 64 x 64 per frame). It is a true
// directional sheet, so each facing direction gets its own ROW. If a direction
// ends up looking wrong in game, just swap the row numbers in `dirRow` below —
// that's the only edit needed. If `src` is missing, the player falls back to a
// procedural sprite so the game still runs.
// ───────────────────────────────────────────────────────────────────────────
const PLAYER_SPRITE = {
  src:  'src/assets/player.png',
  cols: 8,   // frame columns in the sheet
  rows: 8,   // frame rows in the sheet

  // Row index used for walking in each direction. (Tune these four if a
  // direction looks wrong — the sheet is 8-directional, ordered clockwise
  // E,SE,S,SW,W,NW,N,NE → cardinals land on rows 0,2,4,6.)
  dirRow: {
    down:  2,   // South — faces the viewer
    up:    6,   // North — walks away
    left:  4,   // West
    right: 0    // East
  },

  // Columns cycled through for the walk animation, and the idle column.
  walkFrames: [0, 1, 2, 3, 4, 5, 6, 7],
  idleFrame:  0,

  fps:       12,   // animation speed
  displayW: 160,   // on-screen size (64px source frames scale up to this)
  displayH: 160
};

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // Sprite occupies a 182x182 nominal bounding box
    this.spriteSize      = 182;
    // Collision circle is much smaller than the sprite for fairness
    this.collisionRadius = 18;

    // Movement
    this.speed  = 220;      // world units per second
    this.angle  = 0;        // radians (used only by the procedural fallback)
    this.facing = 'down';   // 'down' | 'up' | 'left' | 'right'
    this.moving = false;

    // Animation
    this.sheet    = new SpriteSheet(PLAYER_SPRITE.src, PLAYER_SPRITE.cols, PLAYER_SPRITE.rows);
    this.animator = new Animator(PLAYER_SPRITE.fps);

    // Stats
    this.hp       = 100;
    this.maxHp    = 100;
    this.level    = 1;
    this.xp       = 0;
    this.xpToNext = 10;
    this.kills    = 0;
  }

  update(dt, input, worldWidth, worldHeight) {
    const move = input.getMovement();

    this.x += move.x * this.speed * dt;
    this.y += move.y * this.speed * dt;

    // Keep the full sprite inside the world
    const half = this.spriteSize / 2;
    this.x = MathUtils.clamp(this.x, half, worldWidth  - half);
    this.y = MathUtils.clamp(this.y, half, worldHeight - half);

    this.moving = (move.x !== 0 || move.y !== 0);

    if (this.moving) {
      this.angle = Math.atan2(move.y, move.x); // for fallback orb

      // Choose facing from the dominant axis of movement
      if (Math.abs(move.x) > Math.abs(move.y)) {
        this.facing = move.x < 0 ? 'left' : 'right';
      } else {
        this.facing = move.y < 0 ? 'up' : 'down';
      }

      this.animator.update(dt, PLAYER_SPRITE.walkFrames.length);
    } else {
      this.animator.reset();
    }
  }

  draw(ctx, camera) {
    const s = camera.toScreen(this.x, this.y);

    const row = PLAYER_SPRITE.dirRow[this.facing];
    const col = this.moving
      ? PLAYER_SPRITE.walkFrames[this.animator.index]
      : PLAYER_SPRITE.idleFrame;

    // Try the sprite sheet; if it isn't loaded, fall back to the procedural orb
    const drawn = this.sheet.drawFrame(
      ctx, col, row, s.x, s.y,
      PLAYER_SPRITE.displayW, PLAYER_SPRITE.displayH
    );

    if (!drawn) {
      ProceduralSprites.drawPlayer(ctx, s.x, s.y, this.angle);
    }
  }
}
