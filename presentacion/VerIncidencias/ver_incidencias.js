// ============================================================
// LISTADO DE INCIDENCIAS - BonitaReporta
// Capa de Presentacion | CRUD - Leer (Listado)
// Efecto cortina al hover + Filtros + Modal eliminar
// ============================================================

// --- Datos de ejemplo (simulando respuesta de API) ---
var incidencias = [
  {
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
    prioridad: 'Media',
    lat: 7.12,
    lng: -73.11
  },
  {
    id: 502,
    titulo: 'Hueco en la Via',
    tipo: 'Vialidad',
    ciudad: 'Floridablanca',
    barrio: 'Cacique',
    direccion: 'Calle 56 # 23-45, frente al supermercado',
    descripcion: 'Hueco muy grande en la calzada que dana los vehiculos. Lleva aproximadamente 3 semanas sin reparacion. Peligroso para motociclistas.',
    usuario_id: 15,
    fecha: '10 may 2026',
    estado: 'En Proceso',
    prioridad: 'Alta',
    lat: 7.07,
    lng: -73.09
  },
  {
    id: 503,
    titulo: 'Acumulacion de Basura',
    tipo: 'Basura',
    ciudad: 'Giron',
    barrio: 'San Miguel',
    direccion: 'Carrera 18 # 34-20, esquina de la iglesia',
    descripcion: 'Contenedores de basura desbordados desde hace 5 dias. Mal olor y presencia de roedores. Se necesita recoleccion urgente.',
    usuario_id: 8,
    fecha: '08 may 2026',
    estado: 'Pendiente',
    prioridad: 'Media',
    lat: 7.06,
    lng: -73.17
  },
  {
    id: 504,
    titulo: 'Fuga de Agua',
    tipo: 'Agua',
    ciudad: 'Piedecuesta',
    barrio: 'El Bosque',
    direccion: 'Calle 10 # 15-30, diagonal al colegio',
    descripcion: 'Fuga de agua potable visible en la acera desde hace una semana. Se esta desperdiciando mucha agua y se esta formando un charco constante.',
    usuario_id: 22,
    fecha: '05 may 2026',
    estado: 'Resuelto',
    prioridad: 'Baja',
    lat: 6.99,
    lng: -73.05
  },
  {
    id: 505,
    titulo: 'Camaras de Seguridad',
    tipo: 'Seguridad',
    ciudad: 'Bucaramanga',
    barrio: 'Cabecera',
    direccion: 'Carrera 33 # 45-67, parque de la Cabecera',
    descripcion: 'Solicitud de instalacion de camaras de seguridad en el parque. Ultimamente se han reportado robos en la zona durante la noche.',
    usuario_id: 31,
    fecha: '01 may 2026',
    estado: 'En Proceso',
    prioridad: 'Alta',
    lat: 7.11,
    lng: -73.12
  }
];

// --- Iconos SVG por tipo ---
var iconosTipo = {
  'Alumbrado': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>',
  'Vialidad': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.495-1.032-1.11-1.032H8.25c-.615 0-1.11.464-1.11 1.032v.958m7.5 11.177H14.25m-7.5 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5h-11.25" /></svg>',
  'Basura': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>',
  'Agua': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  'Seguridad': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c-.001 5.051 3.855 9.341 9 9.918 5.145-.577 9.001-4.867 9-9.918 0-1.287-.206-2.53-.598-3.735A11.959 11.959 0 0112 2.659c-1.287 0-2.53.206-3.735.598" /></svg>'
};

