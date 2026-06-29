// ===== 极简几何 — 主循环 =====

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const mouse = { x: -999, y: -999 };
let hoveredCell = null;
let gridCols = 8;
let gridRows = 5;
let cells = [];
let particleSystem;
let time = 0;

// ===== 图形类型循环 =====
const SHAPES = ['polygon', 'circle', 'rect'];
const SIDES = [3, 4, 5, 6, 7, 8];

// ===== Cell =====
class Cell {
  constructor(col, row, cellW, cellH) {
    this.col = col;
    this.row = row;
    this.cx = col * cellW + cellW / 2;
    this.cy = row * cellH + cellH / 2;
    this.radius = Math.min(cellW, cellH) * 0.32;
    this.cellW = cellW;
    this.cellH = cellH;

    this.shapeIndex = Math.floor(Math.random() * SHAPES.length);
    this.sides = SIDES[Math.floor(Math.random() * SIDES.length)];
    this.baseColor = Palette.random();
    this.accentColor = Palette.darken(this.baseColor, 0.25);

    // 动画状态
    this.scale = 1;
    this.targetScale = 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.003;
    this.targetRotSpeed = this.rotSpeed;
    this.brightness = 0;      // 0=base, 1=lighten
    this.targetBrightness = 0;
    this.opacity = 1;
    this.targetOpacity = 1;
  }

  get type() { return SHAPES[this.shapeIndex]; }

  setHovered(isHovered) {
    if (isHovered) {
      this.targetScale = 1.25;
      this.targetRotSpeed = 0.012;
      this.targetBrightness = 1;
    } else {
      this.targetScale = 1;
      this.targetRotSpeed = this.rotSpeed;
      this.targetBrightness = 0;
    }
  }

  onClick() {
    this.shapeIndex = (this.shapeIndex + 1) % SHAPES.length;
    if (this.type === 'polygon') {
      this.sides = SIDES[Math.floor(Math.random() * SIDES.length)];
    }
    // 点击脉冲动画
    this.scale = 1.3;
    this.targetScale = 1;
  }

  update(dt) {
    // 平滑缓动
    const lerp = 0.08;
    this.scale += (this.targetScale - this.scale) * lerp;
    this.rotSpeed += (this.targetRotSpeed - this.rotSpeed) * lerp;
    this.brightness += (this.targetBrightness - this.brightness) * lerp;

    this.rotation += this.rotSpeed;
  }

