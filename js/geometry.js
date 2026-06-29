const Geometry = {
  /**
   * 绘制正多边形
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} cx - 中心 X
   * @param {number} cy - 中心 Y
   * @param {number} radius - 外接圆半径
   * @param {number} sides - 边数 (3-8)
   * @param {number} rotation - 旋转角度 (弧度)
   */
  polygon(ctx, cx, cy, radius, sides, rotation = 0) {
    if (sides < 3) sides = 3;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  },

  /**
   * 绘制圆角矩形
   */
  roundedRect(ctx, cx, cy, w, h, r) {
    const x = cx - w / 2;
    const y = cy - h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  },

  /**
   * 绘制圆形
   */
  circle(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
  },

  /**
   * 内部对称纹样 — 从中心放射线条到各顶点
   */
  starBurst(ctx, cx, cy, radius, sides, rotation, depth = 0.4) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (i * 2 * Math.PI) / sides - Math.PI / 2;
      const x = cx + radius * depth * Math.cos(angle);
      const y = cy + radius * depth * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  },

  /**
   * 内部同心缩小图形
   */
  concentric(ctx, cx, cy, radius, sides, rotation, count = 2) {
    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + i * 0.25);
      const offset = rotation + i * (Math.PI / sides);
      this.polygon(ctx, cx, cy, r, sides, offset);
    }
  },

  /**
   * 绘制交叉连线（顶点到顶点）
   */
  crossLines(ctx, cx, cy, radius, sides, rotation) {
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (i * 2 * Math.PI) / sides - Math.PI / 2;
      points.push({
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      });
    }
    ctx.beginPath();
    // 每隔一个顶点连线
    for (let i = 0; i < sides; i++) {
      const j = (i + 2) % sides;
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[j].x, points[j].y);
    }
  },
};
