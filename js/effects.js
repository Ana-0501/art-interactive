// ===== ArtFilter — 6 个图像处理效果 =====
// 每个函数: (sourceCtx, targetCtx, width, height, intensity) => void
// intensity: 0-1

const Effects = {

  // ─── 1. 点彩重构 Pointillism ───
  pointillism(srcCtx, dstCtx, w, h, intensity) {
    const src = srcCtx.getImageData(0, 0, w, h);
    const dst = dstCtx.createImageData(w, h);
    // 先填白色底
    for (let i = 0; i < dst.data.length; i += 4) {
      dst.data[i] = 250; dst.data[i+1] = 248; dst.data[i+2] = 242; dst.data[i+3] = 255;
    }

    const dotCount = Math.floor(2000 + intensity * 48000);
    const maxRadius = 2 + intensity * 6;

    for (let n = 0; n < dotCount; n++) {
      const x = Math.floor(Math.random() * w);
      const y = Math.floor(Math.random() * h);
      const idx = (y * w + x) * 4;
      const r = src.data[idx];
      const g = src.data[idx + 1];
      const b = src.data[idx + 2];
      const radius = maxRadius * (0.4 + Math.random() * 0.6);

      // 画圆点
      this._drawDot(dst, w, h, x, y, radius, r, g, b);
    }
    dstCtx.putImageData(dst, 0, 0);
  },

  // ─── 2. 几何解构 Geometric ───
  geometric(srcCtx, dstCtx, w, h, intensity) {
    const src = srcCtx.getImageData(0, 0, w, h);
    dstCtx.clearRect(0, 0, w, h);

    const cellSize = Math.max(4, Math.floor(50 - intensity * 46)); // 50→4
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

        // 取样原图中点颜色
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
          // 三角形
          const s = Math.min(cw, ch) * 0.45;
          const angle = Math.random() * Math.PI * 2;
          for (let i = 0; i < 3; i++) {
            const a = angle + (i * 2 * Math.PI) / 3;
            const px = cx + s * Math.cos(a);
            const py = cy + s * Math.sin(a);
            i === 0 ? dstCtx.moveTo(px, py) : dstCtx.lineTo(px, py);
          }
        } else if (shape < 0.75) {
          // 菱形
          const s = Math.min(cw, ch) * 0.4;
          dstCtx.moveTo(cx, cy - s);
          dstCtx.lineTo(cx + s, cy);
          dstCtx.lineTo(cx, cy + s);
          dstCtx.lineTo(cx - s, cy);
        } else {
          // 旋转矩形
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

  // ─── 3. 水墨轮廓 Ink Outline ───
  ink(srcCtx, dstCtx, w, h, intensity) {
    const src = srcCtx.getImageData(0, 0, w, h);
    const dst = dstCtx.createImageData(w, h);

    // Sobel 边缘检测
    const threshold = 30 + intensity * 120; // higher = fewer edges
    const gray = new Float32Array(w * h);
    const edge = new Float32Array(w * h);

    // 灰度化
    for (let i = 0; i < w * h; i++) {
      const idx = i * 4;
      gray[i] = src.data[idx] * 0.299 + src.data[idx+1] * 0.587 + src.data[idx+2] * 0.114;
    }

    // Sobel 核
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

    // 渲染
    const bgR = 245, bgG = 241, bgB = 235; // 宣纸色
    for (let i = 0; i < w * h; i++) {
      const idx = i * 4;
      const e = edge[i] > threshold ? 1 : 0;
      const g = gray[i];

      if (e) {
        // 边缘：深墨水色
        const darkness = Math.min(1, edge[i] / (threshold * 5));
        const ink = 30 + darkness * 40;
        dst.data[idx] = ink;
        dst.data[idx+1] = ink + 5;
        dst.data[idx+2] = ink + 10;
      } else {
        // 背景：宣纸色 + 淡淡灰度
        const wash = g / 255 * 0.15;
        dst.data[idx]   = bgR * (1 - wash) + g * wash;
        dst.data[idx+1] = bgG * (1 - wash) + g * wash;
        dst.data[idx+2] = bgB * (1 - wash) + g * wash;
      }
      dst.data[idx+3] = 255;
    }

    dstCtx.putImageData(dst, 0, 0);
  },

  // ─── 4. 像素复古 Pixel Art ───
  pixel(srcCtx, dstCtx, w, h, intensity) {
    const pixelSize = Math.max(2, Math.floor(2 + intensity * 38)); // 2→40
    const src = srcCtx.getImageData(0, 0, w, h);

    // 创建缩略图
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

    // 放大回去（像素化）
    dstCtx.imageSmoothingEnabled = false;
    const temp = document.createElement('canvas');
    temp.width = sw; temp.height = sh;
    temp.getContext('2d').putImageData(small, 0, 0);
    dstCtx.clearRect(0, 0, w, h);
    dstCtx.drawImage(temp, 0, 0, w, h);
    dstCtx.imageSmoothingEnabled = true;
  },

  // ─── 5. 波普网点 Halftone ───
  halftone(srcCtx, dstCtx, w, h, intensity) {
    const src = srcCtx.getImageData(0, 0, w, h);
    dstCtx.fillStyle = '#fafaf5';
    dstCtx.fillRect(0, 0, w, h);

    const spacing = Math.max(3, Math.floor(16 - intensity * 13)); // 16→3
    const maxRadius = spacing * 0.7;

    for (let y = 0; y < h; y += spacing) {
      for (let x = 0; x < w; x += spacing) {
        // 计算该区域平均亮度
        let sum = 0, count = 0;
        for (let dy = 0; dy < spacing && y + dy < h; dy++) {
          for (let dx = 0; dx < spacing && x + dx < w; dx++) {
            const idx = ((y + dy) * w + (x + dx)) * 4;
            sum += src.data[idx] * 0.299 + src.data[idx+1] * 0.587 + src.data[idx+2] * 0.114;
            count++;
          }
        }
        const brightness = sum / count / 255;
        const radius = maxRadius * (1 - brightness) * 0.9;

        // 取中心点颜色
        const cx = Math.min(x + Math.floor(spacing / 2), w - 1);
        const cy = Math.min(y + Math.floor(spacing / 2), h - 1);
        const idx = (cy * w + cx) * 4;

        dstCtx.fillStyle = `rgb(${src.data[idx]},${src.data[idx+1]},${src.data[idx+2]})`;
        dstCtx.beginPath();
        dstCtx.arc(x + spacing / 2, y + spacing / 2, Math.max(0.5, radius), 0, Math.PI * 2);
        dstCtx.fill();
      }
    }
  },

  // ─── 6. 色彩抽离 Color Isolation ───
  isolate(srcCtx, dstCtx, w, h, intensity) {
    const src = srcCtx.getImageData(0, 0, w, h);
    const dst = dstCtx.createImageData(w, h);

    // 检测主色调
    const hueHist = new Array(36).fill(0);
    for (let i = 0; i < src.data.length; i += 4) {
      const r = src.data[i], g = src.data[i+1], b = src.data[i+2];
      const [hue] = this._rgbToHsl(r, g, b);
      if (r + g + b > 60) { // 忽略太暗的像素
        const bin = Math.floor(hue / 10) % 36;
        hueHist[bin] += r + g + b;
      }
    }
    let maxBin = 0, maxVal = 0;
    for (let i = 0; i < 36; i++) {
      if (hueHist[i] > maxVal) { maxVal = hueHist[i]; maxBin = i; }
    }
    const targetHue = maxBin * 10 + 5;

    // 根据 intensity 决定容差: 5°→90°
    const tolerance = 5 + intensity * 85;

    for (let i = 0; i < w * h; i++) {
      const idx = i * 4;
      const r = src.data[idx], g = src.data[idx+1], b = src.data[idx+2];
      const [hue, sat, light] = this._rgbToHsl(r, g, b);

      // 色相距离
      let hueDist = Math.abs(hue - targetHue);
      if (hueDist > 180) hueDist = 360 - hueDist;

      if (hueDist <= tolerance) {
        // 保留颜色
        dst.data[idx] = r;
        dst.data[idx+1] = g;
        dst.data[idx+2] = b;
      } else {
        // 转灰度
        const gray = Math.floor(r * 0.299 + g * 0.587 + b * 0.114);
        dst.data[idx] = gray;
        dst.data[idx+1] = gray;
        dst.data[idx+2] = gray;
      }
      dst.data[idx+3] = 255;
    }

    dstCtx.putImageData(dst, 0, 0);
  },

  // ===== 工具函数 =====
  _drawDot(dst, w, h, cx, cy, radius, r, g, b) {
    const ir = Math.ceil(radius);
    for (let dy = -ir; dy <= ir; dy++) {
      for (let dx = -ir; dx <= ir; dx++) {
        if (dx*dx + dy*dy > radius*radius) continue;
        const px = cx + dx;
        const py = cy + dy;
        if (px < 0 || px >= w || py < 0 || py >= h) continue;
        const idx = (py * w + px) * 4;
        const dist = Math.sqrt(dx*dx + dy*dy) / radius;
        const alpha = 1 - dist * 1.2;
        dst.data[idx]   = Math.min(255, dst.data[idx]   + r * alpha);
        dst.data[idx+1] = Math.min(255, dst.data[idx+1] + g * alpha);
        dst.data[idx+2] = Math.min(255, dst.data[idx+2] + b * alpha);
        dst.data[idx+3] = 255;
      }
    }
  },

  _rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [h * 360, s, l];
  },
};
