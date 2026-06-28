class Input {
  constructor(canvas) {
    this._keys = new Set();
    this._justPressed = new Set();
    this._justReleased = new Set();

    // Mouse (in canvas-internal 1920x1080 coordinates)
    this._canvas    = canvas;
    this.mouseX     = 0;
    this.mouseY     = 0;
    this._mouseDown = false;
    this._clicked   = false; // true only on the frame the button went down

    window.addEventListener('keydown', (e) => this._onKeyDown(e));
    window.addEventListener('keyup',   (e) => this._onKeyUp(e));

    if (canvas) {
      canvas.addEventListener('mousemove', (e) => this._updateMouse(e));
      canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) { this._updateMouse(e); this._clicked = true; this._mouseDown = true; }
      });
      window.addEventListener('mouseup', (e) => {
        if (e.button === 0) this._mouseDown = false;
      });
    }
  }

  // Map a DOM mouse event to internal canvas coordinates (accounts for CSS scaling).
  _updateMouse(e) {
    const rect = this._canvas.getBoundingClientRect();
    const scaleX = this._canvas.width  / rect.width;
    const scaleY = this._canvas.height / rect.height;
    this.mouseX = (e.clientX - rect.left) * scaleX;
    this.mouseY = (e.clientY - rect.top)  * scaleY;
  }

  getMouse() { return { x: this.mouseX, y: this.mouseY }; }
  isClicked() { return this._clicked; }
  isMouseDown() { return this._mouseDown; }

  _onKeyDown(e) {
    if (!this._keys.has(e.code)) {
      this._justPressed.add(e.code);
    }
    this._keys.add(e.code);

    // Prevent browser scroll on game keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
  }

  _onKeyUp(e) {
    this._keys.delete(e.code);
    this._justReleased.add(e.code);
  }

  isDown(code) {
    return this._keys.has(code);
  }

  isPressed(code) {
    return this._justPressed.has(code);
  }

  isReleased(code) {
    return this._justReleased.has(code);
  }

  // Returns a normalized movement vector from WASD / arrow keys.
  getMovement() {
    let x = 0;
    let y = 0;

    if (this.isDown('KeyW') || this.isDown('ArrowUp'))    y -= 1;
    if (this.isDown('KeyS') || this.isDown('ArrowDown'))  y += 1;
    if (this.isDown('KeyA') || this.isDown('ArrowLeft'))  x -= 1;
    if (this.isDown('KeyD') || this.isDown('ArrowRight')) x += 1;

    // Normalize diagonal so speed is equal in all directions
    if (x !== 0 && y !== 0) {
      x /= Math.SQRT2;
      y /= Math.SQRT2;
    }

    return { x, y };
  }

  // Call once at the end of each frame to clear single-frame state.
  flush() {
    this._justPressed.clear();
    this._justReleased.clear();
    this._clicked = false;
  }
}
