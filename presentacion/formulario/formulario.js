// ============================================================
// FORMULARIO REPORTE - BonitaReporta
// Capa de Presentación | Conexión con API Dummy (Pruebas)
// ============================================================

'use strict';

// --- CONFIGURACIÓN DEL API ---
// Ruta absoluta para evitar problemas con carpetas duplicadas
var API_URL = '/BonitaReporta/logica/api/crear_incidencia.php';

var form = document.getElementById('reportForm');
var formCard = document.getElementById('formCard');
var responseCard = document.getElementById('responseCard');
var btnSubmit = document.getElementById('btnSubmit');
var btnNew = document.getElementById('btnNew');

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
// FUNCIÓN HELPER: Manejar respuesta del fetch
// LEE EL JSON PRIMERO, luego verifica si hubo error HTTP
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
// LÓGICA PRINCIPAL: Enviar datos al API Dummy vía fetch()
// ============================================================
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm()) return;

    btnSubmit.classList.add('loading');

    // Obtener datos del formulario
    var formData = new FormData(form);
    var data = Object.fromEntries(formData);

    // ============================================================
    // CONSTRUIR CONTRATO JSON SEGÚN GUÍA DE INTEGRACIÓN
    // ============================================================
    var contratoJSON = {
        accion: "crear_incidencia",
        datos: {
            titulo: data.titulo,
            tipo: data.tipo,
            zona: data.zona,
            barrio: data.barrio,
            direccion: data.direccion,
            descripcion: data.descripcion,
            usuario_id: parseInt(data.usuario_id) || 0
        }
    };

    console.log("[PRUEBA] =========================================");
    console.log("[PRUEBA] Enviando a:", API_URL);
    console.log("[PRUEBA] Payload JSON:", JSON.stringify(contratoJSON, null, 2));
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

        // ============================================================
        // LÓGICA DE RESPUESTA Y NAVEGACIÓN (Según guía de integración)
        // ============================================================
        if (respuesta.exito === true) {
            // ÉXITO: Mostrar ticket con datos de la respuesta
            document.getElementById('ticketId').textContent = 'Incidencia #' + respuesta.datos.incidencia_id;
            document.getElementById('estadoValue').textContent = respuesta.datos.estado;
            document.getElementById('prioridadValue').textContent = respuesta.datos.prioridad;
            document.getElementById('sumTitulo').textContent = data.titulo;
            document.getElementById('sumTipo').textContent = data.tipo;
            document.getElementById('sumZona').textContent = data.zona + ' / ' + data.barrio;
            document.getElementById('sumDireccion').textContent = data.direccion;
            document.getElementById('sumDescripcion').textContent = data.descripcion;

            // Cambiar vistas
            formCard.style.display = 'none';
            responseCard.classList.add('show');
            btnSubmit.classList.remove('loading');

            // Scroll al ticket
            responseCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // FALLIDO: Notificar que el reporte no pudo guardarse
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
    responseCard.classList.remove('show');
    formCard.style.display = 'block';
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Volver a prellenar con ejemplo
    Object.keys(datosEjemplo).forEach(function(key) {
        var el = document.getElementById(key);
        if (el) el.value = datosEjemplo[key];
    });
});