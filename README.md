# 极简几何 — Minimal Geometry

艺术交互性网站。莫兰迪色系 + 几何参数生成 + 粒子系统。

## 特性

- 网格化几何元素（正多边形、圆形、圆角矩形）
- 莫兰迪低饱和色系自动配色
- 鼠标悬停放缩/增亮/旋转
- 点击切换图形类型
- 背景漂浮粒子（鼠标排斥）
- 平滑缓动动画

## 技术栈

纯原生 HTML/CSS/JS + Canvas 2D，零依赖。

## 本地运行

```bash
# 直接浏览器打开
open index.html
```

## 项目结构

```
├── index.html
├── css/style.css
├── js/
│   ├── easing.js      # 缓动函数
│   ├── palette.js     # 莫兰迪色系
│   ├── geometry.js    # 几何图形引擎
│   ├── particles.js   # 粒子系统
│   └── main.js        # 主循环
└── PLAN.md            # 设计文档
```
