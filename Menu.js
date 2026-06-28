// Main menu screen. Drawn entirely on the 1920x1080 canvas so it scales and
// stays pixel-crisp with the rest of the game. Handles its own mouse hover /
// click and calls onStart() when the player chooses to begin.
class Menu {
  constructor(onStart) {
    this.onStart      = onStart;
    this.time         = 0;
    this.showControls = false;
    this.hovered      = null;

    // Decorative animated character (reuses the player sheet; safe if missing)
    this.charSheet = new SpriteSheet('src/assets/player.png', 8, 8);
    this.charAnim  = new Animator(8);

    this.stars   = this._makeStars(150);
    this.bgTile  = this._makeBackdrop(); // small gradient, upscaled = pixelated

    // Optional full-screen background artwork. Used only once it loads and is
    // a real (large) image; otherwise the starfield backdrop is used instead.
    this.bgImage = new Image();
    this.bgReady = false;
    this.bgImage.onload = () => {
      if (this.bgImage.naturalWidth >= 400) this.bgReady = true;
    };
    this.bgImage.src = 'src/assets/menu_bg.png';
  }

  // ── Layout ────────────────────────────────────────────────────────────────
  get buttons() {
    if (this.showControls) {
      return [{ id: 'back', label: 'BACK', x: 960 - 200, y: 820, w: 400, h: 92 }];
    }
    if (this.bgReady) {
      // Left-aligned column to match an artwork backdrop
      const x = 110, w = 470, h = 92, gap = 22;
      return [
        { id: 'start',    label: 'START GAME',  x, y: 612,           w, h },
        { id: 'controls', label: 'HOW TO PLAY', x, y: 612 + h + gap, w, h }
      ];
    }
    // Centered column for the starfield backdrop
    return [
      { id: 'start',    label: 'START GAME',  x: 960 - 230, y: 672, w: 460, h: 96 },
      { id: 'controls', label: 'HOW TO PLAY', x: 960 - 230, y: 792, w: 460, h: 96 }
    ];
  }

  // ── Update ──────────────────────────────────────────────────────────────--
  update(dt, input) {
    this.time += dt;
    this.charAnim.update(dt, 8);

    // Drift stars for a subtle parallax
    for (const s of this.stars) {
      s.y += s.speed * dt;
      if (s.y > 1080) { s.y = 0; s.x = Math.random() * 1920; }
    }

    const m = input.getMouse();
    this.hovered = null;
    for (const b of this.buttons) {
      if (m.x >= b.x && m.x <= b.x + b.w && m.y >= b.y && m.y <= b.y + b.h) {
        this.hovered = b.id;
      }
    }

    if (input.isClicked() && this.hovered) {
      this._activate(this.hovered);
    }
  }

  _activate(id) {
    if (id === 'start')         this.onStart();
    else if (id === 'controls') this.showControls = true;
    else if (id === 'back')     this.showControls = false;
  }

