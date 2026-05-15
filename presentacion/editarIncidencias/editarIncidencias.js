// ============================================================
// VER / EDITAR INCIDENCIAS - BonitaReporta
// Capa de Presentación | CRUD - Listar + Editar
// UNIÓN INTELIGENTE: ver_incidencias.js + ver_incidencias(1).js
// ============================================================

'use strict';

// ============================================================
// SECCIÓN 1: CONFIGURACIÓN Y ESTADO (de ver_incidencias.js - editar)
// ============================================================

// --- CONFIGURACIÓN DEL API ---
var API_URL_EDITAR = '/BonitaReporta/logica/api/editar_incidencia.php';
// API_URL original de ver_incidencias.js: /BonitaReporta/logica/api/editar_incidencia.php

// --- Datos de la incidencia (simulando respuesta previa del API) ---
var incidenciaOriginal = {
  id: 501,
  titulo: 'Falla de Alumbrado',
  tipo: 'Alumbrado',
  ciudad: 'Bucaramanga',
  barrio: 'La Esperanza',
  direccion: 'Carrera 27 # 45-12, cerca al parque principal',
  descripcion: 'Poste parpadea toda la noche en la esquina de la carrera 27 con calle 45. El parpadeo es intermitente pero muy molesto para los residentes del sector. Se solicita revision urgente ya que lleva mas de una semana asi.',
  usuario_id: 12,
  fecha: '12 may 2026',
  estado: 'Pendiente',
  prioridad: 'Media'
};

var incidenciaActual = JSON.parse(JSON.stringify(incidenciaOriginal));
var hayCambios = false;

// ============================================================
// SECCIÓN 2: CONFIGURACIÓN Y ESTADO (añadido desde ver_incidencias(1).js - listar)
// ============================================================

// --- CONFIGURACIÓN DEL API ---
var API_URL_LISTAR = '/BonitaReporta/logica/api/dummy_api.php';
// API_URL original de ver_incidencias(1).js: /BonitaReporta/logica/api/dummy_api.php

// --- Estado ---
var incidencias = [];
var filtros = {
  ciudad: '',
  estado: '',
  tipo: ''
};

// ============================================================
// SECCIÓN 3: REFERENCIAS DOM (ver_incidencias.js - editar)
// ============================================================

var form = document.getElementById('editarForm');
var inputs = {
  titulo: document.getElementById('titulo'),
  tipo: document.getElementById('tipo'),
  estado: document.getElementById('estado'),
  prioridad: document.getElementById('prioridad'),
  ciudad: document.getElementById('ciudad'),
  barrio: document.getElementById('barrio'),
  usuario_id: document.getElementById('usuario_id'),
  direccion: document.getElementById('direccion'),
  descripcion: document.getElementById('descripcion')
};

var preview = {
  id: document.getElementById('previewId'),
  titulo: document.getElementById('previewTitulo'),
  tipo: document.getElementById('previewTipo'),
  estado: document.getElementById('previewEstado'),
  prioridad: document.getElementById('previewPrioridad'),
  ciudad: document.getElementById('previewCiudad'),
  barrio: document.getElementById('previewBarrio'),
  direccion: document.getElementById('previewDireccion'),
  descripcion: document.getElementById('previewDescripcion'),
  usuario: document.getElementById('previewUsuario'),
  fecha: document.getElementById('previewFecha')
};

var cambiosIndicator = document.getElementById('cambiosIndicator');
var modalConfirmar = document.getElementById('modalConfirmar');
var resumenCambios = document.getElementById('resumenCambios');

// ============================================================
// SECCIÓN 4: REFERENCIAS DOM (añadido desde ver_incidencias(1).js - listar)
// ============================================================

var grid = document.getElementById('incidenciasGrid');
var emptyState = document.getElementById('emptyState');
var totalCount = document.getElementById('totalCount');
var filtrosPanel = document.getElementById('filtrosPanel');
var btnFiltros = document.getElementById('btnFiltros');

