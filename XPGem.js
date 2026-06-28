// XP Gem entity — implemented in the next step.
class XPGem {
  constructor(x, y, value = 1) {
    this.x      = x;
    this.y      = y;
    this.value  = value;
    this.active = false;
  }

  update(_dt, _player) {}
  draw(_ctx, _camera) {}
}
