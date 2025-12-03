// js/login.js
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePw = document.getElementById('togglePw');
const avatars = Array.from(document.querySelectorAll('.avatar'));
const successSplash = document.getElementById('successSplash');
const logoImg = document.getElementById('logoImg');
const guestBtn = document.getElementById('guestBtn');

// defaults
const DEFAULT_LOGO = 'assets/img/logo.png';
const DEFAULT_AVATAR = '1.png';
logoImg.src = DEFAULT_LOGO;

let selectedAvatar = null;

// Toggle mostrar/ocultar contraseña
togglePw.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePw.textContent = '🙈';
  } else {
    passwordInput.type = 'password';
    togglePw.textContent = '👁️';
  }
});

// seleccionar avatar
avatars.forEach(btn => {
  btn.addEventListener('click', () => {
    avatars.forEach(a => a.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    selectedAvatar = btn.dataset.img;
  });
});

// jugar como invitado
guestBtn.addEventListener('click', () => {
  const guestName = 'Invitado_' + Math.floor(Math.random()*9000 + 1000);
  const guestEmail = `guest${Date.now()%10000}@local.game`;
  saveAndContinue(guestEmail, guestName, selectedAvatar || DEFAULT_AVATAR);
});

// submit del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!validateEmail(email)) return showFieldError(emailInput, 'Correo inválido');
  if (username.length < 2) return showFieldError(usernameInput, 'Nombre muy corto');
  if (password.length < 4) return showFieldError(passwordInput, 'Contraseña mínima 4 caracteres');

  saveAndContinue(email, username, selectedAvatar || DEFAULT_AVATAR);
});

function showFieldError(inputEl, message) {
  const original = inputEl.placeholder;
  inputEl.value = '';
  inputEl.placeholder = message;
  inputEl.classList.add('shake');
  setTimeout(() => { inputEl.placeholder = original; inputEl.classList.remove('shake'); }, 1400);
}

function saveAndContinue(email, username, avatarImg) {
  // guardamos datos en localStorage (demo local)
  localStorage.setItem('playerEmail', email);
  localStorage.setItem('playerName', username);
  localStorage.setItem('avatarImg', avatarImg);

  // mostrar splash y redirigir a loading.html
  successSplash.classList.remove('hidden');
  setTimeout(() => window.location.href = 'loading.html', 800);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
