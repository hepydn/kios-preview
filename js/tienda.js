// ========== CONFIG ==========
// WhatsApp de la tienda: pedidos de productos
const WHATSAPP_TIENDA = '584242256294';
// Enlace CSV de la hoja de Google (Archivo → Compartir → Publicar en la web → CSV).
// Mientras esté vacío, la tienda lee data/productos.csv del propio repositorio.
const CATALOGO_URL = '';
// Orden de las pestañas; una categoría nueva en la hoja aparece al final
const CATEGORIAS = ['Cejas', 'Pestañas', 'Bioseguridad', 'Faciales', 'Aparatología', 'Depilación', 'Estética'];

const $ = id => document.getElementById(id);
const state = { products: [], cat: '', sub: '', brand: '', q: '' };

// ========== LECTURA DE LA HOJA ==========
// Columnas: nombre, categoria, subcategoria, marca, precio, precio_volumen, agotado, foto, detalle
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }

  const [header, ...data] = rows;
  const keys = header.map(h => h.trim().toLowerCase());
  return data
    .filter(r => r.some(v => v.trim()))
    .map(r => Object.fromEntries(keys.map((k, i) => [k, (r[i] || '').trim()])));
}

// "2,3" → "2,3$" · "" o "$" → null (se muestra "Consultar precio")
function formatPrice(raw) {
  const value = raw.replace(/\$/g, '').trim();
  return value ? `${value}$` : null;
}

const normalize = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const escapeHTML = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ========== FILTROS ==========
function visibleProducts() {
  const q = normalize(state.q);
  return state.products.filter(p =>
    (!state.cat || p.categoria === state.cat) &&
    (!state.sub || p.subcategoria === state.sub) &&
    (!state.brand || p.marca === state.brand) &&
    (!q || normalize(`${p.nombre} ${p.marca} ${p.subcategoria} ${p.categoria}`).includes(q))
  );
}

function renderTabs() {
  const present = [...new Set(state.products.map(p => p.categoria).filter(Boolean))];
  const cats = [...CATEGORIAS.filter(c => present.includes(c)), ...present.filter(c => !CATEGORIAS.includes(c))];
  $('tabs').innerHTML = ['', ...cats].map(c =>
    `<button role="tab" data-cat="${escapeHTML(c)}" class="${c === state.cat ? 'is-active' : ''}">${c ? escapeHTML(c) : 'Todo'}</button>`
  ).join('');

  const subs = state.cat
    ? [...new Set(state.products.filter(p => p.categoria === state.cat).map(p => p.subcategoria).filter(Boolean))]
    : [];
  $('subs').innerHTML = subs.length > 1
    ? ['', ...subs].map(s => `<button data-sub="${escapeHTML(s)}" class="${s === state.sub ? 'is-active' : ''}">${s ? escapeHTML(s) : 'Todas'}</button>`).join('')
    : '';
}

// ========== TARJETAS ==========
function waLink(p, qty) {
  const price = formatPrice(p.precio);
  const text = `Hola Kios, quiero ${qty} ${p.nombre}${price ? ` (${price} c/u)` : ''}`;
  return `https://wa.me/${WHATSAPP_TIENDA}?text=${encodeURIComponent(text)}`;
}

function imageHTML(p) {
  return p.foto
    ? `<div class="product__img"><img src="${escapeHTML(p.foto)}" alt="${escapeHTML(p.nombre)}" loading="lazy" /></div>`
    : '<div class="product__img"><i class="fas fa-box-open"></i></div>';
}

function priceHTML(p) {
  const price = formatPrice(p.precio);
  return (price
    ? `<p class="product__price">${escapeHTML(price)}</p>`
    : '<p class="product__price product__price--ask">Consultar precio</p>') +
    (p.precio_volumen ? `<p class="product__volume">${escapeHTML(p.precio_volumen)}</p>` : '');
}

