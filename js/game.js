// === Elementos del DOM ===
const tablero = document.getElementById('board');
const mostrarTiempo = document.getElementById('timer');
const mostrarMovimientos = document.getElementById('moves');
const mostrarPuntaje = document.getElementById('score');
const turnoInfo = document.getElementById('turnInfo'); // Opcional: agrega en game.html
const modal = document.getElementById('modal');
const estadisticasFinales = document.getElementById('finalStats');
const botonGuardar = document.getElementById('saveRecord');
const botonCerrar = document.getElementById('closeModal');

// === Variables del juego ===
let cartas = [];
let cartasVolteadas = [];
let movimientos = 0;
let segundos = 0;
let temporizador;

// === Datos del menú ===
const nombreJugador1 = localStorage.getItem('playerName1') || 'Jugador 1';
const nombreJugador2 = localStorage.getItem('playerName2') || 'Jugador 2';
const dificultad = parseInt(localStorage.getItem('difficulty')) || 4;
let modo2Jugadores = localStorage.getItem('modo2Jugadores') === 'true';

// === Puntajes y turno ===
let puntajeJugador1 = 0;
let puntajeJugador2 = 0;
let jugadorActual = 1; // 1 o 2

// === Iniciar juego ===
function iniciarJuego() {
  generarTablero(dificultad);
  movimientos = 0;
  segundos = 0;
  puntajeJugador1 = 0;
  puntajeJugador2 = 0;
  jugadorActual = 1;
  actualizarEstadisticas();
  if (modo2Jugadores) actualizarTurno();
  clearInterval(temporizador);
  temporizador = setInterval(actualizarTiempo, 1000);
}

// === Tiempo ===
function actualizarTiempo() {
  segundos++;
  const min = String(Math.floor(segundos / 60)).padStart(2, '0');
  const seg = String(segundos % 60).padStart(2, '0');
  mostrarTiempo.textContent = `${min}:${seg}`;
}

// === Estadísticas ===
function actualizarEstadisticas() {
  mostrarMovimientos.textContent = movimientos;
  if (modo2Jugadores) {
    mostrarPuntaje.textContent = `${nombreJugador1}: ${puntajeJugador1} pts | ${nombreJugador2}: ${puntajeJugador2} pts`;
  } else {
    mostrarPuntaje.textContent = `${puntajeJugador1} pts`;
  }
}

// === Turno ===
function actualizarTurno() {
  if (turnoInfo) turnoInfo.textContent = `Turno: ${jugadorActual === 1 ? nombreJugador1 : nombreJugador2}`;
}

// === Generar tablero con imágenes ===
function generarTablero(pares) {
  tablero.innerHTML = '';
  const valores = [];
  for (let i = 1; i <= pares; i++) valores.push(i, i);
  valores.sort(() => Math.random() - 0.5);

  cartas = valores.map(valor => {
    const carta = document.createElement('div');
    carta.className = 'card';
    carta.dataset.valor = valor;

    const img = document.createElement('img');
    img.src = 'assets/img/back.png';
    img.className = 'img-card';
    carta.appendChild(img);

    carta.addEventListener('click', () => voltearCarta(carta));
    tablero.appendChild(carta);
    return carta;
  });

  tablero.style.gridTemplateColumns = `repeat(${Math.min(pares*2, 4)}, 80px)`;
}

// === Voltear carta ===
function voltearCarta(carta) {
  if (carta.classList.contains('volteada') || cartasVolteadas.length === 2) return;

  carta.classList.add('volteada');
  carta.querySelector('img').src = `assets/img/${carta.dataset.valor}.png`;
  cartasVolteadas.push(carta);

  if (cartasVolteadas.length === 2) {
    movimientos++;
    verificarCoincidencia();
  }
  actualizarEstadisticas();
}

// === Verificar coincidencia ===
function verificarCoincidencia() {
  const [c1, c2] = cartasVolteadas;

  if (c1.dataset.valor === c2.dataset.valor) {
    c1.classList.add('emparejada');
    c2.classList.add('emparejada');

    if (modo2Jugadores) {
      if (jugadorActual === 1) puntajeJugador1 += 10;
      else puntajeJugador2 += 10;
    } else {
      puntajeJugador1 += 10;
    }

    cartasVolteadas = [];
    actualizarEstadisticas();

    if (document.querySelectorAll('.card:not(.emparejada)').length === 0) {
      clearInterval(temporizador);
      mostrarModal();
    }
  } else {
    if (modo2Jugadores) {
      jugadorActual = jugadorActual === 1 ? 2 : 1;
      actualizarTurno();
    }
    setTimeout(() => {
      c1.classList.remove('volteada');
      c2.classList.remove('volteada');
      c1.querySelector('img').src = 'assets/img/back.png';
      c2.querySelector('img').src = 'assets/img/back.png';
      cartasVolteadas = [];
    }, 800);
  }
}

// === Modal al finalizar ===
function mostrarModal() {
  estadisticasFinales.innerHTML = modo2Jugadores
    ? `Movimientos: ${movimientos} <br> Tiempo: ${mostrarTiempo.textContent} <br>${nombreJugador1}: ${puntajeJugador1} pts | ${nombreJugador2}: ${puntajeJugador2} pts`
    : `Movimientos: ${movimientos} <br> Tiempo: ${mostrarTiempo.textContent} <br>Puntaje: ${puntajeJugador1}`;

  // Agregar botones: Volver al menú y Reiniciar
  if (!document.getElementById('btnMenu')) {
    const btnMenu = document.createElement('button');
    btnMenu.textContent = 'Volver al Menú';
    btnMenu.id = 'btnMenu';
    btnMenu.onclick = () => window.location.href = 'menu.html';
    estadisticasFinales.appendChild(document.createElement('br'));
    estadisticasFinales.appendChild(btnMenu);

    const btnReiniciar = document.createElement('button');
    btnReiniciar.textContent = 'Reiniciar Partida';
    btnReiniciar.id = 'btnReiniciar';
    btnReiniciar.onclick = () => {
      iniciarJuego();
      modal.classList.add('hidden');
    };
    estadisticasFinales.appendChild(btnReiniciar);
  }

  modal.classList.remove('hidden');
}

// === Guardar historial ===
botonGuardar.addEventListener('click', () => {
  const registro = modo2Jugadores
    ? { nombre: `${nombreJugador1} & ${nombreJugador2}`, tiempo: mostrarTiempo.textContent, movimientos, puntajeJugador1, puntajeJugador2 }
    : { nombre: nombreJugador1, tiempo: mostrarTiempo.textContent, movimientos, puntaje: puntajeJugador1 };

  const historial = JSON.parse(localStorage.getItem('registros')) || [];
  historial.push(registro);
  localStorage.setItem('registros', JSON.stringify(historial));
  modal.classList.add('hidden');
});

// === Cerrar modal ===
botonCerrar.addEventListener('click', () => modal.classList.add('hidden'));

// === Inicializar juego automáticamente ===
iniciarJuego();
