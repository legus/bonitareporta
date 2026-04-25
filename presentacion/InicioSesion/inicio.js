// --- Muestra una notificación flotante en la parte inferior ---
// esError: true = borde rojo, false = borde verde
function mostrarToast(msg, esError) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (esError ? ' error' : '');
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000); // Se oculta a los 3s
}
 
// --- Muestra u oculta el error visual de un campo ---
// mostrar: true = pone borde rojo + texto, false = los quita
function manejarError(idInput, idError, mostrar) {
  document.getElementById(idInput).classList.toggle('invalid', mostrar);
  document.getElementById(idError).classList.toggle('visible', mostrar);
}
 
// --- Limpia el error del correo al escribir ---
document.getElementById('email').addEventListener('input', function() {
  if (this.value) manejarError('email', 'emailError', false);
});
 
// --- Limpia el error de la contraseña al escribir ---
document.getElementById('password').addEventListener('input', function() {
  if (this.value) manejarError('password', 'passError', false);
});
 
// --- Alterna entre mostrar y ocultar la contraseña ---
document.getElementById('togglePass').addEventListener('click', function() {
  var input = document.getElementById('password');
  var visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';                       // Cambia el tipo del input
  document.getElementById('textoOjo').textContent = visible ? 'Ver' : 'Ocultar'; // Cambia el texto
});
 
// --- Lógica principal del botón Ingresar ---
document.getElementById('btnLogin').addEventListener('click', function() {
  var email = document.getElementById('email').value.trim();
  var pass  = document.getElementById('password').value;
 
  // Valida correo con expresión regular y contraseña mínimo 6 caracteres
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  var passOk  = pass.length >= 6;
 
  manejarError('email',    'emailError', !emailOk);
  manejarError('password', 'passError',  !passOk);
 
  if (!emailOk || !passOk) return; // Si hay errores, se detiene
 
  // Desactiva el botón y muestra spinner mientras busca el usuario
  var btn = this;
  btn.disabled  = true;
  btn.innerHTML = '<span class="loader"></span> Verificando...';
 
  setTimeout(function() {
    // Busca en localStorage el usuario registrado por CrearCuenta
    var usuarios = JSON.parse(localStorage.getItem('br_usuarios') || '[]');
    var usuario  = usuarios.find(function(u) { return u.email === email && u.password === pass; });
 
    if (usuario) {
      // Guarda la sesión y redirige al inicio
      sessionStorage.setItem('br_sesion', JSON.stringify({ nombre: usuario.nombre, email: usuario.email }));
      mostrarToast('¡Bienvenido, ' + usuario.nombre + '!', false);
      setTimeout(function() { window.location.href = '../index.html'; }, 1200);
    } else {
      // Credenciales incorrectas: reactiva el botón
      mostrarToast('Correo o contraseña incorrectos.', true);
      btn.disabled = false;
      btn.textContent = 'Ingresar';
    }
  }, 1200);
});
 
// --- Botón Google (funcionalidad futura) ---
document.getElementById('btnGoogle').addEventListener('click', function() {
  mostrarToast('Autenticación con Google próximamente.', false);
});
 
// --- Permite enviar el formulario presionando Enter ---
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('btnLogin').click();
});