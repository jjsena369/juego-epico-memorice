// === Elementos del DOM ===
const inputJugador1 = document.getElementById('playerName1');
const inputJugador2 = document.getElementById('playerName2');
const dificultadSelect = document.getElementById('difficulty');
const gameModeSelect = document.getElementById('gameMode');
const botonIniciar = document.getElementById('startBtn');
const listaRegistros = document.getElementById('recordsList');

// === Actualizar historial ===
function actualizarHistorial() {
  const historial = JSON.parse(localStorage.getItem('registros')) || [];
  if (historial.length === 0) {
    listaRegistros.textContent = 'No hay partidas guardadas todavía.';
  } else {
    listaRegistros.innerHTML = historial.map(r => {
      if (r.puntajeJugador1 !== undefined) {
        return `<p>${r.nombre} — ${r.tiempo} — Jug1: ${r.puntajeJugador1} pts | Jug2: ${r.puntajeJugador2} pts</p>`;
      } else {
        return `<p>${r.nombre} — ${r.tiempo} — Puntaje: ${r.puntaje} pts</p>`;
      }
    }).join('');
  }
}

// === Iniciar juego ===
botonIniciar.addEventListener('click', () => {
  const nombre1 = inputJugador1.value || 'Jugador 1';
  const nombre2 = inputJugador2.value || 'Jugador 2';
  const dificultad = dificultadSelect.value;
  const modo2Jugadores = gameModeSelect.value === '2';

  localStorage.setItem('playerName1', nombre1);
  localStorage.setItem('playerName2', nombre2);
  localStorage.setItem('difficulty', dificultad);
  localStorage.setItem('modo2Jugadores', modo2Jugadores ? 'true' : 'false');

  window.location.href = 'game.html';
});

actualizarHistorial();
