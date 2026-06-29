// 莫兰迪色系 Morandi Palette
const Palette = {
  colors: [
    '#C49A7C', // 陶土
    '#B5A99D', // 灰褐
    '#8B9C8B', // 灰绿
    '#A8A0B0', // 灰紫
    '#C4B7A6', // 暖灰
    '#D4C5B9', // 粉灰
    '#9BA88B', // 青灰
    '#C9B8A4', // 驼色
    '#B0A4A0', // 棕灰
  ],

  random() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  },

  randomPair() {
    const i = Math.floor(Math.random() * this.colors.length);
    let j = Math.floor(Math.random() * this.colors.length);
    if (j === i) j = (j + 1) % this.colors.length;
    return [this.colors[i], this.colors[j]];
  },

  // 生成线性渐变
  gradient(ctx, x1, y1, x2, y2, c1, c2) {
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
  },

  // 变亮
  lighten(hex, amount = 0.2) {
    const rgb = this._hexToRgb(hex);
    return this._rgbToHex(rgb.map(c => Math.min(255, c + (255 - c) * amount)));
  },

  // 变暗
  darken(hex, amount = 0.2) {
    const rgb = this._hexToRgb(hex);
    return this._rgbToHex(rgb.map(c => Math.max(0, c * (1 - amount))));
  },

  // 设置透明度
  alpha(hex, a) {
    const rgb = this._hexToRgb(hex);
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
  },

  _hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  },

  _rgbToHex(rgb) {
    return '#' + rgb.map(c => {
      const h = Math.round(c).toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('');
  },
};
