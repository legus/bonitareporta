// ============================================================
// EDITAR INCIDENCIA - BonitaReporta
// Capa de Presentación | CRUD - Editar
// Conexión con API Dummy (Pruebas)
// ============================================================

// --- CONFIGURACIÓN DEL API ---
// Ruta absoluta para evitar problemas con carpetas duplicadas
var API_URL = '/BonitaReporta/logica/api/editar_incidencia.php';

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

// --- Referencias DOM ---
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

// --- Inicializar formulario ---
function inicializarFormulario() {
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
  var cambios = detectarCambios();
  hayCambios = cambios.length > 0;
  cambiosIndicator.classList.toggle('visible', hayCambios);
}

// --- Event listeners ---
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

// --- Validación ---
function validarFormulario() {
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

Object.keys(inputs).forEach(function(key) {
  inputs[key].addEventListener('input', function() {
    this.closest('.form-group').classList.remove('error');
  });
});

// --- Generar resumen ---
function generarResumenCambios() {
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

function truncar(str, max) {
  if (str.length <= max) return str;
  return str.substring(0, max) + '...';
}

// ============================================================
// SUBMIT: Enviar datos al API Dummy vía fetch()
// ============================================================
form.addEventListener('submit', function(e) {
  e.preventDefault();

  if (!validarFormulario()) return;

  if (!hayCambios) {
    mostrarToast('No has realizado ningun cambio', true);
    return;
  }

  document.getElementById('confirmarId').textContent = '#' + incidenciaActual.id;
  generarResumenCambios();
  modalConfirmar.classList.add('active');
});

// --- Cancelar edición ---
document.getElementById('btnCancelar').addEventListener('click', function() {
  if (hayCambios) {
    var confirmar = window.confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
    if (!confirmar) return;
  }
  window.location.href = '../VerIncidencias/ver_incidencias.html';
});

// --- Modal: Seguir editando ---
document.getElementById('btnCancelarModal').addEventListener('click', function() {
  modalConfirmar.classList.remove('active');
});

modalConfirmar.addEventListener('click', function(e) {
  if (e.target === modalConfirmar) {
    modalConfirmar.classList.remove('active');
  }
});

// ============================================================
// FUNCIÓN HELPER
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
// CONFIRMAR GUARDAR: Enviar al API Dummy
// ============================================================
document.getElementById('btnConfirmarGuardar').addEventListener('click', function() {
  var btn = this;
  btn.classList.add('loading');

  // ============================================================
  // CONSTRUIR CONTRATO JSON SEGÚN GUÍA DE INTEGRACIÓN
  // ============================================================
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
  console.log("[PRUEBA] Enviando a:", API_URL);
  console.log("[PRUEBA] Payload:", JSON.stringify(contratoJSON, null, 2));
  console.log("[PRUEBA] =========================================");

  // ============================================================
  // FETCH: Envío HTTP POST con JSON al Dummy PHP
  // ============================================================
  fetch(API_URL, {
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
      // ÉXITO
      incidenciaOriginal = JSON.parse(JSON.stringify(incidenciaActual));
      hayCambios = false;

      modalConfirmar.classList.remove('active');
      btn.classList.remove('loading');
      cambiosIndicator.classList.remove('visible');

      mostrarToast('Incidencia #' + incidenciaActual.id + ' actualizada correctamente', false);

      setTimeout(function() {
        window.location.href = '../VerIncidencias/ver_incidencias.html';
      }, 1500);
    } else {
      // FALLIDO
      throw new Error(respuesta.mensaje || 'Error al actualizar');
    }
  })
  .catch(function(error) {
    console.error("[PRUEBA] Error:", error);
    btn.classList.remove('loading');
    modalConfirmar.classList.remove('active');
    mostrarToast('Error de conexión: ' + error.message, true);
  });
});

// --- Toast ---
function mostrarToast(msg, esError) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (esError ? ' error' : '');
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// --- Inicializar ---
document.addEventListener('DOMContentLoaded', function() {
  inicializarFormulario();
});