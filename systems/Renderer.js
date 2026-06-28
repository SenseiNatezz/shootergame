// Handles background rendering and shared drawing utilities.
class Renderer {
  constructor(ctx, worldWidth, worldHeight) {
    this.ctx         = ctx;
    this.worldWidth  = worldWidth;
    this.worldHeight = worldHeight;
    this.tileSize    = 96;  // grid cell size (used only by the fallback grid)
    this.grassScale  = 2;   // how much to enlarge the grass tile when drawn

    // Tiled grass ground. Used once loaded; falls back to the grid otherwise.
    this.grass      = new Image();
    this.grassReady = false;
    this.grass.onload = () => { if (this.grass.naturalWidth > 0) this.grassReady = true; };
    this.grass.src = 'src/assets/grass.png';
  }

  drawBackground(camera) {
    if (this.grassReady) this._drawGrass(camera);
    else                 this._drawGrid(camera);

    // World border — lets the player see the edge of the arena
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(30, 60, 20, 0.55)';
    ctx.lineWidth   = 6;
    ctx.strokeRect(-camera.x, -camera.y, this.worldWidth, this.worldHeight);
  }

  // Tile the grass image across the screen, scrolling with the camera.
  _drawGrass(camera) {
    const ctx = this.ctx;
    const tw  = this.grass.naturalWidth  * this.grassScale;
    const th  = this.grass.naturalHeight * this.grassScale;

    // Base fill (matches the grass so any sub-pixel gaps are invisible)
    ctx.fillStyle = '#7c9a4e';
    ctx.fillRect(0, 0, 1920, 1080);

    // Offset the first tile by the camera position wrapped into [-tw, 0]
    const startX = -(((camera.x * this.grassScale) % tw) + tw) % tw;
    const startY = -(((camera.y * this.grassScale) % th) + th) % th;

    ctx.imageSmoothingEnabled = false;
    for (let y = startY; y < 1080; y += th) {
      for (let x = startX; x < 1920; x += tw) {
        ctx.drawImage(this.grass, x, y, tw, th);
      }
    }
  }

  // Fallback: the original dark scrolling grid.
  _drawGrid(camera) {
    const ctx      = this.ctx;
    const tileSize = this.tileSize;

    ctx.fillStyle = '#080c18';
    ctx.fillRect(0, 0, 1920, 1080);

    const startX = Math.floor(camera.x / tileSize) * tileSize;
    const startY = Math.floor(camera.y / tileSize) * tileSize;
    const endX   = camera.x + 1920 + tileSize;
    const endY   = camera.y + 1080 + tileSize;

    ctx.strokeStyle = 'rgba(50, 70, 130, 0.25)';
    ctx.lineWidth   = 1;

    for (let wx = startX; wx < endX; wx += tileSize) {
      const sx = wx - camera.x;
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, 1080); ctx.stroke();
    }
    for (let wy = startY; wy < endY; wy += tileSize) {
      const sy = wy - camera.y;
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(1920, sy); ctx.stroke();
    }
  }
}
