// Datos y variables globales
const candidatos = [
  { id: 1, nombre: "Carlos Mesa", partido: "CC", votos: 0 },
  { id: 2, nombre: "Luis Arce", partido: "MAS", votos: 0 },
  { id: 3, nombre: "Jeanine Áñez", partido: "ADN", votos: 0 },
  { id: 4, nombre: "Samuel Doria", partido: "UD", votos: 0 },
  { id: 5, nombre: "Ciro Zabala", partido: "Partido X", votos: 0 },
  { id: 6, nombre: "Tania Flores", partido: "Partido Y", votos: 0 },
  { id: 7, nombre: "Marco Paredes", partido: "Partido Z", votos: 0 },
  { id: 8, nombre: "Elena Roca", partido: "Partido W", votos: 0 },
  { id: 9, nombre: "Roberto Fernández", partido: "Partido V", votos: 0 },
  { id: 10, nombre: "Sofia López", partido: "Partido U", votos: 0 },
];

let usuarios = {}; // Almacena usuarios registrados: {ci: {nombre, apellido, ...}}
let usuarioActual = null;
let votosRegistrados = {}; // CI: candidatoId

let votosTotales = 0;
const maxVotos = 10; // Número de votos permitidos en total
let votosCount = 0;

let chart; // Gráfico de resultados

// Función para crear candidatos en la interfaz
function cargarCandidatos() {
  const container = document.getElementById('candidatosContainer');
  container.innerHTML = '';

  candidatos.forEach(c => {
    const card = document.createElement('div');
    card.className = 'col-md-6 candidato';

    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5>${c.nombre}</h5>
        <span class="badge bg-secondary">${c.partido}</span>
      </div>
      <button class="btn btn-outline-primary votar-btn" data-id="${c.id}">Votar</button>
      <span class="ms-3 fw-bold" id="votosCandidato${c.id}">${c.votos} votos</span>
    `;

    container.appendChild(card);
  });

  // Añadir evento a botones votar
  document.querySelectorAll('.votar-btn').forEach(btn => {
    btn.addEventListener('click', votarPorCandidato);
  });
}

// Función para votar por un candidato
function votarPorCandidato(e) {
  const candidatoId = parseInt(e.target.getAttribute('data-id'));
  const ci = usuarioActual;

  // Verificar si el usuario ya votó
  if (votosRegistrados[ci]) {
    alert('Ya has votado.');
    return;
  }

  // Verificar si hay votos disponibles
  if (votosCount >= maxVotos) {
    alert('Se han alcanzado el máximo de votos.');
    return;
  }

  // Registrar voto
  votosRegistrados[ci] = candidatoId;
  candidatos.find(c => c.id === candidatoId).votos += 1;
  votosCount += 1;

  // Actualizar votos en interfaz
  document.getElementById(`votosCandidato${candidatoId}`).innerText = `${candidatos.find(c => c.id === candidatoId).votos} votos`;

  // Marcar usuario como votado (opcional: deshabilitar botón)
  const botones = document.querySelectorAll('.votar-btn');
  botones.forEach(b => {
    if (parseInt(b.getAttribute('data-id')) === candidatoId) {
      b.disabled = true;
      b.classList.add('votado');
    }
  });

  // Actualizar estadísticas si está visible
  if (document.getElementById('estadisticas').style.display === 'block') {
    actualizarEstadisticas();
  }
}

// Función para mostrar las estadísticas
function mostrarEstadisticas() {
  document.getElementById('estadisticas').style.display = 'block';
  cargarResultadosGrafico();
  actualizarEstadisticas();
}

// Función para cargar resultados en gráficos y lista
function cargarResultadosGrafico() {
  const ctx = document.getElementById('resultadosChart').getContext('2d');

  const labels = candidatos.map(c => c.nombre);
  const data = candidatos.map(c => c.votos);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Votos',
        data: data,
        backgroundColor: 'rgba(13, 110, 253, 0.7)',
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision:0 }
        }
      }
    }
  });
}

// Función para actualizar lista de resultados
function actualizarEstadisticas() {
  const lista = document.getElementById('resultadosLista');
  lista.innerHTML = '';

  candidatos.forEach(c => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      ${c.nombre} <span class="badge bg-primary rounded-pill">${c.votos} votos</span>
    `;
    lista.appendChild(li);
  });
}

// Función para registrar usuario
function registrarUsuario(e) {
  e.preventDefault();
  const ci = document.getElementById('ci').value.trim();
  if (!ci) {
    alert('Por favor, ingresa tu CI.');
    return;
  }
  if (usuarios[ci]) {
    alert('Este CI ya está registrado.');
    return;
  }
  usuarios[ci] = {
    nombre: document.getElementById('nombre').value.trim(),
    apellido: document.getElementById('apellido').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    telf: document.getElementById('telf').value.trim(),
    departamento: document.getElementById('departamento').value,
    fechaNacimiento: document.getElementById('fechaNacimiento').value,
    fechaVotacion: document.getElementById('fechaVotacion').value,
  };
  alert('Cuenta creada exitosamente. Ahora inicia sesión.');
  document.getElementById('registroForm').reset();
}

// Función para login
function loginUsuario(e) {
  e.preventDefault();
  const ci = document.getElementById('loginCi').value.trim();
  if (usuarios[ci]) {
    usuarioActual = ci;
    alert(`Bienvenido, ${usuarios[ci].nombre}`);
    document.querySelector('#votingSection').style.display = 'block';
    document.querySelector('form#loginForm').reset();
    cargarCandidatos();
  } else {
    alert('CI no registrado.');
  }
}

// Evento para crear cuenta
document.getElementById('registroForm').addEventListener('submit', registrarUsuario);

// Evento para login
document.getElementById('loginForm').addEventListener('submit', loginUsuario);

// Evento para mostrar estadísticas
document.getElementById('mostrarEstadisticasBtn').addEventListener('click', mostrarEstadisticas);

// Inicialización
window.onload = () => {
  cargarCandidatos();
};