// ============================================================
// SECCIÓN 5: FUNCIONES DE EDICIÓN (ver_incidencias.js)
// ============================================================

// --- Inicializar formulario ---
function inicializarFormulario() {
  if (!inputs.titulo) return; // Solo si estamos en la página de edición

  inputs.titulo.value = incidenciaActual.titulo;
  inputs.tipo.value = incidenciaActual.tipo;
  inputs.estado.value = incidenciaActual.estado;
  inputs.prioridad.value = incidenciaActual.prioridad;
  inputs.ciudad.value = incidenciaActual.ciudad;
  inputs.barrio.value = incidenciaActual.barrio;
  inputs.usuario_id.value = incidenciaActual.usuario_id;
  inputs.direccion.value = incidenciaActual.direccion;
  inputs.descripcion.value = incidenciaActual.descripcion;

  actualizarVistaPrevia();
}

// --- Actualizar vista previa ---
function actualizarVistaPrevia() {
  if (!preview.id) return; // Solo si estamos en la página de edición

  preview.id.textContent = '#' + incidenciaActual.id;
  preview.titulo.textContent = incidenciaActual.titulo || 'Sin titulo';
  preview.tipo.textContent = incidenciaActual.tipo;
  preview.tipo.className = 'preview-tag ' + incidenciaActual.tipo.toLowerCase();
  preview.ciudad.textContent = incidenciaActual.ciudad;
  preview.barrio.textContent = incidenciaActual.barrio;
  preview.direccion.textContent = incidenciaActual.direccion;
  preview.descripcion.textContent = incidenciaActual.descripcion;
  preview.usuario.textContent = incidenciaActual.usuario_id;
  preview.fecha.textContent = incidenciaActual.fecha;

  preview.estado.textContent = incidenciaActual.estado;
  preview.estado.className = 'preview-badge-estado ' + incidenciaActual.estado.toLowerCase().replace(/\s+/g, '-');

  preview.prioridad.textContent = incidenciaActual.prioridad;
  preview.prioridad.className = 'preview-badge-prioridad ' + incidenciaActual.prioridad.toLowerCase();
}

// --- Detectar cambios ---
function detectarCambios() {
  var cambios = [];
  var campos = ['titulo', 'tipo', 'estado', 'prioridad', 'ciudad', 'barrio', 'direccion', 'descripcion'];

  campos.forEach(function(campo) {
    if (incidenciaActual[campo] !== incidenciaOriginal[campo]) {
      cambios.push({
        campo: campo,
        anterior: incidenciaOriginal[campo],
        nuevo: incidenciaActual[campo]
      });
    }
  });

  return cambios;
}

function actualizarIndicadorCambios() {
  if (!cambiosIndicator) return; // Solo si estamos en la página de edición

  var cambios = detectarCambios();
  hayCambios = cambios.length > 0;
  cambiosIndicator.classList.toggle('visible', hayCambios);
}

// --- Validación ---
function validarFormulario() {
  if (!inputs.titulo) return false; // Solo si estamos en la página de edición

  var valido = true;
  var camposRequeridos = ['titulo', 'tipo', 'estado', 'prioridad', 'ciudad', 'barrio', 'direccion', 'descripcion'];

  camposRequeridos.forEach(function(campo) {
    var grupo = inputs[campo].closest('.form-group');
    if (!inputs[campo].value.trim()) {
      grupo.classList.add('error');
      valido = false;
    } else {
      grupo.classList.remove('error');
    }
  });

  return valido;
}

