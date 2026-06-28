// Loads a sprite-sheet image and draws individual frames from a uniform grid.
//
// A "uniform grid" means the sheet is divided into equal cells: `cols` across
// and `rows` down. Frame size is derived automatically once the image loads,
// so you only have to tell it how many columns and rows the sheet has.
class SpriteSheet {
  constructor(src, cols, rows) {
    this.image  = new Image();
    this.cols   = cols;
    this.rows   = rows;
    this.loaded = false;
    this.frameW = 0;
    this.frameH = 0;

    this.image.onload = () => {
      this.frameW = this.image.width  / this.cols;
      this.frameH = this.image.height / this.rows;
      this.loaded = true;
    };
    this.image.onerror = () => {
      // Stays unloaded → callers fall back to procedural drawing.
      console.warn('[SpriteSheet] could not load:', src);
    };
    this.image.src = src;
  }

  // Draw one grid cell (col, row), centered on (cx, cy), scaled to displayW x
  // displayH. flipX mirrors the frame horizontally (for left-facing movement).
  // Returns false if the image isn't ready yet, so callers can fall back.
  drawFrame(ctx, col, row, cx, cy, displayW, displayH, flipX = false) {
    if (!this.loaded) return false;

    const sx = col * this.frameW;
    const sy = row * this.frameH;

    ctx.save();
    ctx.translate(cx, cy);
    if (flipX) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = false; // keep pixel art crisp
    ctx.drawImage(
      this.image,
      sx, sy, this.frameW, this.frameH,        // source rect (one cell)
      -displayW / 2, -displayH / 2, displayW, displayH // destination rect
    );
    ctx.restore();
    return true;
  }
}

// Steps through a list of frames at a fixed frame rate.
// Call update(dt) each frame, then read `.index` to get the current frame.
class Animator {
  constructor(fps = 10) {
    this.fps   = fps;
    this.time  = 0;
    this.index = 0;
  }

  update(dt, frameCount) {
    const frameDuration = 1 / this.fps;
    this.time += dt;
    while (this.time >= frameDuration) {
      this.time  -= frameDuration;
      this.index  = (this.index + 1) % frameCount;
    }
  }

  reset() {
    this.time  = 0;
    this.index = 0;
  }
}
