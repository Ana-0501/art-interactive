// ===== 示例图片 — 用户提供的 5 张真实照片 =====
// 图片文件位于 samples/ 目录

const SampleImages = {
  list: [
    { id: 'sample1', label: '样图一',   src: 'samples/sample1.jpg' },
    { id: 'sample2', label: '样图二',   src: 'samples/sample2.jpg' },
    { id: 'sample3', label: '样图三',   src: 'samples/sample3.jpg' },
    { id: 'sample4', label: '样图四',   src: 'samples/sample4.jpg' },
    { id: 'sample5', label: '样图五',   src: 'samples/sample5.jpg' },
  ],

  generateAll() {
    return this.list.map(item => ({
      id: item.id,
      label: item.label,
      dataUrl: item.src,
    }));
  },
};
