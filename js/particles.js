class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset(true);
  }

  reset(randomPos = false) {
    this.x = randomPos ? Math.random() * this.canvas.width : this.canvas.width / 2;
    this.y = randomPos ? Math.random() * this.canvas.height : this.canvas.height / 2;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 2.5 + 1;
    this.type = Math.random() > 0.5 ? 'circle' : 'rect';
    this.color = Palette.random();
    this.opacity = Math.random() * 0.25 + 0.05;
  }

  update(mouse, width, height) {
    // 鼠标排斥
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repelRadius = 120;

    if (dist < repelRadius && dist > 0) {
      const force = (repelRadius - dist) / repelRadius * 0.08;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }

    // 速度衰减
    this.vx *= 0.995;
    this.vy *= 0.995;

    // 限制速度
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 1.5) {
      this.vx = (this.vx / speed) * 1.5;
      this.vy = (this.vy / speed) * 1.5;
    }

    this.x += this.vx;
    this.y += this.vy;

    // 边界回弹
    if (this.x < -10) this.x = width + 10;
    if (this.x > width + 10) this.x = -10;
    if (this.y < -10) this.y = height + 10;
    if (this.y > height + 10) this.y = -10;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    if (this.type === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const s = this.radius * 1.8;
      ctx.fillRect(this.x - s / 2, this.y - s / 2, s, s);
    }
    ctx.restore();
  }
}

class ParticleSystem {
  constructor(canvas, count = 50) {
    this.canvas = canvas;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(canvas));
    }
  }

  update(mouse) {
    for (const p of this.particles) {
      p.update(mouse, this.canvas.width, this.canvas.height);
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      p.draw(ctx);
    }
  }
}
