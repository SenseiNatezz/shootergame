// PixelText — draws crisp, blocky pixel-art text with no external font files.
//
// How it works: text is rendered small to an offscreen canvas, its edges are
// hard-thresholded to 1-bit (removing anti-aliasing), then it's scaled up with
// image smoothing OFF. The result is chunky, authentic pixel lettering. Each
// unique (text + style) is built once and cached, so per-frame cost is a blit.
//
// style options:
//   scale     pixel block size (how much to upscale)   default 4
//   baseSize  source font height in px                 default 16
//   family    font family                              default monospace
//   bold      bold weight                              default true
//   color     fill color (ignored if gradient set)
//   gradient  [[stop,color], ...] vertical gradient fill
//   outline   outline color (1 source-px thick) or null
//   align     'left' | 'center' | 'right'              default left
//   valign    'top'  | 'middle' | 'bottom'             default top
const PixelText = {
  _cache: new Map(),

  draw(ctx, text, x, y, style = {}) {
    const cv = this._get(text, style);

    let dx = x, dy = y;
    const align  = style.align  || 'left';
    const valign = style.valign || 'top';
    if (align === 'center')      dx = x - cv.width  / 2;
    else if (align === 'right')  dx = x - cv.width;
    if (valign === 'middle')     dy = y - cv.height / 2;
    else if (valign === 'bottom') dy = y - cv.height;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(cv, Math.round(dx), Math.round(dy));
    return { x: dx, y: dy, w: cv.width, h: cv.height };
  },

  _get(text, style) {
    const key = text + '|' + JSON.stringify(style);
    let cv = this._cache.get(key);
    if (!cv) { cv = this._make(text, style); this._cache.set(key, cv); }
    return cv;
  },

  _make(text, style) {
    const scale  = style.scale    || 4;
    const base   = style.baseSize || 16;
    const family = style.family   || 'monospace';
    const weight = style.bold === false ? '' : 'bold ';
    const font   = `${weight}${base}px ${family}`;

    // Measure
    const meas = document.createElement('canvas').getContext('2d');
    meas.font = font;
    const tw = Math.max(1, Math.ceil(meas.measureText(text).width)) + 2;
    const th = Math.ceil(base * 1.4) + 2;

    // 1-bit mask: white text, hard alpha edges
    const mask = document.createElement('canvas');
    mask.width = tw; mask.height = th;
    const mc = mask.getContext('2d');
    mc.font = font;
    mc.textBaseline = 'top';
    mc.fillStyle = '#fff';
    mc.fillText(text, 1, 1);
    const id = mc.getImageData(0, 0, tw, th);
    const d  = id.data;
    for (let i = 0; i < d.length; i += 4) d[i + 3] = d[i + 3] > 110 ? 255 : 0;
    mc.putImageData(id, 0, 0);

    // Paint the mask with a flat color or vertical gradient
    const tint = (paint) => {
      const c = document.createElement('canvas');
      c.width = tw; c.height = th;
      const x = c.getContext('2d');
      x.drawImage(mask, 0, 0);
      x.globalCompositeOperation = 'source-in';
      paint(x);
      x.fillRect(0, 0, tw, th);
      return c;
    };

    const fillCanvas = tint((x) => {
      if (style.gradient) {
        const g = x.createLinearGradient(0, 0, 0, th);
        style.gradient.forEach(([s, c]) => g.addColorStop(s, c));
        x.fillStyle = g;
      } else {
        x.fillStyle = style.color || '#ffffff';
      }
    });

    // Compose final upscaled canvas (with optional outline)
    const pad = style.outline ? 1 : 0; // source-px padding for outline room
    const out = document.createElement('canvas');
    out.width  = (tw + pad * 2) * scale;
    out.height = (th + pad * 2) * scale;
    const o = out.getContext('2d');
    o.imageSmoothingEnabled = false;

    if (style.outline) {
      const outlineCanvas = tint((x) => { x.fillStyle = style.outline; });
      const offs = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];
      for (const [ox, oy] of offs) {
        o.drawImage(outlineCanvas, (pad + ox) * scale, (pad + oy) * scale, tw * scale, th * scale);
      }
    }
    o.drawImage(fillCanvas, pad * scale, pad * scale, tw * scale, th * scale);
    return out;
  }
};