function renderProducts() {
  const list = visibleProducts();
  $('count').textContent = `${list.length} producto${list.length === 1 ? '' : 's'}`;
  if (!list.length) {
    $('products').innerHTML = '<p class="shop__empty">No encontramos ese producto. Escríbenos y te ayudamos a buscarlo.</p>';
    return;
  }
  $('products').innerHTML = list.map(p => {
    const i = state.products.indexOf(p);
    const out = p.out;
    return `<article class="product${out ? ' product--out' : ''}">
      ${out ? '<span class="product__tag">Agotado</span>' : ''}
      ${imageHTML(p)}
      <div class="product__body">
        ${p.marca ? `<span class="product__brand">${escapeHTML(p.marca)}</span>` : ''}
        <h3 class="product__name">${escapeHTML(p.nombre)}</h3>
        ${priceHTML(p)}
        ${p.detalle ? `<button class="product__more" data-detail="${i}">Ver especificaciones</button>` : ''}
        <div class="product__buy">
          ${out ? '' : `<input type="number" min="1" value="1" aria-label="Cantidad" data-qty="${i}" />`}
          <a class="btn btn--primary" data-buy="${i}" target="_blank" rel="noopener">
            <i class="fab fa-whatsapp"></i> ${out ? 'Avísame' : 'Pedir'}
          </a>
        </div>
      </div>
    </article>`;
  }).join('');
}

function render() { renderTabs(); renderProducts(); }

// ========== DETALLE ==========
function openDetail(p) {
  $('detailBody').innerHTML = `<div class="detail__grid">
    ${imageHTML(p)}
    <div class="detail__text">
      ${p.marca ? `<span class="product__brand">${escapeHTML(p.marca)}</span>` : ''}
      <h3>${escapeHTML(p.nombre)}</h3>
      ${priceHTML(p)}
      <p class="detail__specs">${escapeHTML(p.detalle)}</p>
      <a class="btn btn--primary" href="${waLink(p, 1)}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> ${p.out ? 'Avísame cuando llegue' : 'Pedir por WhatsApp'}</a>
    </div>
  </div>`;
  $('detail').showModal();
}

// ========== EVENTOS ==========
$('tabs').addEventListener('click', e => {
  const btn = e.target.closest('[data-cat]');
  if (!btn) return;
  state.cat = btn.dataset.cat;
  state.sub = '';
  render();
});

$('subs').addEventListener('click', e => {
  const btn = e.target.closest('[data-sub]');
  if (!btn) return;
  state.sub = btn.dataset.sub;
  render();
});

$('brand').addEventListener('change', e => { state.brand = e.target.value; renderProducts(); });
$('search').addEventListener('input', e => { state.q = e.target.value; renderProducts(); });

$('products').addEventListener('click', e => {
  const more = e.target.closest('[data-detail]');
  if (more) return openDetail(state.products[more.dataset.detail]);

  // El enlace de WhatsApp se arma al pulsar, con la cantidad elegida
  const buy = e.target.closest('[data-buy]');
  if (buy) {
    const p = state.products[buy.dataset.buy];
    const qtyInput = document.querySelector(`[data-qty="${buy.dataset.buy}"]`);
    const qty = Math.max(1, parseInt(qtyInput?.value, 10) || 1);
    buy.href = p.out
      ? `https://wa.me/${WHATSAPP_TIENDA}?text=${encodeURIComponent(`Hola Kios, ¿cuándo vuelve a llegar ${p.nombre}?`)}`
      : waLink(p, qty);
  }
});

$('detailClose').addEventListener('click', () => $('detail').close());
$('detail').addEventListener('click', e => { if (e.target === $('detail')) $('detail').close(); });

// ========== CARGA ==========
fetch(CATALOGO_URL || 'data/productos.csv', { cache: 'no-store' })
  .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
  .then(text => {
    state.products = parseCSV(text)
      .filter(p => p.nombre)
      .map(p => ({ ...p, out: /^(s[ií]|x|agotado)$/i.test(p.agotado) }));
    const brands = [...new Set(state.products.map(p => p.marca).filter(Boolean))].sort();
    $('brand').insertAdjacentHTML('beforeend', brands.map(b => `<option>${escapeHTML(b)}</option>`).join(''));
    render();
  })
  .catch(() => {
    $('products').innerHTML = `<p class="shop__empty">No pudimos cargar el catálogo. <a href="https://wa.me/${WHATSAPP_TIENDA}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a> y te enviamos la lista de productos.</p>`;
  });
