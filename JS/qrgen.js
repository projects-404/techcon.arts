(() => {
  const form = document.getElementById('qrForm');
  const input = document.getElementById('qrText');
  const sizeSel = document.getElementById('qrSize');
  const formatSel = document.getElementById('qrFormat');

  const result = document.getElementById('result');
  const img = document.getElementById('qrImage');
  const downloadBtn = document.getElementById('downloadBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const resetBtn = document.getElementById('resetBtn');
  const errorMsg = document.getElementById('errorMsg');

  const BASE = 'https://api.qrserver.com/v1/create-qr-code/';

  function buildUrl(text, size, format) {
    const params = new URLSearchParams();
    params.set('data', text);
    params.set('size', `${size}x${size}`);
    if (format === 'svg') params.set('format', 'svg');
    return `${BASE}?${params.toString()}`;
  }

  function validate(value) {
    if (!value || !value.trim()) return 'Ingresa un texto o URL.';
    if (value.length > 1500) return 'El texto es demasiado largo (máx. ~1500).';
    return '';
  }

  async function handleGenerate(e) {
    e.preventDefault();
    errorMsg.textContent = '';

    const text = input.value.trim();
    const size = sizeSel.value;
    const format = formatSel.value;

    const err = validate(text);
    if (err) {
      errorMsg.textContent = err;
      return;
    }

    const url = buildUrl(text, size, format);
    img.src = url;
    img.alt = `Código QR para: ${text}`;
    result.classList.remove('hidden');

    // Habilitar acciones una vez generado
    downloadBtn.disabled = false;
    copyLinkBtn.disabled = false;
  }

  function downloadCurrent() {
    const text = input.value.trim();
    const size = sizeSel.value;
    const format = formatSel.value;
    const url = buildUrl(text, size, format);

    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${size}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function copyLink() {
    const text = input.value.trim();
    const size = sizeSel.value;
    const format = formatSel.value;
    const url = buildUrl(text, size, format);
    try {
      await navigator.clipboard.writeText(url);
      copyLinkBtn.textContent = '¡Enlace copiado!';
      setTimeout(() => (copyLinkBtn.textContent = 'Copiar enlace'), 1500);
    } catch (e) {
      errorMsg.textContent = 'No se pudo copiar el enlace.';
    }
  }

  function resetAll() {
    form.reset();
    img.removeAttribute('src');
    img.removeAttribute('alt');
    result.classList.add('hidden');
    errorMsg.textContent = '';
  }

  form.addEventListener('submit', handleGenerate);
  downloadBtn.addEventListener('click', downloadCurrent);
  copyLinkBtn.addEventListener('click', copyLink);
  resetBtn.addEventListener('click', resetAll);
})();