// --- Generar resumen ---
function generarResumenCambios() {
  if (!resumenCambios) return; // Solo si estamos en la página de edición

  var cambios = detectarCambios();
  var html = '<h4>Cambios realizados</h4>';

  cambios.forEach(function(cambio) {
    html +=
      '<div class="cambio-item">' +
        '<span class="cambio-campo">' + capitalize(cambio.campo) + '</span>' +
        '<div class="cambio-valores">' +
          '<span class="cambio-anterior">' + truncar(cambio.anterior, 15) + '</span>' +
          '<span class="cambio-flecha">-></span>' +
          '<span class="cambio-nuevo">' + truncar(cambio.nuevo, 15) + '</span>' +
        '</div>' +
      '</div>';
  });

  resumenCambios.innerHTML = html;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================
// SECCIÓN 6: FUNCIONES DE LISTADO (añadido desde ver_incidencias(1).js)
// ============================================================

// --- Renderizar grid ---
function renderizarIncidencias() {
  if (!grid) return; // Solo si estamos en la página de listado

  if (incidencias.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.add('visible');
    if (totalCount) totalCount.textContent = '0';
    return;
  }

  if (emptyState) emptyState.classList.remove('visible');
  if (totalCount) totalCount.textContent = incidencias.length;

  grid.innerHTML = incidencias.map(function(inc) {
    return `
      <div class="incidencia-card" data-id="${inc.id}">
        <div class="card-header">
          <span class="tag tipo-${inc.tipo.toLowerCase()}">${inc.tipo}</span>
          <span class="badge estado-${inc.estado.toLowerCase().replace(/\s+/g, '-')}">${inc.estado}</span>
        </div>
        <h3 class="card-titulo">${inc.titulo}</h3>
        <p class="card-descripcion">${truncar(inc.descripcion, 80)}</p>
        <div class="card-meta">
          <span>📍 ${inc.ciudad} - ${inc.barrio}</span>
          <span>📅 ${inc.fecha}</span>
        </div>
        <div class="card-footer">
          <span class="prioridad-${inc.prioridad.toLowerCase()}">${inc.prioridad}</span>
          <button class="btn-editar" onclick="editarIncidencia(${inc.id})">Editar</button>
        </div>
      </div>
    `;
  }).join('');
}

function editarIncidencia(id) {
  window.location.href = '../editarIncidencias/editarIncidencias.html?id=' + id;
}

function mostrarError(msg) {
  if (grid) grid.innerHTML = `<div class="error-state">${msg}</div>`;
  if (emptyState) emptyState.classList.remove('visible');
  if (totalCount) totalCount.textContent = '0';
}

// ============================================================
// SECCIÓN 7: FUNCIÓN HELPER COMPARTIDA
// ============================================================

function manejarRespuesta(response) {
  console.log("[PRUEBA] Status HTTP:", response.status);

  return response.text().then(function(textoCrudo) {
    console.log("[PRUEBA] Respuesta cruda:", textoCrudo.substring(0, 500));
    try {
      var data = JSON.parse(textoCrudo);
      console.log("[PRUEBA] Respuesta parseada:", data);
      if (!response.ok) {
        console.warn("[PRUEBA] ⚠️ Error HTTP:", response.status, "-", data.mensaje);
      }
      return data;
    } catch (e) {
      console.error("[PRUEBA] ❌ No es JSON válido");
      return { exito: false, mensaje: "Error servidor: " + response.status };
    }
  });
}

// ============================================================
// SECCIÓN 8: FUNCIÓN HELPER - truncar (versión mejorada de ver_incidencias(1).js)
// Incluye validación de null/undefined que faltaba en ver_incidencias.js
// ============================================================
function truncar(str, max) {
  if (!str || str.length <= max) return str;
  return str.substring(0, max) + '...';
}

// ============================================================
// SECCIÓN 9: FUNCIÓN HELPER - mostrarToast (compartida)
// ============================================================
function mostrarToast(msg, esError) {
  var t = document.getElementById('toast');
  if (!t) return; // Solo si existe el elemento toast
  t.textContent = msg;
  t.className = 'toast' + (esError ? ' error' : '');
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// ============================================================
// SECCIÓN 10: CARGAR INCIDENCIAS (añadido desde ver_incidencias(1).js - listar)
// ============================================================
function cargarIncidencias() {
  if (!grid) return; // Solo si estamos en la página de listado

  grid.innerHTML = '<div class="loading">Cargando incidencias...</div>';

  var contratoJSON = {
    accion: "ver_incidencia",
    datos: {
      filtro_ciudad: filtros.ciudad,
      filtro_estado: filtros.estado,
      filtro_tipo: filtros.tipo
    }
  };

  console.log("[PRUEBA] =========================================");
  console.log("[PRUEBA] Enviando a:", API_URL_LISTAR);
  console.log("[PRUEBA] Payload:", JSON.stringify(contratoJSON, null, 2));
  console.log("[PRUEBA] =========================================");

  fetch(API_URL_LISTAR, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(contratoJSON)
  })
  .then(manejarRespuesta)
  .then(function(respuesta) {
    console.log("[PRUEBA] exito:", respuesta.exito, "| mensaje:", respuesta.mensaje);

    if (respuesta.exito === true) {
      incidencias = respuesta.datos.incidencias;
      renderizarIncidencias();
    } else {
      mostrarError(respuesta.mensaje || 'Error al cargar incidencias');
    }
  })
  .catch(function(error) {
    console.error("[PRUEBA] Error:", error);
    mostrarError('Error de conexión. Verifica XAMPP.');
  });
}

// ============================================================
// SECCIÓN 11: EVENT LISTENERS DE EDICIÓN (ver_incidencias.js)
// ============================================================

// --- Event listeners de inputs ---
if (inputs.titulo) {
  Object.keys(inputs).forEach(function(key) {
    if (key === 'usuario_id') return;

    inputs[key].addEventListener('input', function() {
      incidenciaActual[key] = this.value;
      actualizarVistaPrevia();
      actualizarIndicadorCambios();
    });

    inputs[key].addEventListener('change', function() {
      incidenciaActual[key] = this.value;
      actualizarVistaPrevia();
      actualizarIndicadorCambios();
    });
  });
}

// --- Limpiar errores en input ---
if (inputs.titulo) {
  Object.keys(inputs).forEach(function(key) {
    inputs[key].addEventListener('input', function() {
      this.closest('.form-group').classList.remove('error');
    });
  });
}

// --- Submit del formulario de edición ---
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    if (!hayCambios) {
      mostrarToast('No has realizado ningun cambio', true);
      return;
    }

    var confirmarId = document.getElementById('confirmarId');
    if (confirmarId) confirmarId.textContent = '#' + incidenciaActual.id;
    generarResumenCambios();
    if (modalConfirmar) modalConfirmar.classList.add('active');
  });
}

