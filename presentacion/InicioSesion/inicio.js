// ============================================================
// INICIO DE SESIÓN - BonitaReporta
// Capa de Presentación | Conexión con API Dummy (Pruebas)
// ============================================================

// --- CONFIGURACIÓN DEL API ---
// Ruta absoluta para evitar problemas con carpetas duplicadas
var API_URL = '/BonitaReporta/logica/api/login.php';

// --- Muestra una notificación flotante ---
function mostrarToast(msg, esError) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (esError ? ' error' : '');
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// --- Muestra u oculta el error visual de un campo ---
function manejarError(idInput, idError, mostrar) {
  document.getElementById(idInput).classList.toggle('invalid', mostrar);
  document.getElementById(idError).classList.toggle('visible', mostrar);
}

// --- Limpia errores al escribir ---
document.getElementById('email').addEventListener('input', function() {
  if (this.value) manejarError('email', 'emailError', false);
});

document.getElementById('password').addEventListener('input', function() {
  if (this.value) manejarError('password', 'passError', false);
});

// --- Alterna visibilidad de contraseña ---
document.getElementById('togglePass').addEventListener('click', function() {
  var input = document.getElementById('password');
  var visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  document.getElementById('textoOjo').textContent = visible ? 'Ver' : 'Ocultar';
});

// ============================================================
// FUNCIÓN HELPER: Manejar respuesta del fetch
// LEE EL JSON PRIMERO, luego verifica si hubo error HTTP
// ============================================================
function manejarRespuesta(response) {
  console.log("[PRUEBA] Status HTTP:", response.status, response.statusText);

  return response.text().then(function(textoCrudo) {
    console.log("[PRUEBA] Respuesta cruda del servidor:", textoCrudo.substring(0, 500));

    try {
      var data = JSON.parse(textoCrudo);
      console.log("[PRUEBA] Respuesta parseada:", data);

      if (!response.ok) {
        console.warn("[PRUEBA] ⚠️ El servidor respondió con error HTTP:", response.status);
        console.warn("[PRUEBA] ⚠️ Mensaje del dummy:", data.mensaje);
      }

      return data;
    } catch (e) {
      console.error("[PRUEBA] ❌ La respuesta no es JSON válido");
      console.error("[PRUEBA] ❌ Texto recibido:", textoCrudo.substring(0, 200));
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
document.getElementById('btnLogin').addEventListener('click', function() {
  var email = document.getElementById('email').value.trim();
  var pass  = document.getElementById('password').value;

  // Validación local
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  var passOk  = pass.length >= 6;

  manejarError('email',    'emailError', !emailOk);
  manejarError('password', 'passError',  !passOk);

  if (!emailOk || !passOk) return;

  // Desactiva botón y muestra spinner
  var btn = this;
  btn.disabled  = true;
  btn.innerHTML = '<span class="loader"></span> Verificando...';

  // ============================================================
  // CONSTRUIR CONTRATO JSON SEGÚN GUÍA DE INTEGRACIÓN
  // ============================================================
  var contratoJSON = {
    accion: "login",
    datos: {
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
    console.log("[PRUEBA] =========================================");
    console.log("[PRUEBA] Procesando respuesta final:", respuesta);
    console.log("[PRUEBA] exito:", respuesta.exito);
    console.log("[PRUEBA] mensaje:", respuesta.mensaje);
    console.log("[PRUEBA] =========================================");

    if (respuesta.exito === true) {
      // ÉXITO: Guardar sesión y redirigir al Dashboard
      sessionStorage.setItem('br_sesion', JSON.stringify({
        nombre: respuesta.datos.usuario.nombre,
        email: respuesta.datos.usuario.email,
        token: respuesta.datos.token_sesion
      }));

      mostrarToast('¡Bienvenido, ' + respuesta.datos.usuario.nombre + '!', false);

      setTimeout(function() {
        window.location.href = '../index.html';
      }, 1200);
    } else {
      // FALLIDO: Mostrar el mensaje específico del dummy
      mostrarToast(respuesta.mensaje || 'Credenciales incorrectas', true);
      btn.disabled = false;
      btn.textContent = 'Ingresar';
    }
  })
  .catch(function(error) {
    console.error("[PRUEBA] =========================================");
    console.error("[PRUEBA] ERROR DE RED/CORS:", error);
    console.error("[PRUEBA] Tipo:", error.name);
    console.error("[PRUEBA] Mensaje:", error.message);
    console.error("[PRUEBA] =========================================");

    mostrarToast('Error de conexión. Verifica XAMPP y el archivo login.php.', true);
    btn.disabled = false;
    btn.textContent = 'Ingresar';
  });
});

// --- Botón Google (futuro) ---
document.getElementById('btnGoogle').addEventListener('click', function() {
  mostrarToast('Autenticación con Google próximamente.', false);
});

// --- Enviar con Enter ---
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('btnLogin').click();
});