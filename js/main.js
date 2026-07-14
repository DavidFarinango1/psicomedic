/* =========================================================
   PSICOMEDIC MS — Interactividad
   ========================================================= */

// --- Menú móvil ---
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('menu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.classList.toggle('active', open);
  toggle.setAttribute('aria-expanded', open);
});

// Cerrar el menú al hacer clic en un enlace (móvil)
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// --- Sombra del nav al hacer scroll ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// --- Animación reveal al hacer scroll ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

// --- Año dinámico en el footer ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- Formulario de contacto (envía a WhatsApp) ---
function handleSubmit(e) {
  e.preventDefault();
  const nombre   = document.getElementById('nombre').value.trim();
  const email    = document.getElementById('email').value.trim();
  const servicio = document.getElementById('servicio').value;
  const mensaje  = document.getElementById('mensaje').value.trim();
  const note     = document.getElementById('formNote');

  // Número de WhatsApp de la clienta (reemplazar por el real)
  const numero = '593000000000';

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