// --- Cancelar edición ---
var btnCancelar = document.getElementById('btnCancelar');
if (btnCancelar) {
  btnCancelar.addEventListener('click', function() {
    if (hayCambios) {
      var confirmar = window.confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    window.location.href = '../VerIncidencias/ver_incidencias.html';
  });
}

// --- Modal: Seguir editando ---
var btnCancelarModal = document.getElementById('btnCancelarModal');
if (btnCancelarModal) {
  btnCancelarModal.addEventListener('click', function() {
    if (modalConfirmar) modalConfirmar.classList.remove('active');
  });
}

if (modalConfirmar) {
  modalConfirmar.addEventListener('click', function(e) {
    if (e.target === modalConfirmar) {
      modalConfirmar.classList.remove('active');
    }
  });
}

// --- Confirmar guardar ---
var btnConfirmarGuardar = document.getElementById('btnConfirmarGuardar');
if (btnConfirmarGuardar) {
  btnConfirmarGuardar.addEventListener('click', function() {
    var btn = this;
    btn.classList.add('loading');

    var contratoJSON = {
      accion: "editar_incidencia",
      datos: {
        incidencia_id: incidenciaActual.id,
        titulo: incidenciaActual.titulo,
        tipo: incidenciaActual.tipo,
        estado: incidenciaActual.estado,
        prioridad: incidenciaActual.prioridad,
        ciudad: incidenciaActual.ciudad,
        barrio: incidenciaActual.barrio,
        direccion: incidenciaActual.direccion,
        descripcion: incidenciaActual.descripcion
      }
    };

    console.log("[PRUEBA] =========================================");
    console.log("[PRUEBA] Enviando a:", API_URL_EDITAR);
    console.log("[PRUEBA] Payload:", JSON.stringify(contratoJSON, null, 2));
    console.log("[PRUEBA] =========================================");

    fetch(API_URL_EDITAR, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(contratoJSON)
    })
    .then(manejarRespuesta)
    .then(function(respuesta) {
      console.log("[PRUEBA] exito:", respuesta.exito, "| mensaje:", respuesta.mensaje);

      if (respuesta.exito === true) {
        incidenciaOriginal = JSON.parse(JSON.stringify(incidenciaActual));
        hayCambios = false;

        if (modalConfirmar) modalConfirmar.classList.remove('active');
        btn.classList.remove('loading');
        if (cambiosIndicator) cambiosIndicator.classList.remove('visible');

        mostrarToast('Incidencia #' + incidenciaActual.id + ' actualizada correctamente', false);

        setTimeout(function() {
          window.location.href = '../VerIncidencias/ver_incidencias.html';
        }, 1500);
      } else {
        throw new Error(respuesta.mensaje || 'Error al actualizar');
      }
    })
    .catch(function(error) {
      console.error("[PRUEBA] Error:", error);
      btn.classList.remove('loading');
      if (modalConfirmar) modalConfirmar.classList.remove('active');
      mostrarToast('Error de conexión: ' + error.message, true);
    });
  });
}

