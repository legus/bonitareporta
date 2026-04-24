/* ============================================================
   reporte.js — BonitaReporta
   Validación del formulario de reporte ciudadano
   ============================================================ */

'use strict';

/* ── Referencias al DOM ──────────────────────────────────── */
const form         = document.getElementById('reporteForm');
const tipoGrid     = document.getElementById('tipoGrid');
const tipoVal      = document.getElementById('tipoVal');
const titulo       = document.getElementById('titulo');
const descripcion  = document.getElementById('descripcion');
const zona         = document.getElementById('zona');
const barrio       = document.getElementById('barrio');
const direccion    = document.getElementById('direccion');
const usuarioId    = document.getElementById('usuario_id');
const charCount    = document.getElementById('charCount');
const successBanner = document.getElementById('successBanner');
const errorBanner   = document.getElementById('errorBanner');
const errorBannerMsg = document.getElementById('errorBannerMsg');
const btnCancelar  = document.getElementById('btnCancelar');
const btnEnviar    = document.getElementById('btnEnviar');

/* ── Utilidades ──────────────────────────────────────────── */

/**
 * Muestra u oculta el mensaje de error asociado a un campo.
 * @param {string}  fieldId   - id del campo
 * @param {boolean} isValid   - true = válido, false = inválido
 */
function setFieldState(fieldId, isValid) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');

  if (!field) return;

  if (isValid) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    if (errorEl) errorEl.classList.add('d-none');
  } else {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    if (errorEl) errorEl.classList.remove('d-none');
  }
}

/** Limpia el estado visual de un campo (sin marcas válido/inválido). */
function clearFieldState(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');
  if (!field) return;
  field.classList.remove('is-invalid', 'is-valid');
  if (errorEl) errorEl.classList.add('d-none');
}

/** Oculta ambos banners globales. */
function hideBanners() {
  successBanner.classList.add('d-none');
  errorBanner.classList.add('d-none');
}

/** Muestra el banner de error con un mensaje personalizado. */
function showErrorBanner(msg) {
  errorBannerMsg.textContent = msg;
  errorBanner.classList.remove('d-none');
  errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Selección de tipo de incidente ─────────────────────── */
tipoGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.tipo-btn');
  if (!btn) return;

  tipoGrid.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  tipoVal.value = btn.dataset.tipo;

  // Limpiar error de tipo si existía
  const tipoError = document.getElementById('tipoError');
  if (tipoError) tipoError.classList.add('d-none');
});

/* ── Contador de caracteres en descripción ───────────────── */
descripcion.addEventListener('input', () => {
  const len = descripcion.value.length;
  charCount.textContent = `${len} / 400`;
  charCount.classList.toggle('warn', len > 340);

  // Validación en tiempo real si ya fue tocado
  if (descripcion.dataset.touched) {
    validateDescripcion();
  }
});

/* ── Validación en tiempo real (al salir del campo) ──────── */
titulo.addEventListener('blur',      () => { titulo.dataset.touched = true;      validateTitulo(); });
descripcion.addEventListener('blur', () => { descripcion.dataset.touched = true; validateDescripcion(); });
zona.addEventListener('blur',        () => { zona.dataset.touched = true;        validateZona(); });
barrio.addEventListener('blur',      () => { barrio.dataset.touched = true;      validateBarrio(); });
direccion.addEventListener('blur',   () => { direccion.dataset.touched = true;   validateDireccion(); });
usuarioId.addEventListener('blur',   () => { usuarioId.dataset.touched = true;   validateUsuario(); });

/* ── Funciones de validación individuales ────────────────── */

function validateTipo() {
  const ok = tipoVal.value.trim() !== '';
  const tipoError = document.getElementById('tipoError');
  if (!ok && tipoError) tipoError.classList.remove('d-none');
  else if (tipoError) tipoError.classList.add('d-none');
  return ok;
}

function validateTitulo() {
  const val = titulo.value.trim();
  const ok  = val.length >= 5;
  setFieldState('titulo', ok);
  return ok;
}

function validateDescripcion() {
  const val = descripcion.value.trim();
  const ok  = val.length >= 10;
  setFieldState('descripcion', ok);
  return ok;
}

function validateZona() {
  const ok = zona.value !== '';
  setFieldState('zona', ok);
  return ok;
}

function validateBarrio() {
  const val = barrio.value.trim();
  const ok  = val.length >= 2;
  setFieldState('barrio', ok);
  return ok;
}

function validateDireccion() {
  const val = direccion.value.trim();
  const ok  = val.length >= 5;
  setFieldState('direccion', ok);
  return ok;
}

function validateUsuario() {
  const val = parseInt(usuarioId.value, 10);
  const ok  = !isNaN(val) && val >= 1;
  setFieldState('usuario_id', ok);
  return ok;
}

/* ── Validación completa del formulario ──────────────────── */
function validateAll() {
  // Marcar todos como tocados para que muestren errores
  [titulo, descripcion, zona, barrio, direccion, usuarioId].forEach(el => {
    el.dataset.touched = true;
  });

  const results = [
    validateTipo(),
    validateTitulo(),
    validateDescripcion(),
    validateZona(),
    validateBarrio(),
    validateDireccion(),
    validateUsuario(),
  ];

  return results.every(Boolean);
}

/* ── Construcción del payload ─────────────────────────────── */
function buildPayload() {
  return {
    titulo:      titulo.value.trim(),
    tipo:        tipoVal.value,
    descripcion: descripcion.value.trim(),
    zona:        zona.value,
    barrio:      barrio.value.trim(),
    direccion:   direccion.value.trim(),
    usuario_id:  parseInt(usuarioId.value, 10),
  };
}

/* ── Envío del formulario ─────────────────────────────────── */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideBanners();

  if (!validateAll()) {
    showErrorBanner('Por favor corrige los errores antes de enviar el reporte.');
    // Enfocar el primer campo inválido
    const firstInvalid = form.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const payload = buildPayload();
  console.log('Payload reporte:', JSON.stringify(payload, null, 2));

  // Estado de carga
  btnEnviar.disabled = true;
  btnEnviar.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Enviando...';

  try {
    /*
     * Aquí va la llamada real al backend PHP:
     *
     * const res = await fetch('/api/reportes', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify(payload),
     * });
     * if (!res.ok) throw new Error('Error del servidor');
     */

    // Simulación de latencia de red (quitar cuando se conecte el backend)
    await new Promise(r => setTimeout(r, 900));

    // Éxito
    successBanner.classList.remove('d-none');
    successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    resetForm();

  } catch (err) {
    console.error('Error al enviar reporte:', err);
    showErrorBanner('Ocurrió un error al enviar el reporte. Inténtalo de nuevo.');
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.innerHTML = '<i class="bi bi-send-fill me-2"></i>Enviar reporte';
  }
});

/* ── Cancelar / resetear formulario ──────────────────────── */
btnCancelar.addEventListener('click', () => {
  hideBanners();
  resetForm();
});

function resetForm() {
  form.reset();

  // Limpiar estados visuales
  [titulo, descripcion, zona, barrio, direccion, usuarioId].forEach(el => {
    el.classList.remove('is-invalid', 'is-valid');
    delete el.dataset.touched;
  });

  // Restaurar tipo por defecto
  tipoGrid.querySelectorAll('.tipo-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === 0);
  });
  tipoVal.value = 'Alumbrado';

  // Ocultar todos los errores inline
  document.querySelectorAll('.invalid-feedback-custom').forEach(el => {
    el.classList.add('d-none');
  });

  // Reiniciar contador de caracteres
  charCount.textContent = '0 / 400';
  charCount.classList.remove('warn');
}