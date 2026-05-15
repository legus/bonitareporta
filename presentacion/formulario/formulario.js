// ============================================================
// FORMULARIO REPORTE - BonitaReporta
// Capa de Presentación | Conexión con API Dummy (Pruebas)
// ============================================================

'use strict';

// --- CONFIGURACIÓN DEL API ---
var API_URL = '/BonitaReporta/logica/api/crear_incidencia.php';

var form = document.getElementById('reportForm');
var formCard = document.getElementById('formCard');
var responseCard = document.getElementById('responseCard');
var btnSubmit = document.getElementById('btnSubmit');
var btnNew = document.getElementById('btnNew');

// --- ELEMENTOS DE GEOLOCALIZACIÓN ---
var btnGeo = document.getElementById('btnGeo');
var geoStatus = document.getElementById('geoStatus');
var geoCoords = document.getElementById('geoCoords');
var latInput = document.getElementById('latitud');
var lngInput = document.getElementById('longitud');
var latValue = document.getElementById('latValue');
var lngValue = document.getElementById('lngValue');

// --- ELEMENTOS DE FECHA Y HORA - UNA SOLA VARIABLE ---
var fechaHoraValor = document.getElementById('fechaHoraValor');
var btnRefreshDatetime = document.getElementById('btnRefreshDatetime');
var fechaHoraInput = document.getElementById('fecha_hora_registro'); // ← UNA SOLA VARIABLE

// Datos de ejemplo prellenados
var datosEjemplo = {
    titulo: 'Falla de Alumbrado',
    tipo: 'Alumbrado',
    descripcion: 'Poste parpadea toda la noche',
    zona: 'Norte',
    barrio: 'La Esperanza',
    usuario_id: '12',
    direccion: 'Carrera 27 # 45-12, cerca al parque principal'
};

// Prellenar formulario
Object.keys(datosEjemplo).forEach(function(key) {
    var el = document.getElementById(key);
    if (el) el.value = datosEjemplo[key];
});

// ============================================================
// FECHA Y HORA - UNA SOLA VARIABLE
// ============================================================

function actualizarFechaHora() {
    var ahora = new Date();
    
    // Formato dd/mm/aa
    var dia = String(ahora.getDate()).padStart(2, '0');
    var mes = String(ahora.getMonth() + 1).padStart(2, '0');
    var anio = String(ahora.getFullYear()).slice(-2);
    var fechaStr = dia + '/' + mes + '/' + anio;
    
    // Formato hh:mm (24h)
    var horas = String(ahora.getHours()).padStart(2, '0');
    var minutos = String(ahora.getMinutes()).padStart(2, '0');
    var horaStr = horas + ':' + minutos;
    
    // UNA SOLA VARIABLE COMBINADA: "dd/mm/aa hh:mm"
    var fechaHoraCompleta = fechaStr + ' ' + horaStr;
    
    // Mostrar en UI
    fechaHoraValor.textContent = fechaHoraCompleta;
    
    // Guardar en input oculto (UNA SOLA VARIABLE)
    fechaHoraInput.value = fechaHoraCompleta;
    
    console.log('[FECHA] Actualizado:', fechaHoraCompleta);
}

// Actualizar al cargar la página
actualizarFechaHora();

// Actualizar cada minuto para mantenerlo fresco
setInterval(actualizarFechaHora, 60000);

// Botón de actualizar manual
if (btnRefreshDatetime) {
    btnRefreshDatetime.addEventListener('click', function() {
        var icon = this.querySelector('svg');
        icon.style.animation = 'spin 0.5s ease';
        setTimeout(function() { icon.style.animation = ''; }, 500);
        actualizarFechaHora();
    });
}

// Validación en tiempo real
var inputs = form.querySelectorAll('input, select, textarea');
inputs.forEach(function(input) {
    input.addEventListener('blur', function() { validateField(input); });
    input.addEventListener('input', function() {
        if (input.parentElement.classList.contains('error')) {
            validateField(input);
        }
    });
});

function validateField(field) {
    var group = field.closest('.form-group');
    if (!field.value.trim()) {
        group.classList.add('error');
        return false;
    } else {
        group.classList.remove('error');
        return true;
    }
}

function validateForm() {
    var valid = true;
    inputs.forEach(function(input) {
        if (!validateField(input)) valid = false;
    });
    return valid;
}

// ============================================================
// GEOLOCALIZACIÓN
// ============================================================

