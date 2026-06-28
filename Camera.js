class Camera {
  constructor(worldWidth, worldHeight) {
    this.worldWidth  = worldWidth;
    this.worldHeight = worldHeight;

    // Canvas resolution this camera renders into
    this.viewWidth  = 1920;
    this.viewHeight = 1080;

    // Top-left world position of the visible area
    this.x = 0;
    this.y = 0;

    // Internal base position (before shake offset is applied)
    this._baseX = 0;
    this._baseY = 0;

    this._shakeIntensity = 0;
    this._shakeDuration  = 0;
  }

  // Point the camera so that (targetX, targetY) is centered on screen.
  follow(targetX, targetY) {
    this._baseX = targetX - this.viewWidth  / 2;
    this._baseY = targetY - this.viewHeight / 2;

    // Clamp so the camera never shows outside the world
    this._baseX = MathUtils.clamp(this._baseX, 0, this.worldWidth  - this.viewWidth);
    this._baseY = MathUtils.clamp(this._baseY, 0, this.worldHeight - this.viewHeight);

    this.x = this._baseX;
    this.y = this._baseY;
  }

  // Apply screen shake (call after follow).
  update(dt) {
    if (this._shakeDuration > 0) {
      this._shakeDuration -= dt;
      this.x = this._baseX + MathUtils.randomRange(-this._shakeIntensity, this._shakeIntensity);
      this.y = this._baseY + MathUtils.randomRange(-this._shakeIntensity, this._shakeIntensity);
    } else {
      this.x = this._baseX;
      this.y = this._baseY;
    }
  }

  shake(intensity, duration) {
    this._shakeIntensity = intensity;
    this._shakeDuration  = duration;
  }

  // Convert world coordinates to canvas (screen) coordinates.
  toScreen(worldX, worldY) {
    return {
      x: worldX - this.x,
      y: worldY - this.y
    };
  }

  // Convert canvas coordinates back to world coordinates.
  toWorld(screenX, screenY) {
    return {
      x: screenX + this.x,
      y: screenY + this.y
    };
  }

  // Returns true if a world-space point is within the visible area (plus a margin).
  isVisible(worldX, worldY, margin = 64) {
    return (
      worldX + margin > this.x &&
      worldX - margin < this.x + this.viewWidth &&
      worldY + margin > this.y &&
      worldY - margin < this.y + this.viewHeight
    );
  }
}
