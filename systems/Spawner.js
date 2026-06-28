// Spawns enemies in waves around the edges of the visible camera area.
class Spawner {
  constructor() {
    this._timer    = 0;
    this._interval = 2.0; // seconds between waves
    this._count    = 3;   // enemies per wave
  }

  update(dt, player, enemies, camera) {
    this._timer += dt;
    if (this._timer < this._interval) return;
    this._timer = 0;

    for (let i = 0; i < this._count; i++) {
      const pos  = this._edgePosition(camera);
      const type = Math.random() < 0.65 ? 'slime' : 'bat';
      enemies.push(new Enemy(pos.x, pos.y, type));
    }
  }

  // Returns a world-space point just outside one of the four camera edges.
  _edgePosition(camera) {
    const margin = 140;
    const side   = Math.floor(Math.random() * 4);

    switch (side) {
      case 0: return { // top
        x: camera.x + Math.random() * camera.viewWidth,
        y: camera.y - margin
      };
      case 1: return { // right
        x: camera.x + camera.viewWidth + margin,
        y: camera.y + Math.random() * camera.viewHeight
      };
      case 2: return { // bottom
        x: camera.x + Math.random() * camera.viewWidth,
        y: camera.y + camera.viewHeight + margin
      };
      default: return { // left
        x: camera.x - margin,
        y: camera.y + Math.random() * camera.viewHeight
      };
    }
  }
}
