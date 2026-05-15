// ============================================================
// INICIO DE SESIÓN - BonitaReporta
// Capa de Presentación | Conexión con API Dummy
// ============================================================

var API_URL = '/BonitaReporta/bonitareporta/logica/api/dummy_api.php';

function mostrarToast(msg, esError) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (esError ? ' error' : '');
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

function manejarError(idInput, idError, mostrar) {
  document.getElementById(idInput).classList.toggle('invalid', mostrar);
  document.getElementById(idError).classList.toggle('visible', mostrar);
}

document.getElementById('email').addEventListener('input', function() {
  if (this.value) manejarError('email', 'emailError', false);
});

document.getElementById('password').addEventListener('input', function() {
  if (this.value) manejarError('password', 'passError', false);
});

document.getElementById('togglePass').addEventListener('click', function() {
  var input = document.getElementById('password');
  var visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  document.getElementById('textoOjo').textContent = visible ? 'Ver' : 'Ocultar';
});

document.getElementById('btnLogin').addEventListener('click', function() {
  var email = document.getElementById('email').value.trim();
  var pass  = document.getElementById('password').value;

  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  var passOk  = pass.length >= 6;

  manejarError('email',    'emailError', !emailOk);
  manejarError('password', 'passError',  !passOk);

  if (!emailOk || !passOk) {
    mostrarToast('Corrige los campos marcados.', true);
    return;
  }

  var btn = this;
  btn.disabled = true;
  btn.innerHTML = '<span class="loader"></span> Verificando...';

  var contratoJSON = {
    accion: "login",
    datos: {
      email: email,
      password: pass
    }
  };

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(contratoJSON)
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(respuesta) {
    if (respuesta.exito === true) {
      mostrarToast('¡Bienvenido, ' + respuesta.datos.usuario.nombre + '!', false);
      setTimeout(function() {
        window.location.href = '../index.html';
      }, 1200);
    } else {
      mostrarToast(respuesta.mensaje || 'Credenciales incorrectas', true);
      btn.disabled = false;
      btn.textContent = 'Ingresar';
    }
  })
  .catch(function(error) {
    mostrarToast('Error de conexión. Verifica XAMPP.', true);
    btn.disabled = false;
    btn.textContent = 'Ingresar';
  });
});

document.getElementById('btnGoogle').addEventListener('click', function() {
  mostrarToast('Autenticación con Google próximamente.', false);
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('btnLogin').click();
});