// --- Renderizar listado ---
function renderizarListado(datos) {
  var contenedor = document.getElementById('listadoIncidencias');
  contenedor.innerHTML = '';

  datos.forEach(function(inc) {
    var item = document.createElement('div');
    item.className = 'incidencia-item';
    item.setAttribute('data-id', inc.id);

    var estadoClass = inc.estado.toLowerCase().replace(/\s+/g, '-');
    var tipoClass = inc.tipo.toLowerCase();

    item.innerHTML = 
      '<div class="incidente-compacto">' +
        '<div class="incidente-icono ' + tipoClass + '">' +
          iconosTipo[inc.tipo] +
        '</div>' +
        '<div class="incidente-info">' +
          '<div class="incidente-titulo">' + inc.titulo + '</div>' +
          '<div class="incidente-meta">' +
            '<span>' + inc.ciudad + ' - ' + inc.barrio + '</span>' +
            '<span class="badge-mini ' + estadoClass + '">' + inc.estado + '</span>' +
            '<span>#' + inc.id + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="incidente-flecha">' +
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>' +
        '</div>' +
      '</div>' +
      '<div class="incidente-detalle">' +
        '<div class="detalle-grid">' +
          '<div class="detalle-item"><span class="detalle-label">Tipo</span><span class="detalle-valor">' + inc.tipo + '</span></div>' +
          '<div class="detalle-item"><span class="detalle-label">Prioridad</span><span class="detalle-valor">' + inc.prioridad + '</span></div>' +
          '<div class="detalle-item"><span class="detalle-label">Direccion</span><span class="detalle-valor">' + inc.direccion + '</span></div>' +
          '<div class="detalle-item"><span class="detalle-label">Fecha</span><span class="detalle-valor">' + inc.fecha + '</span></div>' +
        '</div>' +
        '<div class="detalle-descripcion">' +
          '<span class="detalle-label">Descripcion</span>' +
          '<p>' + inc.descripcion + '</p>' +
        '</div>' +
        '<div class="detalle-acciones">' +
          '<button class="btn-detalle btn-detalle-editar" onclick="editarIncidencia(' + inc.id + ')">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>' +
            'Editar' +
          '</button>' +
          '<button class="btn-detalle btn-detalle-eliminar" onclick="confirmarEliminar(' + inc.id + ')">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>' +
            'Eliminar' +
          '</button>' +
        '</div>' +
      '</div>';

    contenedor.appendChild(item);
  });

  // Actualizar contador
  document.getElementById('contadorTexto').textContent = 'Mostrando ' + datos.length + ' incidencia' + (datos.length !== 1 ? 's' : '');
}

// --- Filtrar incidencias ---
function filtrarIncidencias() {
  var ciudad = document.getElementById('filtroCiudad').value;
  var estado = document.getElementById('filtroEstado').value;
  var tipo = document.getElementById('filtroTipo').value;

  var filtradas = incidencias.filter(function(inc) {
    return (!ciudad || inc.ciudad === ciudad) &&
           (!estado || inc.estado === estado) &&
           (!tipo || inc.tipo === tipo);
  });

  renderizarListado(filtradas);
}

// --- Eventos de filtros ---
document.getElementById('filtroCiudad').addEventListener('change', filtrarIncidencias);
document.getElementById('filtroEstado').addEventListener('change', filtrarIncidencias);
document.getElementById('filtroTipo').addEventListener('change', filtrarIncidencias);

// --- Boton nueva incidencia ---
document.getElementById('btnNuevaIncidencia').addEventListener('click', function() {
  window.location.href = '../formulario/formulario.html';
});

// --- Toast ---
function mostrarToast(msg, esError) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (esError ? ' error' : '');
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// --- Editar incidencia ---
var idEditar = null;
var modalEditar = document.getElementById('modalEditar');

function editarIncidencia(id) {
  idEditar = id;
  document.getElementById('modalEditarId').textContent = '#' + id;
  modalEditar.classList.add('active');
}

document.getElementById('btnCancelarEditar').addEventListener('click', function() {
  modalEditar.classList.remove('active');
  idEditar = null;
});

modalEditar.addEventListener('click', function(e) {
  if (e.target === modalEditar) {
    modalEditar.classList.remove('active');
    idEditar = null;
  }
});

document.getElementById('btnConfirmarEditar').addEventListener('click', function() {
  if (idEditar) {
    window.location.href = '../editarIncidencias/editarIncidencias.html?id=' + idEditar;
  }
});

// --- Eliminar incidencia ---
var idEliminar = null;
var modalEliminar = document.getElementById('modalEliminar');

function confirmarEliminar(id) {
  idEliminar = id;
  document.getElementById('modalIdIncidencia').textContent = '#' + id;
  modalEliminar.classList.add('active');
}

document.getElementById('btnCancelarEliminar').addEventListener('click', function() {
  modalEliminar.classList.remove('active');
  idEliminar = null;
});

modalEliminar.addEventListener('click', function(e) {
  if (e.target === modalEliminar) {
    modalEliminar.classList.remove('active');
    idEliminar = null;
  }
});

document.getElementById('btnConfirmarEliminar').addEventListener('click', function() {
  if (idEliminar) {
    // Simular eliminacion
    var btn = this;
    btn.textContent = 'Eliminando...';
    btn.disabled = true;

    setTimeout(function() {
      incidencias = incidencias.filter(function(inc) { return inc.id !== idEliminar; });
      filtrarIncidencias();
      mostrarToast('Incidencia #' + idEliminar + ' eliminada correctamente', false);

      modalEliminar.classList.remove('active');
      btn.textContent = 'Eliminar';
      btn.disabled = false;
      idEliminar = null;
    }, 800);
  }
});

// --- Inicializar ---
document.addEventListener('DOMContentLoaded', function() {
  renderizarListado(incidencias);
});