/* =========================================================
   PSICOMEDIC MS — Navegación por pestañas (tipo página)
   ========================================================= */

const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('menu');
const nav    = document.getElementById('nav');

// Detalles individuales de servicio
const SERVICE_VIEWS = [
  'serv-empresarial', 'serv-clinica', 'serv-infantil',
  'serv-ocupacional', 'serv-laboral', 'serv-social'
];

// IDs válidos de las vistas
const VIEWS = ['inicio', 'nosotros', 'servicios', 'valores', 'contacto', ...SERVICE_VIEWS];

// --- Menú móvil (abrir/cerrar) ---
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.classList.toggle('active', open);
  toggle.setAttribute('aria-expanded', open);
});

function closeMobileMenu() {
  menu.classList.remove('open');
  toggle.classList.remove('active');
  toggle.setAttribute('aria-expanded', 'false');
}

// --- Mostrar una pestaña / vista ---
function showView(id, updateHash = true) {
  if (!VIEWS.includes(id)) id = 'inicio';

  // Alterna las vistas
  document.querySelectorAll('.view').forEach(view => {
    view.classList.toggle('is-active', view.id === id);
  });

  // Resalta la pestaña activa en el menú
  document.querySelectorAll('[data-nav]').forEach(link => {
    const target = (link.getAttribute('href') || '').replace('#', '');
    let active = target === id;
    // El menú "Servicios" queda activo también en las páginas de detalle
    if (target === 'servicios' && SERVICE_VIEWS.includes(id)) active = true;
    link.classList.toggle('active', active);
  });

  // Reinicia las animaciones de entrada de la vista activa
  const active = document.getElementById(id);
  if (active) {
    active.querySelectorAll('.reveal').forEach((el, i) => {
      el.classList.remove('in');
      // pequeño retraso escalonado
      setTimeout(() => el.classList.add('in'), 60 + i * 70);
    });
  }

  if (updateHash) history.replaceState(null, '', '#' + id);

  // Sube al inicio de la página (debajo del menú fijo)
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Cierra el desplegable de Servicios si estaba abierto
  const dropEl = document.querySelector('.nav__drop');
  if (dropEl) dropEl.classList.remove('open');

  closeMobileMenu();
}

// --- Menú desplegable de Servicios: abrir/cerrar al hacer clic ---
const drop      = document.querySelector('.nav__drop');
const dropLabel = document.querySelector('.nav__droplabel');

if (dropLabel && drop) {
  dropLabel.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    drop.classList.toggle('open');
  });
}

// Cerrar el desplegable al hacer clic fuera de él
document.addEventListener('click', (e) => {
  if (drop && !drop.contains(e.target)) drop.classList.remove('open');
});

// --- Clic en cualquier enlace de navegación interna ---
document.querySelectorAll('[data-nav]').forEach(link => {
  // El rótulo "Servicios" solo abre el submenú, no navega
  if (link.classList.contains('nav__droplabel')) return;

  link.addEventListener('click', (e) => {
    const id = (link.getAttribute('href') || '').replace('#', '');
    if (!VIEWS.includes(id)) return;
    e.preventDefault();
    showView(id);
  });
});

// --- Soporte para botones atrás/adelante del navegador ---
window.addEventListener('popstate', () => {
  const id = (location.hash || '#inicio').replace('#', '');
  showView(id, false);
});

// --- Sombra del menú al hacer scroll ---
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// --- Año dinámico en el footer ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- Vista inicial según el enlace (#) o "inicio" por defecto ---
(function init() {
  const id = (location.hash || '#inicio').replace('#', '');
  showView(VIEWS.includes(id) ? id : 'inicio', false);
})();

// --- Formulario de contacto (envía a WhatsApp) ---
function handleSubmit(e) {
  e.preventDefault();
  const nombre   = document.getElementById('nombre').value.trim();
  const email    = document.getElementById('email').value.trim();
  const servicio = document.getElementById('servicio').value;
  const mensaje  = document.getElementById('mensaje').value.trim();
  const note     = document.getElementById('formNote');

  // Número de WhatsApp de la clienta (reemplazar por el real)
  const numero = '593963752642';

  const texto = encodeURIComponent(
    `Hola PSICOMEDIC MS, soy ${nombre}.\n` +
    `Correo: ${email}\n` +
    `Servicio de interés: ${servicio}\n` +
    `Mensaje: ${mensaje || '(sin mensaje)'}`
  );

  window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');
  note.textContent = '¡Gracias! Te estamos redirigiendo a WhatsApp…';
  e.target.reset();
  return false;
}
