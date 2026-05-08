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
['nombre','apellido','email','password','confirmPassword'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', function() {
      // Oculta el error específico de este campo
      var errorId = id + 'Error';
      if (id === 'password') errorId = 'passError';
      if (id === 'confirmPassword') errorId = 'confirmError';
      manejarError(id, errorId, false);

      // Si es contraseña, actualiza requisitos visuales
      if (id === 'password') validarRequisitosVisuales(this.value);
    });
  }
});

// --- Validación visual de requisitos de contraseña ---
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

// --- Validar email ---
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- Validar contraseña ---
function passValida(pass) {
  return pass.length >= 6 && /\d/.test(pass) && /[A-Z]/.test(pass);
}

// --- Lógica principal: Crear cuenta ---
document.getElementById('btnCrear').addEventListener('click', function() {
  var nombre   = document.getElementById('nombre').value.trim();
  var apellido = document.getElementById('apellido').value.trim();
  var email    = document.getElementById('email').value.trim();
  var pass     = document.getElementById('password').value;
  var confirm  = document.getElementById('confirmPassword').value;

  // Validaciones individuales
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

  setTimeout(function() {
    // Lee usuarios existentes
    var usuarios = JSON.parse(localStorage.getItem('br_usuarios') || '[]');

    // Verifica si el correo ya está registrado
    var existe = usuarios.some(function(u) { return u.email === email; });
    if (existe) {
      mostrarToast('Este correo ya está registrado. Inicia sesión.', true);
      btn.disabled = false;
      btn.textContent = 'Crear cuenta';
      return;
    }

    // Crea nuevo usuario
    var nuevoUsuario = {
      nombre: nombre + ' ' + apellido,
      email: email,
      password: pass,
      fecha: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('br_usuarios', JSON.stringify(usuarios));

    // Éxito
    mostrarToast('¡Cuenta creada exitosamente!', false);

    setTimeout(function() {
      // Redirige al inicio de sesión
      window.location.href = '../InicioSesion/inicio.html';
    }, 1500);

  }, 1200);
});

// --- Botón Google (futuro) ---
document.getElementById('btnGoogle').addEventListener('click', function() {
  mostrarToast('Registro con Google próximamente.', false);
});

// --- Enviar con Enter ---
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('btnCrear').click();
});