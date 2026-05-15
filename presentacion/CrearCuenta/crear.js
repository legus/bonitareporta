// ============================================================
// CREAR CUENTA - BonitaReporta
// Capa de Presentación | Conexión con API Dummy (Pruebas)
// ============================================================

// --- CONFIGURACIÓN DEL API ---
// Ruta absoluta para evitar problemas con carpetas duplicadas
var API_URL = '/BonitaReporta/logica/api/registro_usuario.php';

// --- Muestra una notificación flotante ---
function mostrarToast(msg, esError) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (esError ? ' error' : '');
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// --- Muestra u oculta el error visual ---
function manejarError(idInput, idError, mostrar) {
  document.getElementById(idInput).classList.toggle('invalid', mostrar);
  document.getElementById(idError).classList.toggle('visible', mostrar);
}

// --- Limpia errores al escribir ---
['nombre','apellido','email','password','confirmPassword'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', function() {
      var errorId = id + 'Error';
      if (id === 'password') errorId = 'passError';
      if (id === 'confirmPassword') errorId = 'confirmError';
      manejarError(id, errorId, false);
      if (id === 'password') validarRequisitosVisuales(this.value);
    });
  }
});

// --- Validación visual de contraseña ---
function validarRequisitosVisuales(pass) {
  document.getElementById('reqLen').classList.toggle('valid', pass.length >= 6);
  document.getElementById('reqNum').classList.toggle('valid', /\d/.test(pass));
  document.getElementById('reqMay').classList.toggle('valid', /[A-Z]/.test(pass));
}

// --- Alternar visibilidad de contraseña ---
function togglePass(inputId, textoId) {
  var input = document.getElementById(inputId);
  var visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  document.getElementById(textoId).textContent = visible ? 'Ver' : 'Ocultar';
}

document.getElementById('togglePass').addEventListener('click', function() {
  togglePass('password', 'textoOjo');
});

document.getElementById('toggleConfirmPass').addEventListener('click', function() {
  togglePass('confirmPassword', 'textoOjoConfirm');
});

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passValida(pass) {
  return pass.length >= 6 && /\d/.test(pass) && /[A-Z]/.test(pass);
}

// ============================================================
// FUNCIÓN HELPER: Manejar respuesta del fetch
// ============================================================
function manejarRespuesta(response) {
  console.log("[PRUEBA] Status HTTP:", response.status, response.statusText);

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
      console.error("[PRUEBA] ❌ No es JSON válido:", textoCrudo.substring(0, 200));
      return { 
        exito: false, 
        mensaje: "Respuesta no válida del servidor (status: " + response.status + ")" 
      };
    }
  });
}

// ============================================================
// LÓGICA PRINCIPAL: Enviar datos al API Dummy vía fetch()
// ============================================================
document.getElementById('btnCrear').addEventListener('click', function() {
  var nombre   = document.getElementById('nombre').value.trim();
  var apellido = document.getElementById('apellido').value.trim();
  var email    = document.getElementById('email').value.trim();
  var pass     = document.getElementById('password').value;
  var confirm  = document.getElementById('confirmPassword').value;

  // Validaciones locales
  var nombreOk   = nombre.length > 0;
  var apellidoOk = apellido.length > 0;
  var emailOk    = emailValido(email);
  var passOk     = passValida(pass);
  var confirmOk  = pass === confirm && pass.length > 0;

  manejarError('nombre',   'nombreError',   !nombreOk);
  manejarError('apellido', 'apellidoError', !apellidoOk);
  manejarError('email',    'emailError',    !emailOk);
  manejarError('password', 'passError',     !passOk);
  manejarError('confirmPassword', 'confirmError', !confirmOk);

  if (!nombreOk || !apellidoOk || !emailOk || !passOk || !confirmOk) {
    mostrarToast('Corrige los campos marcados.', true);
    return;
  }

  // Desactiva botón y muestra spinner
  var btn = this;
  btn.disabled = true;
  btn.innerHTML = '<span class="loader"></span> Creando cuenta...';

  // ============================================================
  // CONSTRUIR CONTRATO JSON SEGÚN GUÍA DE INTEGRACIÓN
  // ============================================================
  var contratoJSON = {
    accion: "registro_usuario",
    datos: {
      nombre: nombre,
      apellido: apellido,
      email: email,
      password: pass
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
      // ÉXITO: Limpiar formulario y mostrar mensaje de confirmación
      mostrarToast('¡Cuenta creada! ID: ' + respuesta.datos.usuario_id, false);

      setTimeout(function() {
        // Redirige al inicio de sesión
        window.location.href = '../InicioSesion/inicio.html';
      }, 1500);
    } else {
      // FALLIDO: Notificar al ciudadano que el registro no pudo guardarse
      mostrarToast(respuesta.mensaje || 'No se pudo crear la cuenta.', true);
      btn.disabled = false;
      btn.textContent = 'Crear cuenta';
    }
  })
  .catch(function(error) {
    console.error("[PRUEBA] ERROR DE RED:", error);
    mostrarToast('Error de conexión. Verifica XAMPP.', true);
    btn.disabled = false;
    btn.textContent = 'Crear cuenta';
  });
});

// --- Botón Google (futuro) ---
document.getElementById('btnGoogle').addEventListener('click', function() {
  mostrarToast('Registro con Google próximamente.', false);
});

// --- Enviar con Enter ---
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('btnCrear').click();
});