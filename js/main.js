// ========== CONFIG ==========
const WHATSAPP_TIENDA = '584242256294';

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
  const phone = btn.dataset.phone || WHATSAPP_TIENDA;
  const text = `Hola Kios, quiero información sobre ${btn.dataset.wa}`;
  btn.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  btn.target = '_blank';
  btn.rel = 'noopener';
});

// ========== FILTRO DE PRODUCTOS ==========
const filters = document.querySelectorAll('.filter');
const products = document.querySelectorAll('.product');

function applyFilter(cat) {
  filters.forEach(f => f.classList.toggle('is-active', f.dataset.filter === cat));
  products.forEach(p => {
    p.classList.toggle('is-hidden', cat !== 'todos' && p.dataset.cat !== cat);
  });
}

filters.forEach(f => f.addEventListener('click', () => applyFilter(f.dataset.filter)));

// Las categorías llevan a la tienda con el filtro aplicado
document.querySelectorAll('[data-goto]').forEach(cat => {
  cat.addEventListener('click', () => applyFilter(cat.dataset.goto));
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
