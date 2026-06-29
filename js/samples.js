// ===== 示例图片生成器 — 5 种风格 =====
// 每张 600×400，Canvas 纯代码绘制，零外部依赖

const SampleImages = {
  list: [
    { id: 'sunset',   label: '落日山脉',   fn: 'drawSunset' },
    { id: 'city',     label: '城市天际',   fn: 'drawCity' },
    { id: 'garden',   label: '花丛',       fn: 'drawGarden' },
    { id: 'abstract', label: '几何抽象',   fn: 'drawAbstract' },
    { id: 'ocean',    label: '海浪',       fn: 'drawOcean' },
  ],

  generateAll() {
    const results = [];
    for (const item of this.list) {
      const c = document.createElement('canvas');
      c.width = 600; c.height = 400;
      const ctx = c.getContext('2d');
      this[item.fn](ctx, 600, 400);
      results.push({ id: item.id, label: item.label, dataUrl: c.toDataURL() });
    }
    return results;
  },

  // 1. 落日山脉
  drawSunset(ctx, w, h) {
    // 天空渐变
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    sky.addColorStop(0, '#1a0533');
    sky.addColorStop(0.3, '#4a1942');
    sky.addColorStop(0.55, '#c84b31');
    sky.addColorStop(0.75, '#f0a04b');
    sky.addColorStop(0.9, '#f9d37c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.65);

    // 太阳
    const sunY = h * 0.58;
    const sunGrad = ctx.createRadialGradient(w/2, sunY, 20, w/2, sunY, 90);
    sunGrad.addColorStop(0, '#fffbe6');
    sunGrad.addColorStop(0.4, '#f9d37c');
    sunGrad.addColorStop(1, 'rgba(240,160,75,0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w/2, sunY, 90, 0, Math.PI*2);
    ctx.fill();

    // 山脉
    ctx.fillStyle = '#1a0a1f';
    ctx.beginPath();
    ctx.moveTo(0, h*0.65);
    ctx.lineTo(w*0.15, h*0.45);
    ctx.lineTo(w*0.3, h*0.55);
    ctx.lineTo(w*0.5, h*0.3);
    ctx.lineTo(w*0.7, h*0.48);
    ctx.lineTo(w*0.85, h*0.35);
    ctx.lineTo(w, h*0.5);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // 前景山脉
    ctx.fillStyle = '#0d0514';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, h*0.7);
    ctx.lineTo(w*0.25, h*0.6);
    ctx.lineTo(w*0.4, h*0.75);
    ctx.lineTo(w*0.6, h*0.5);
    ctx.lineTo(w*0.8, h*0.65);
    ctx.lineTo(w, h*0.55);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  },

  // 2. 城市天际线
  drawCity(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0f0c29');
    sky.addColorStop(0.5, '#302b63');
    sky.addColorStop(1, '#24243e');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 月亮
    ctx.fillStyle = '#e8e4d9';
    ctx.beginPath();
    ctx.arc(w*0.8, h*0.2, 35, 0, Math.PI*2);
    ctx.fill();

    // 建筑群
    const buildings = [
      { x: 20,  w: 50,  h: 200 }, { x: 80,  w: 40,  h: 280 },
      { x: 130, w: 60,  h: 160 }, { x: 200, w: 35,  h: 320 },
      { x: 245, w: 55,  h: 240 }, { x: 310, w: 45,  h: 350 },
      { x: 365, w: 70,  h: 190 }, { x: 445, w: 50,  h: 300 },
      { x: 505, w: 40,  h: 220 }, { x: 555, w: 55,  h: 270 },
    ];

    for (const b of buildings) {
      const bGrad = ctx.createLinearGradient(b.x, 0, b.x, h);
      bGrad.addColorStop(0, '#1a1a2e');
      bGrad.addColorStop(1, '#0a0a15');
      ctx.fillStyle = bGrad;
      ctx.fillRect(b.x, h - b.h, b.w, b.h);

      // 窗户
      for (let wy = h - b.h + 15; wy < h - 10; wy += 25) {
        for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 18) {
          ctx.fillStyle = Math.random() > 0.4 ? '#f9d354' : '#1a1a2e';
          ctx.fillRect(wx, wy, 8, 12);
        }
      }
    }
  },

  // 3. 花丛
  drawGarden(ctx, w, h) {
    // 天空
    const sky = ctx.createLinearGradient(0, 0, 0, h*0.5);
    sky.addColorStop(0, '#87ceeb');
    sky.addColorStop(1, '#e0f0e0');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h*0.5);

    // 草地
    const grass = ctx.createLinearGradient(0, h*0.5, 0, h);
    grass.addColorStop(0, '#5a8f3c');
    grass.addColorStop(1, '#3d6329');
    ctx.fillStyle = grass;
    ctx.fillRect(0, h*0.5, w, h*0.5);

    // 花茎
    ctx.strokeStyle = '#2d5a1e';
    ctx.lineWidth = 3;
    const flowers = [
      { x: 80, y: 240, c: '#e85d75' },
      { x: 180, y: 200, c: '#ffb347' },
      { x: 300, y: 260, c: '#ff6b8a' },
      { x: 420, y: 220, c: '#ffd700' },
      { x: 520, y: 240, c: '#e85d75' },
      { x: 140, y: 290, c: '#ff9aa2' },
      { x: 380, y: 280, c: '#ffb347' },
      { x: 480, y: 270, c: '#ff6b8a' },
    ];

    for (const f of flowers) {
      ctx.beginPath();
      ctx.moveTo(f.x, f.y + 30);
      ctx.lineTo(f.x, h*0.55);
      ctx.stroke();

      // 花瓣
      ctx.fillStyle = f.c;
      for (let i = 0; i < 5; i++) {
        const a = (i * 2 * Math.PI) / 5;
        ctx.beginPath();
        ctx.arc(f.x + 12*Math.cos(a), f.y + 12*Math.sin(a), 9, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.fillStyle = '#fff3b0';
      ctx.beginPath();
      ctx.arc(f.x, f.y, 5, 0, Math.PI*2);
      ctx.fill();
    }
  },

  // 4. 几何抽象
  drawAbstract(ctx, w, h) {
    // 深色背景
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    const colors = ['#e94560', '#0f3460', '#16213e', '#533483', '#f5c518', '#00b4d8', '#e76f51'];
    // 随机几何图形
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 20 + Math.random() * 80;
      const col = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.3 + Math.random() * 0.5;

      const shape = Math.random();
      ctx.beginPath();
      if (shape < 0.33) {
        ctx.arc(x, y, r, 0, Math.PI*2);
      } else if (shape < 0.66) {
        ctx.rect(x-r/2, y-r/2, r, r);
      } else {
        for (let j = 0; j < 3; j++) {
          const a = (j * 2 * Math.PI) / 3 + Math.random();
          const px = x + r * Math.cos(a);
          const py = y + r * Math.sin(a);
          j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },

  // 5. 海浪
  drawOcean(ctx, w, h) {
    // 天空
    const sky = ctx.createLinearGradient(0, 0, 0, h*0.45);
    sky.addColorStop(0, '#2c3e50');
    sky.addColorStop(0.5, '#3498db');
    sky.addColorStop(1, '#85c1e9');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h*0.45);

    // 太阳
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(w*0.7, h*0.2, 30, 0, Math.PI*2);
    ctx.fill();

    // 海洋
    const sea = ctx.createLinearGradient(0, h*0.45, 0, h);
    sea.addColorStop(0, '#2980b9');
    sea.addColorStop(0.5, '#1a5276');
    sea.addColorStop(1, '#0e2f44');
    ctx.fillStyle = sea;
    ctx.fillRect(0, h*0.45, w, h*0.55);

    // 波浪
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    for (let row = 0; row < 6; row++) {
      const baseY = h*0.45 + row*40;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 5) {
        const y = baseY + Math.sin(x*0.03 + row*1.5) * 15;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 浪花
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < 20; i++) {
      const fx = Math.random() * w;
      const fy = h*0.45 + Math.random() * 30;
      ctx.beginPath();
      ctx.arc(fx, fy, 2+Math.random()*3, 0, Math.PI*2);
      ctx.fill();
    }
  },
};