// ============================================================
// SECCIÓN 12: EVENT LISTENERS DE LISTADO (añadido desde ver_incidencias(1).js)
// ============================================================

// --- Toggle filtros ---
if (btnFiltros) {
  btnFiltros.addEventListener('click', function() {
    filtrosPanel.classList.toggle('active');
  });
}

// --- Aplicar filtros ---
var btnAplicarFiltros = document.getElementById('btnAplicarFiltros');
if (btnAplicarFiltros) {
  btnAplicarFiltros.addEventListener('click', function() {
    var filtroCiudad = document.getElementById('filtroCiudad');
    var filtroEstado = document.getElementById('filtroEstado');
    var filtroTipo = document.getElementById('filtroTipo');

    filtros.ciudad = filtroCiudad ? filtroCiudad.value : '';
    filtros.estado = filtroEstado ? filtroEstado.value : '';
    filtros.tipo = filtroTipo ? filtroTipo.value : '';

    cargarIncidencias();
    if (filtrosPanel) filtrosPanel.classList.remove('active');
  });
}

// --- Limpiar filtros ---
var btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
if (btnLimpiarFiltros) {
  btnLimpiarFiltros.addEventListener('click', function() {
    var filtroCiudad = document.getElementById('filtroCiudad');
    var filtroEstado = document.getElementById('filtroEstado');
    var filtroTipo = document.getElementById('filtroTipo');

    if (filtroCiudad) filtroCiudad.value = '';
    if (filtroEstado) filtroEstado.value = '';
    if (filtroTipo) filtroTipo.value = '';

    filtros = { ciudad: '', estado: '', tipo: '' };
    cargarIncidencias();
  });
}

// --- Redirección: Nueva Incidencia ---
var btnNuevaIncidencia = document.getElementById('btnNuevaIncidencia');
if (btnNuevaIncidencia) {
  btnNuevaIncidencia.addEventListener('click', function() {
    window.open('../formulario/formulario.html', '_blank');
  });
}

// ============================================================
// SECCIÓN 13: INICIALIZACIÓN
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar edición si estamos en la página de editar
  if (inputs.titulo) {
    inicializarFormulario();
  }

  // Inicializar listado si estamos en la página de listar
  if (grid) {
    cargarIncidencias();
  }
});