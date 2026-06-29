const Easing = {
  linear: t => t,

  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: t => {
    if (t === 0 || t === 1) return t;
    return t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  easeOutBack: t => {
    const c = 1.70158;
    return (t -= 1) * t * ((c + 1) * t + c) + 1;
  },
  easeInOutBack: t => {
    const c = 1.70158 * 1.525;
    return t < 0.5
      ? (t * 2) * (t * 2) * ((c + 1) * t * 2 - c) / 2
      : ((t * 2 - 2) * (t * 2 - 2) * ((c + 1) * (t * 2 - 2) + c) + 2) / 2;
  },

  easeOutElastic: t => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
  },
};
