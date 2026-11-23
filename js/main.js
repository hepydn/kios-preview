// ========== CONFIG ==========
// WhatsApp del studio: cursos, cupos y reservas
const WHATSAPP_STUDIO = '584242256294';

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('is-scrolled', window.scrollY > 10);
});

burger.addEventListener('click', () => navLinks.classList.toggle('is-open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('is-open'));
});
// Cerrar el menú al tocar fuera de él o con la tecla Escape
document.addEventListener('click', e => {
  if (navLinks.classList.contains('is-open') && !navLinks.contains(e.target) && !burger.contains(e.target)) {
    navLinks.classList.remove('is-open');
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') navLinks.classList.remove('is-open'); });

// ========== ENLACES DE WHATSAPP ==========
// Cada botón con data-wa abre WhatsApp con un mensaje ya escrito
document.querySelectorAll('[data-wa]').forEach(btn => {
  const phone = btn.dataset.phone || WHATSAPP_STUDIO;
  const text = `Hola Kios, quiero información sobre ${btn.dataset.wa}`;
  btn.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  btn.target = '_blank';
  btn.rel = 'noopener';
});

// ========== ANIMACIÓN AL HACER SCROLL ==========
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ========== AÑO DEL FOOTER ==========
document.getElementById('year').textContent = new Date().getFullYear();

// ========== CARRUSEL DEL STUDIO ==========
// Pasa las fotos de derecha a izquierda en bucle
const slider = document.getElementById('slider');
if (slider) {
  const track = slider.querySelector('.slider__track');
  const total = track.children.length;
  const clone = track.children[0].cloneNode(); // copia de la primera para que el bucle no salte
  clone.alt = ''; clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
  let i = 0;
  const reset = () => { i = 0; track.style.transition = 'none'; track.style.transform = 'translateX(0)'; void track.offsetWidth; };
  const go = () => {
    if (i >= total) reset();
    i++; track.style.transition = ''; track.style.transform = `translateX(-${i * 100}%)`;
  };
  track.addEventListener('transitionend', () => { if (i >= total) reset(); });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(go, 3500);
}
