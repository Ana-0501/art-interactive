// ===== ArtFilter — 3 个图像处理效果 =====
// 每个函数: (sourceCtx, targetCtx, width, height, intensity) => void
// intensity: 0-1

const Effects = {

  // ─── 1. 几何解构 Geometric ───
  geometric(srcCtx, dstCtx, w, h, intensity) {
    const src = srcCtx.getImageData(0, 0, w, h);
    dstCtx.clearRect(0, 0, w, h);

    const cellSize = Math.max(4, Math.floor(50 - intensity * 46));
    const cols = Math.ceil(w / cellSize);
    const rows = Math.ceil(h / cellSize);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x0 = col * cellSize;
        const y0 = row * cellSize;
        const cw = Math.min(cellSize, w - x0);
        const ch = Math.min(cellSize, h - y0);
        const cx = x0 + cw / 2;
        const cy = y0 + ch / 2;

        const sx = Math.min(Math.floor(cx), w - 1);
        const sy = Math.min(Math.floor(cy), h - 1);
        const idx = (sy * w + sx) * 4;
        const r = src.data[idx];
        const g = src.data[idx + 1];
        const b = src.data[idx + 2];

        dstCtx.fillStyle = `rgb(${r},${g},${b})`;
        dstCtx.strokeStyle = `rgba(${r},${g},${b},0.3)`;
        dstCtx.lineWidth = 0.5;

        const shape = Math.random();
        dstCtx.beginPath();

        if (shape < 0.4) {
          const s = Math.min(cw, ch) * 0.45;
          const angle = Math.random() * Math.PI * 2;
          for (let i = 0; i < 3; i++) {
            const a = angle + (i * 2 * Math.PI) / 3;
            const px = cx + s * Math.cos(a);
            const py = cy + s * Math.sin(a);
            i === 0 ? dstCtx.moveTo(px, py) : dstCtx.lineTo(px, py);
          }
        } else if (shape < 0.75) {
          const s = Math.min(cw, ch) * 0.4;
          dstCtx.moveTo(cx, cy - s);
          dstCtx.lineTo(cx + s, cy);
          dstCtx.lineTo(cx, cy + s);
          dstCtx.lineTo(cx - s, cy);
        } else {
          const s = Math.min(cw, ch) * 0.35;
          const angle = Math.random() * Math.PI / 4;
          dstCtx.save();
          dstCtx.translate(cx, cy);
          dstCtx.rotate(angle);
          dstCtx.rect(-s, -s, s * 2, s * 2);
          dstCtx.restore();
        }
        dstCtx.closePath();
        dstCtx.fill();
        dstCtx.stroke();
      }
    }
  },

  // ─── 2. 黑白效果 (Sobel 边缘检测 + 宣纸底色) ───
  ink(srcCtx, dstCtx, w, h, intensity) {
    const src = srcCtx.getImageData(0, 0, w, h);
    const dst = dstCtx.createImageData(w, h);

    const threshold = 30 + intensity * 120;
    const gray = new Float32Array(w * h);
    const edge = new Float32Array(w * h);

    for (let i = 0; i < w * h; i++) {
      const idx = i * 4;
      gray[i] = src.data[idx] * 0.299 + src.data[idx+1] * 0.587 + src.data[idx+2] * 0.114;
    }

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const tl = gray[(y-1)*w + (x-1)], tc = gray[(y-1)*w + x], tr = gray[(y-1)*w + (x+1)];
        const ml = gray[y*w + (x-1)],                   mr = gray[y*w + (x+1)];
        const bl = gray[(y+1)*w + (x-1)], bc = gray[(y+1)*w + x], br = gray[(y+1)*w + (x+1)];

        const gx = -tl + tr - 2*ml + 2*mr - bl + br;
        const gy = -tl - 2*tc - tr + bl + 2*bc + br;
        edge[y*w + x] = Math.sqrt(gx*gx + gy*gy);
      }
    }

    const bgR = 245, bgG = 241, bgB = 235;
    for (let i = 0; i < w * h; i++) {
      const idx = i * 4;
      const e = edge[i] > threshold ? 1 : 0;
      const g = gray[i];

      if (e) {
        const darkness = Math.min(1, edge[i] / (threshold * 5));
        const ink = 30 + darkness * 40;
        dst.data[idx] = ink;
        dst.data[idx+1] = ink + 5;
        dst.data[idx+2] = ink + 10;
      } else {
        const wash = g / 255 * 0.15;
        dst.data[idx]   = bgR * (1 - wash) + g * wash;
        dst.data[idx+1] = bgG * (1 - wash) + g * wash;
        dst.data[idx+2] = bgB * (1 - wash) + g * wash;
      }
      dst.data[idx+3] = 255;
    }

    dstCtx.putImageData(dst, 0, 0);
  },

  // ─── 3. 像素复古 Pixel Art ───
  pixel(srcCtx, dstCtx, w, h, intensity) {
    const pixelSize = Math.max(2, Math.floor(2 + intensity * 38));
    const src = srcCtx.getImageData(0, 0, w, h);

    const sw = Math.floor(w / pixelSize);
    const sh = Math.floor(h / pixelSize);
    const small = dstCtx.createImageData(sw, sh);

    for (let sy = 0; sy < sh; sy++) {
      for (let sx = 0; sx < sw; sx++) {
        const x0 = sx * pixelSize;
        const y0 = sy * pixelSize;
        let r = 0, g = 0, b = 0, count = 0;

        for (let dy = 0; dy < pixelSize && y0 + dy < h; dy++) {
          for (let dx = 0; dx < pixelSize && x0 + dx < w; dx++) {
            const idx = ((y0 + dy) * w + (x0 + dx)) * 4;
            r += src.data[idx];
            g += src.data[idx + 1];
            b += src.data[idx + 2];
            count++;
          }
        }
        const si = (sy * sw + sx) * 4;
        small.data[si] = Math.floor(r / count);
        small.data[si+1] = Math.floor(g / count);
        small.data[si+2] = Math.floor(b / count);
        small.data[si+3] = 255;
      }
    }

    dstCtx.imageSmoothingEnabled = false;
    const temp = document.createElement('canvas');
    temp.width = sw; temp.height = sh;
    temp.getContext('2d').putImageData(small, 0, 0);
    dstCtx.clearRect(0, 0, w, h);
    dstCtx.drawImage(temp, 0, 0, w, h);
    dstCtx.imageSmoothingEnabled = true;
  },
};
