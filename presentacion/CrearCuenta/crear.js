// ============================================================
// CREAR CUENTA - BonitaReporta
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

document.getElementById('btnCrear').addEventListener('click', function() {
  var nombre   = document.getElementById('nombre').value.trim();
  var apellido = document.getElementById('apellido').value.trim();
  var email    = document.getElementById('email').value.trim();
  var pass     = document.getElementById('password').value;
  var confirm  = document.getElementById('confirmPassword').value;

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

  var btn = this;
  btn.disabled = true;
  btn.innerHTML = '<span class="loader"></span> Creando cuenta...';

  var contratoJSON = {
    accion: "registro_usuario",
    datos: {
      nombre: nombre,
      apellido: apellido,
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
      mostrarToast('¡Cuenta creada! ID: ' + respuesta.datos.usuario_id, false);
      setTimeout(function() {
        window.location.href = '../InicioSesion/inicio.html';
      }, 1500);
    } else {
      mostrarToast(respuesta.mensaje || 'No se pudo crear la cuenta.', true);
      btn.disabled = false;
      btn.textContent = 'Crear cuenta';
    }
  })

  .catch(function(error) {
    mostrarToast('Error de conexión. Verifica XAMPP.', true);
    btn.disabled = false;
    btn.textContent = 'Crear cuenta';
  });
});

document.getElementById('btnGoogle').addEventListener('click', function() {
  mostrarToast('Registro con Google próximamente.', false);
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('btnCrear').click();
});