function obtenerUbicacion() {
    if (!navigator.geolocation) {
        mostrarEstadoGeo('Tu navegador no soporta geolocalización', 'error');
        return;
    }

    btnGeo.classList.add('loading');
    mostrarEstadoGeo('Obteniendo ubicación...', '');

    navigator.geolocation.getCurrentPosition(
        function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var precision = position.coords.accuracy;

            latInput.value = lat;
            lngInput.value = lng;

            latValue.textContent = lat.toFixed(6);
            lngValue.textContent = lng.toFixed(6);
            geoCoords.style.display = 'grid';

            btnGeo.classList.remove('loading', 'error');
            btnGeo.classList.add('success');
            btnGeo.querySelector('.btn-geo-text').textContent = 'Ubicación obtenida';

            var precisionText = precision < 50 ? 'Alta precisión' : 
                               precision < 200 ? 'Precisión media' : 'Precisión baja';
            mostrarEstadoGeo(precisionText + ' (±' + Math.round(precision) + 'm)', 'success');

            console.log('[GEO] Ubicación obtenida:', lat, lng, 'Precisión:', precision + 'm');
        },
        function(error) {
            btnGeo.classList.remove('loading', 'success');
            btnGeo.classList.add('error');
            
            var mensaje = 'Error al obtener ubicación';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    mensaje = 'Permiso denegado. Activa la ubicación en tu navegador.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensaje = 'Ubicación no disponible. Intenta de nuevo.';
                    break;
                case error.TIMEOUT:
                    mensaje = 'Tiempo de espera agotado. Intenta de nuevo.';
                    break;
            }
            
            mostrarEstadoGeo(mensaje, 'error');
            console.error('[GEO] Error:', error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function mostrarEstadoGeo(mensaje, tipo) {
    geoStatus.textContent = mensaje;
    geoStatus.className = 'geo-status' + (tipo ? ' ' + tipo : '');
}

if (btnGeo) {
    btnGeo.addEventListener('click', obtenerUbicacion);
}

// ============================================================
// FUNCIÓN HELPER: Manejar respuesta del fetch
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
// LÓGICA PRINCIPAL: Enviar datos al API
// ============================================================
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm()) return;

    // Actualizar fecha/hora justo antes de enviar para máxima precisión
    actualizarFechaHora();

    btnSubmit.classList.add('loading');

    var formData = new FormData(form);
    var data = Object.fromEntries(formData);

    var contratoJSON = {
        accion: "crear_incidencia",
        datos: {
            titulo: data.titulo,
            tipo: data.tipo,
            zona: data.zona,
            barrio: data.barrio,
            direccion: data.direccion,
            descripcion: data.descripcion,
            usuario_id: parseInt(data.usuario_id) || 0,
            latitud: data.latitud ? parseFloat(data.latitud) : null,
            longitud: data.longitud ? parseFloat(data.longitud) : null,
            // UNA SOLA VARIABLE COMBINADA
            fecha_hora_registro: data.fecha_hora_registro  // "15/05/26 16:56"
        }
    };

    console.log("[PRUEBA] =========================================");
    console.log("[PRUEBA] Enviando a:", API_URL);
    console.log("[PRUEBA] Payload JSON:", JSON.stringify(contratoJSON, null, 2));
    console.log("[PRUEBA] =========================================");

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
            document.getElementById('ticketId').textContent = 'Incidencia #' + respuesta.datos.incidencia_id;
            document.getElementById('estadoValue').textContent = respuesta.datos.estado;
            document.getElementById('prioridadValue').textContent = respuesta.datos.prioridad;
            document.getElementById('sumTitulo').textContent = data.titulo;
            document.getElementById('sumTipo').textContent = data.tipo;
            document.getElementById('sumZona').textContent = data.zona + ' / ' + data.barrio;
            document.getElementById('sumDireccion').textContent = data.direccion;

            // Coordenadas
            var sumGeoRow = document.getElementById('sumGeoRow');
            var sumGeo = document.getElementById('sumGeo');
            if (data.latitud && data.longitud) {
                sumGeo.textContent = data.latitud + ', ' + data.longitud;
                sumGeoRow.style.display = 'flex';
            } else {
                sumGeoRow.style.display = 'none';
            }

            // UNA SOLA VARIABLE EN EL RESUMEN
            document.getElementById('sumFechaHora').textContent = data.fecha_hora_registro || '--';

            document.getElementById('sumDescripcion').textContent = data.descripcion;

            formCard.style.display = 'none';
            responseCard.classList.add('show');
            btnSubmit.classList.remove('loading');

            responseCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            btnSubmit.classList.remove('loading');
            alert(respuesta.mensaje || 'No se pudo guardar el reporte. Intente nuevamente.');
        }
    })
    .catch(function(error) {
        console.error("[PRUEBA] ERROR DE RED/CORS:", error);
        btnSubmit.classList.remove('loading');
        alert('Error de conexión. Verifica XAMPP y que el archivo PHP exista.');
    });
});

btnNew.addEventListener('click', function() {
    form.reset();
    
    // Resetear geolocalización
    latInput.value = '';
    lngInput.value = '';
    geoCoords.style.display = 'none';
    btnGeo.classList.remove('success', 'error');
    btnGeo.querySelector('.btn-geo-text').textContent = 'Obtener mi ubicación';
    mostrarEstadoGeo('', '');
    
    // Resetear fecha/hora (se actualiza automáticamente)
    actualizarFechaHora();
    
    responseCard.classList.remove('show');
    formCard.style.display = 'block';
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    Object.keys(datosEjemplo).forEach(function(key) {
        var el = document.getElementById(key);
        if (el) el.value = datosEjemplo[key];
    });
});