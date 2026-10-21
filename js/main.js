// ========== CONFIG ==========
// WhatsApp del studio: cursos, cupos y reservas
const WHATSAPP_STUDIO = '582127624461';

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