  // ── Draw ────────────────────────────────────────────────────────────────--
  draw(ctx, W, H) {
    ctx.imageSmoothingEnabled = false;

    if (this.bgReady) {
      // Full-screen artwork (cover, bottom-aligned, pixelated)
      this._drawCoverImage(ctx, this.bgImage, W, H);
      // Left scrim so title + buttons stay readable over the art
      const grad = ctx.createLinearGradient(0, 0, W * 0.6, 0);
      grad.addColorStop(0,   'rgba(4,6,16,0.90)');
      grad.addColorStop(0.45,'rgba(4,6,16,0.55)');
      grad.addColorStop(1,   'rgba(4,6,16,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else {
      // Fallback: tiny gradient canvas upscaled to full size (pixelated bands)
      ctx.drawImage(this.bgTile, 0, 0, W, H);
      // Stars (chunky squares)
      for (const s of this.stars) {
        const tw = 0.55 + 0.45 * Math.sin(this.time * s.twSpeed + s.twPhase);
        ctx.globalAlpha = 0.25 + 0.75 * tw;
        ctx.fillStyle   = s.color;
        ctx.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
      }
      ctx.globalAlpha = 1;
    }

    if (this.showControls) {
      this._drawControls(ctx, W, H);
    } else {
      this._drawMain(ctx, W, H);
    }
  }

  _drawMain(ctx, W, H) {
    if (this.bgReady) {
      // Artwork layout: title + menu grouped on the left over the scrim
      const tx = 110;
      PixelText.draw(ctx, 'ASTRAL', tx + 6, 300 + 6, {
        scale: 9, baseSize: 16, color: '#02030a', align: 'left', valign: 'middle'
      });
      PixelText.draw(ctx, 'ASTRAL', tx, 300, {
        scale: 9, baseSize: 16, outline: '#0a1838',
        gradient: [[0, '#ffe6a8'], [0.5, '#ffc24d'], [1, '#e08a1f']], align: 'left', valign: 'middle'
      });
      PixelText.draw(ctx, 'SIEGE', tx + 6, 410 + 6, {
        scale: 9, baseSize: 16, color: '#02030a', align: 'left', valign: 'middle'
      });
      PixelText.draw(ctx, 'SIEGE', tx, 410, {
        scale: 9, baseSize: 16, outline: '#0a1838',
        gradient: [[0, '#ffe6a8'], [0.5, '#ffc24d'], [1, '#e08a1f']], align: 'left', valign: 'middle'
      });

      PixelText.draw(ctx, 'SURVIVE THE ENDLESS HORDE', tx, 502, {
        scale: 3, baseSize: 16, color: '#d8c39a', outline: '#0a1430', align: 'left', valign: 'middle'
      });
    } else {
      const cx = W / 2;
      PixelText.draw(ctx, 'ASTRAL SIEGE', cx + 8, 150 + 8, {
        scale: 9, baseSize: 16, color: '#02030a', align: 'center', valign: 'middle'
      });
      PixelText.draw(ctx, 'ASTRAL SIEGE', cx, 150, {
        scale: 9, baseSize: 16, outline: '#0a1838',
        gradient: [[0, '#bfe9ff'], [0.5, '#49b6ff'], [1, '#1f6fd6']], align: 'center', valign: 'middle'
      });
      PixelText.draw(ctx, 'SURVIVE THE ENDLESS HORDE', cx, 268, {
        scale: 3, baseSize: 16, color: '#8fb6e6', outline: '#0a1838', align: 'center', valign: 'middle'
      });
      // Animated character only on the starfield backdrop (artwork has its own hero)
      this._drawHeroCharacter(ctx, cx, 470);
    }

    // Buttons
    for (const b of this.buttons) this._drawButton(ctx, b, this.hovered === b.id);

    // Footer
    PixelText.draw(ctx, 'MOVE: WASD / ARROWS    -    WEAPON FIRES AUTOMATICALLY', W / 2, 1012, {
      scale: 2, baseSize: 16, color: this.bgReady ? '#cdbb93' : '#5f7196',
      outline: this.bgReady ? '#0a0d18' : null, align: 'center', valign: 'middle'
    });
    PixelText.draw(ctx, 'v0.1', 1900, 24, {
      scale: 2, baseSize: 16, color: this.bgReady ? '#e8d9b5' : '#3c4c6b',
      outline: this.bgReady ? '#0a0d18' : null, align: 'right'
    });
  }

  _drawControls(ctx, W, H) {
    const cx = W / 2;
    // Dim panel
    ctx.fillStyle = 'rgba(4,8,20,0.82)';
    ctx.fillRect(0, 0, W, H);

    PixelText.draw(ctx, 'HOW TO PLAY', cx, 200, {
      scale: 6, baseSize: 16, outline: '#0a1838',
      gradient: [[0, '#bfe9ff'], [1, '#49b6ff']],
      align: 'center', valign: 'middle'
    });

    const lines = [
      'MOVE        -  WASD or ARROW KEYS',
      'ATTACK      -  AUTOMATIC, NEAREST ENEMY',
      'XP GEMS     -  WALK OVER THEM TO LEVEL UP',
      'GOAL        -  SURVIVE AS LONG AS YOU CAN'
    ];
    let y = 360;
    for (const line of lines) {
      PixelText.draw(ctx, line, cx, y, {
        scale: 3, baseSize: 16, color: '#cfe0ff', outline: '#0a1838',
        align: 'center', valign: 'middle'
      });
      y += 90;
    }

    for (const b of this.buttons) this._drawButton(ctx, b, this.hovered === b.id);
  }

  // Pixel-art beveled button
  _drawButton(ctx, b, hover) {
    const { x, y, w, h } = b;
    const lift = hover ? -4 : 0;
    const by   = y + lift;
    const t    = 6; // border thickness

    // Drop shadow
    ctx.fillStyle = '#03040c';
    ctx.fillRect(x + 8, by + 10, w, h);

    // Body (two-tone bevel)
    ctx.fillStyle = hover ? '#143a7a' : '#0e2148';
    ctx.fillRect(x, by, w, h);
    ctx.fillStyle = hover ? '#1f5bbf' : '#16315f';
    ctx.fillRect(x, by, w, Math.floor(h * 0.5));

    // Top highlight + bottom shade lines
    ctx.fillStyle = hover ? '#5fa8ff' : '#2f5aa0';
    ctx.fillRect(x, by, w, 6);
    ctx.fillStyle = '#0a1838';
    ctx.fillRect(x, by + h - 6, w, 6);

    // Chunky border frame
    ctx.fillStyle = hover ? '#9fd2ff' : '#4f78c4';
    ctx.fillRect(x, by, w, t);
    ctx.fillRect(x, by + h - t, w, t);
    ctx.fillRect(x, by, t, h);
    ctx.fillRect(x + w - t, by, t, h);

    // Label
    PixelText.draw(ctx, b.label, x + w / 2, by + h / 2 - 2, {
      scale: 4, baseSize: 14, outline: '#0a1430',
      color: hover ? '#ffffff' : '#dfe9ff',
      align: 'center', valign: 'middle'
    });
  }

  _drawHeroCharacter(ctx, cx, cy) {
    if (this.charSheet.loaded) {
      const col = this.charAnim.index;
      this.charSheet.drawFrame(ctx, col, 2 /* down-facing row */, cx, cy, 320, 320);
    } else {
      // Fallback: pulsing pixel diamond emblem
      const s = 16 + Math.round(4 * Math.sin(this.time * 3));
      ctx.fillStyle = '#49b6ff';
      for (let i = -3; i <= 3; i++) {
        const wRow = (3 - Math.abs(i)) * s;
        ctx.fillRect(cx - wRow, cy + i * s, wRow * 2, s);
      }
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────--
  // Draw an image to cover the whole canvas (preserve aspect, crop overflow),
  // anchored to the bottom so foreground detail is kept. Pixelated.
  _drawCoverImage(ctx, img, W, H) {
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(W / iw, H / ih);
    const dw = iw * scale, dh = ih * scale;
    const dx = (W - dw) / 2;
    const dy = H - dh; // bottom-align
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  _makeStars(n) {
    const colors = ['#ffffff', '#bcd8ff', '#9fb4ff', '#fff2c4'];
    const stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        size: 2 + Math.floor(Math.random() * 3) * 2, // 2,4,6
        speed: 4 + Math.random() * 14,
        color: colors[Math.floor(Math.random() * colors.length)],
        twPhase: Math.random() * Math.PI * 2,
        twSpeed: 1 + Math.random() * 2.5
      });
    }
    return stars;
  }

  // Small gradient canvas; upscaling it with smoothing off yields pixel bands.
  _makeBackdrop() {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 72;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 72);
    g.addColorStop(0,   '#0a1230');
    g.addColorStop(0.5, '#070b1d');
    g.addColorStop(1,   '#03040c');
    x.fillStyle = g;
    x.fillRect(0, 0, 128, 72);
    // Soft purple nebula glow near upper-center
    const r = x.createRadialGradient(64, 26, 4, 64, 26, 60);
    r.addColorStop(0, 'rgba(90,60,160,0.35)');
    r.addColorStop(1, 'rgba(90,60,160,0)');
    x.fillStyle = r;
    x.fillRect(0, 0, 128, 72);
    return c;
  }
}
