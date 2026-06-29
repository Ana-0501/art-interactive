# ArtFilter — 图像艺术处理

拖放上传图片，选择 3 种艺术效果，即时预览并导出。

## 三种效果

| 效果 | 说明 |
|------|------|
| 🔷 **几何解构** | 三角/菱形剖分填色（Low-poly 现代风） |
| ⬛ **黑白效果** | Sobel 边缘检测 + 宣纸底色（素描/水墨风） |
| 👾 **像素复古** | 降采样像素化（8-bit 游戏风） |

## 技术

- 纯前端 Canvas 2D 像素级处理
- 零依赖，图片不上传服务器
- 5 张真实样图快速体验

## 使用

```bash
# Windows：双击 serve.bat
# 或命令行：
python -m http.server 8080

# 然后浏览器打开：
http://localhost:8080
```

> ⚠️ 不能直接双击 index.html（浏览器 file:// 协议会阻止 Canvas 像素读取）。必须通过 HTTP 服务器访问。

## 项目结构

```
├── index.html
├── serve.bat            # 一键启动脚本
├── samples/             # 5 张样板图
│   ├── sample1~5.jpg
├── css/style.css
├── js/
│   ├── effects.js       # 3 个效果引擎
│   ├── samples.js       # 样板图配置
│   └── main.js          # 上传/交互/导出逻辑
└── README.md
```
