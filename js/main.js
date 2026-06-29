// ===== ArtFilter — 主逻辑 =====

const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const controls = document.getElementById('controls');
const effectButtons = document.getElementById('effect-buttons');
const outputCanvas = document.getElementById('output-canvas');
const placeholder = document.getElementById('placeholder');
const intensitySlider = document.getElementById('intensity');
const intensityVal = document.getElementById('intensity-val');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');

const MAX_DIM = 1200;
let sourceImage = null;
let sourceCanvas = document.createElement('canvas');
let sourceCtx = sourceCanvas.getContext('2d');
let outputCtx = outputCanvas.getContext('2d');
let currentEffect = null;
let processingTimer = null;

// ===== Upload =====
uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) loadImage(file);
});
fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) loadImage(file);
});

function loadImage(file) {
  if (!file.type.startsWith('image/')) { alert('请选择图片文件'); return; }

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      // 缩放到合理尺寸
      let w = img.width, h = img.height;
      if (w > MAX_DIM || h > MAX_DIM) {
        const ratio = MAX_DIM / Math.max(w, h);
        w = Math.floor(w * ratio);
        h = Math.floor(h * ratio);
      }
      sourceCanvas.width = w;
      sourceCanvas.height = h;
      sourceCtx.drawImage(img, 0, 0, w, h);
      sourceImage = { w, h };

      // 隐藏上传区，显示控制面板
      uploadZone.style.display = 'none';
      controls.style.display = 'block';

      // 重置
      currentEffect = null;
      outputCanvas.style.display = 'none';
      placeholder.style.display = 'block';
      downloadBtn.disabled = true;
      document.querySelectorAll('.effect-btn').forEach(b => b.classList.remove('active'));
      outputCanvas.width = 0;
      outputCanvas.height = 0;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ===== Effect Selection =====
effectButtons.addEventListener('click', e => {
  const btn = e.target.closest('.effect-btn');
  if (!btn) return;

  document.querySelectorAll('.effect-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentEffect = btn.dataset.effect;
  processImage();
});

// ===== Intensity Slider =====
intensitySlider.addEventListener('input', () => {
  intensityVal.textContent = intensitySlider.value;
  if (currentEffect) scheduleProcess();
});

// ===== Processing =====
function scheduleProcess() {
  clearTimeout(processingTimer);
  processingTimer = setTimeout(processImage, 80);
}

function processImage() {
  if (!sourceImage || !currentEffect) return;

  const { w, h } = sourceImage;
  outputCanvas.width = w;
  outputCanvas.height = h;
  outputCanvas.style.display = 'block';
  placeholder.style.display = 'none';

  const intensity = intensitySlider.value / 100;

  try {
    Effects[currentEffect](sourceCtx, outputCtx, w, h, intensity);
    downloadBtn.disabled = false;
  } catch (err) {
    console.error('Processing error:', err);
    placeholder.textContent = '处理出错，请重试';
    placeholder.style.display = 'block';
  }
}

// ===== Download =====
downloadBtn.addEventListener('click', () => {
  if (!outputCanvas.width) return;
  outputCanvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artfilter-${currentEffect}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
});

// ===== Reset =====
resetBtn.addEventListener('click', () => {
  sourceImage = null;
  currentEffect = null;
  uploadZone.style.display = '';
  controls.style.display = 'none';
  outputCanvas.style.display = 'none';
  placeholder.style.display = 'block';
  downloadBtn.disabled = true;
  document.querySelectorAll('.effect-btn').forEach(b => b.classList.remove('active'));
  intensitySlider.value = 50;
  intensityVal.textContent = '50';
  fileInput.value = '';
  outputCanvas.width = 0;
  outputCanvas.height = 0;
});
