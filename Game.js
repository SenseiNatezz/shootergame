// Internal canvas resolution — all game logic runs in this space.
const CANVAS_W = 1920;
const CANVAS_H = 1080;

// World is 3× the canvas in each dimension.
const WORLD_W = 5760;
const WORLD_H = 3240;

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    // Fix internal resolution; CSS handles visual scaling.
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;

    // Core
    this.input  = new Input(canvas);
    this.camera = new Camera(WORLD_W, WORLD_H);

    // Systems
    this.renderer        = new Renderer(this.ctx, WORLD_W, WORLD_H);
    this.ui              = new UISystem(this.ctx);
    this.spawner         = new Spawner();
    this.collisionSystem = new CollisionSystem();
    this.weaponSystem    = new WeaponSystem();

    // UI / screens
    this.menu = new Menu(() => this.startGame());

    // Game state: 'menu' | 'playing'
    this.state     = 'menu';
    this._lastTime = null;
    this._running  = false;

    this._initWorld();

    window.addEventListener('resize', () => this._resize());
    this._resize();
  }

  // Create (or reset) all gameplay entities to their starting state.
  _initWorld() {
    this.player      = new Player(WORLD_W / 2, WORLD_H / 2);
    this.enemies     = [];
    this.projectiles = [];
    this.gems        = [];
    this.effects     = []; // transient weapon visuals (pulses, bolts)
    this.spawner     = new Spawner();
    this.weaponSystem = new WeaponSystem();
    this.elapsedTime = 0;
  }

  // Called by the menu's START button.
  startGame() {
    this._initWorld();
    this.state = 'playing';
  }

  // Scale the canvas CSS size to fill the window while keeping 16:9.
  _resize() {
    const scaleX = window.innerWidth  / CANVAS_W;
    const scaleY = window.innerHeight / CANVAS_H;
    const scale  = Math.min(scaleX, scaleY);

    this.canvas.style.width  = Math.floor(CANVAS_W * scale) + 'px';
    this.canvas.style.height = Math.floor(CANVAS_H * scale) + 'px';
  }

  start() {
    this._running = true;
    requestAnimationFrame((t) => this._loop(t));
  }

  _loop(timestamp) {
    if (!this._running) return;

    // Delta time in seconds; capped to 50 ms to prevent a "spiral of death"
    // if the tab loses focus and then regains it.
    const dt = this._lastTime === null
      ? 0
      : Math.min((timestamp - this._lastTime) / 1000, 0.05);
    this._lastTime = timestamp;

    this._update(dt);
    this._draw();
    this.input.flush(); // clear single-frame key state

    requestAnimationFrame((t) => this._loop(t));
  }

  _update(dt) {
    this.ui.updateFps(dt);

    if (this.state === 'menu') {
      this.menu.update(dt, this.input);
      return;
    }

    this.elapsedTime += dt;

    this.player.update(dt, this.input, WORLD_W, WORLD_H);
    this.camera.follow(this.player.x, this.player.y);
    this.camera.update(dt);

    // Dev shortcuts: grant/upgrade weapons for testing (until the level-up
    // screen is built). Keys 1–4; key 0 grants/levels all four.
    if (this.input.isPressed('Digit1')) this.weaponSystem.grantOrUpgrade('arcane_bolt');
    if (this.input.isPressed('Digit2')) this.weaponSystem.grantOrUpgrade('orbiting_blade');
    if (this.input.isPressed('Digit3')) this.weaponSystem.grantOrUpgrade('holy_pulse');
    if (this.input.isPressed('Digit4')) this.weaponSystem.grantOrUpgrade('lightning_mark');
    if (this.input.isPressed('Digit0')) {
      for (const id of WEAPON_ORDER) this.weaponSystem.grantOrUpgrade(id);
    }

    this.spawner.update(dt, this.player, this.enemies, this.camera);

    for (const enemy of this.enemies)     enemy.update(dt, this.player);
    for (const proj  of this.projectiles) proj.update(dt);

    const ctx = {
      player:      this.player,
      enemies:     this.enemies,
      projectiles: this.projectiles,
      effects:     this.effects,
      camera:      this.camera
    };
    this.weaponSystem.update(dt, ctx);
    this.collisionSystem.update(dt, this.player, this.enemies, this.projectiles);

    for (const e of this.effects) e.update(dt);

    // Remove inactive entities so arrays don't grow forever
    this.enemies     = this.enemies.filter(e => e.active);
    this.projectiles = this.projectiles.filter(p => p.active);
    this.effects     = this.effects.filter(e => !e.dead);
  }

  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    if (this.state === 'menu') {
      this.menu.draw(ctx, CANVAS_W, CANVAS_H);
      return;
    }

    this.renderer.drawBackground(this.camera);

    // Draw order: enemies → projectiles → effects → orbiting weapons → player → HUD
    for (const enemy of this.enemies)         enemy.draw(ctx, this.camera);
    for (const proj  of this.projectiles)     proj.draw(ctx, this.camera);
    for (const fx    of this.effects)         fx.draw(ctx, this.camera);
    this.weaponSystem.draw(ctx, this.camera, this.player);
    this.player.draw(ctx, this.camera);

    // HUD is always rendered last so it sits on top of everything
    this.ui.draw(this.player, this.elapsedTime, this.weaponSystem);
  }
}
