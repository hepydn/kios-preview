// ========== CONFIG ==========
// WhatsApp del studio: cursos, cupos y reservas
const WHATSAPP_STUDIO = '582127624461';
// Pega aquí el ID del Pixel de Meta para activar la medición
const META_PIXEL_ID = '';

// ========== PIXEL DE META ==========
if (META_PIXEL_ID) {
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}

// ========== ENLACES DE WHATSAPP ==========
// Cada botón abre WhatsApp con el mensaje ya escrito y avisa al Pixel del clic
document.querySelectorAll('[data-msg]').forEach(btn => {
  const text = `Hola Kios, ${btn.dataset.msg}`;
  btn.href = `https://wa.me/${WHATSAPP_STUDIO}?text=${encodeURIComponent(text)}`;
  btn.target = '_blank';
  btn.rel = 'noopener';
  btn.addEventListener('click', () => {
    if (window.fbq) fbq('track', 'Contact', { content_name: btn.dataset.course });
  });
});

// ========== AÑO DEL FOOTER ==========
document.getElementById('year').textContent = new Date().getFullYear();