  draw(ctx, time) {
    ctx.save();
    ctx.translate(this.cx, this.cy);
    ctx.scale(this.scale, this.scale);

    const color = this.brightness > 0.01
      ? Palette.lighten(this.baseColor, this.brightness * 0.3)
      : this.baseColor;

    const alpha = Palette.alpha(color, 0.85);

    // === 绘制主图形 ===
    if (this.type === 'polygon') {
      // 填充
      ctx.fillStyle = Palette.alpha(color, 0.15);
      Geometry.polygon(ctx, 0, 0, this.radius, this.sides, this.rotation);
      ctx.fill();

      // 描边
      ctx.strokeStyle = alpha;
      ctx.lineWidth = 1.4;
      Geometry.polygon(ctx, 0, 0, this.radius, this.sides, this.rotation);
      ctx.stroke();

      // 内部对称纹样 — 同心缩小多边形
      ctx.strokeStyle = Palette.alpha(Palette.darken(color, 0.1), 0.6);
      ctx.lineWidth = 0.7;
      Geometry.concentric(ctx, 0, 0, this.radius, this.sides, this.rotation, 2);
      ctx.stroke();

      // 中心放射线
      ctx.strokeStyle = Palette.alpha(Palette.darken(color, 0.2), 0.35);
      ctx.lineWidth = 0.5;
      Geometry.crossLines(ctx, 0, 0, this.radius * 0.7, this.sides, this.rotation);
      ctx.stroke();

    } else if (this.type === 'circle') {
      ctx.fillStyle = Palette.alpha(color, 0.12);
      Geometry.circle(ctx, 0, 0, this.radius);
      ctx.fill();

      ctx.strokeStyle = alpha;
      ctx.lineWidth = 1.4;
      Geometry.circle(ctx, 0, 0, this.radius);
      ctx.stroke();

      // 同心圆
      ctx.strokeStyle = Palette.alpha(Palette.darken(color, 0.15), 0.45);
      ctx.lineWidth = 0.6;
      for (let i = 0; i < 2; i++) {
        Geometry.circle(ctx, 0, 0, this.radius * (0.45 + i * 0.3));
        ctx.stroke();
      }

    } else if (this.type === 'rect') {
      const size = this.radius * 1.5;
      ctx.fillStyle = Palette.alpha(color, 0.12);
      Geometry.roundedRect(ctx, 0, 0, size, size, size * 0.18);
      ctx.fill();

      ctx.save();
      ctx.rotate(this.rotation);
      ctx.strokeStyle = alpha;
      ctx.lineWidth = 1.4;
      Geometry.roundedRect(ctx, 0, 0, size, size, size * 0.18);
      ctx.stroke();

      // 内部小矩形
      ctx.strokeStyle = Palette.alpha(Palette.darken(color, 0.1), 0.5);
      ctx.lineWidth = 0.6;
      Geometry.roundedRect(ctx, 0, 0, size * 0.5, size * 0.5, size * 0.1);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  containsPoint(px, py) {
    const left = this.cx - this.cellW / 2;
    const right = this.cx + this.cellW / 2;
    const top = this.cy - this.cellH / 2;
    const bottom = this.cy + this.cellH / 2;
    return px >= left && px <= right && py >= top && py <= bottom;
  }
}

// ===== 初始化 =====
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 重新计算网格
  const baseSize = Math.min(canvas.width, canvas.height) / 7;
  gridCols = Math.max(4, Math.floor(canvas.width / baseSize));
  gridRows = Math.max(3, Math.floor(canvas.height / baseSize));
  const cellW = canvas.width / gridCols;
  const cellH = canvas.height / gridRows;

  cells = [];
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      cells.push(new Cell(c, r, cellW, cellH));
    }
  }
}

function createParticles() {
  const count = Math.floor((canvas.width * canvas.height) / 28000);
  particleSystem = new ParticleSystem(canvas, Math.min(Math.max(count, 30), 80));
}

function init() {
  resize();
  createParticles();
}

// ===== 事件 =====
canvas.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener('click', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  // 查找被点击的 cell
  let closest = null;
  let closestDist = Infinity;
  for (const cell of cells) {
    if (cell.containsPoint(mouse.x, mouse.y)) {
      const dx = mouse.x - cell.cx;
      const dy = mouse.y - cell.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closestDist = dist;
        closest = cell;
      }
    }
  }
  if (closest) {
    closest.onClick();
  }
});

window.addEventListener('resize', () => {
  resize();
  createParticles();
});

// ===== 动画循环 =====
let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  time = now * 0.001;

  // 清屏
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景
  ctx.fillStyle = '#f5f0eb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 粒子更新 & 绘制
  particleSystem.update(mouse);
  particleSystem.draw(ctx);

  // 检测 hover
  let newHovered = null;
  for (const cell of cells) {
    if (cell.containsPoint(mouse.x, mouse.y)) {
      newHovered = cell;
      break;
    }
  }
  if (hoveredCell !== newHovered) {
    if (hoveredCell) hoveredCell.setHovered(false);
    if (newHovered) newHovered.setHovered(true);
    hoveredCell = newHovered;
  }

  // 更新 & 绘制所有 cell
  for (const cell of cells) {
    cell.update(dt);
    cell.draw(ctx, time);
  }

  // 细微的网格线
  ctx.strokeStyle = 'rgba(180,170,160,0.08)';
  ctx.lineWidth = 0.5;
  const cellW = canvas.width / gridCols;
  const cellH = canvas.height / gridRows;
  for (let r = 1; r < gridRows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellH);
    ctx.lineTo(canvas.width, r * cellH);
    ctx.stroke();
  }
  for (let c = 1; c < gridCols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cellW, 0);
    ctx.lineTo(c * cellW, canvas.height);
    ctx.stroke();
  }
}

// ===== 启动 =====
init();
requestAnimationFrame(animate);
