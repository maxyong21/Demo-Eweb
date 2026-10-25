/* =========================================================
   VoltHub Demo Store — shared UI (header, footer, cards, art)
   ========================================================= */
(function () {
  const BASE = Store.base();

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Icons ---------- */
  const svg = (d, extra) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra || ''}>${d}</svg>`;
  const ICONS = {
    cart: svg('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>'),
    user: svg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    search: svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
    menu: svg('<path d="M3 6h18M3 12h18M3 18h18"/>'),
    close: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
    truck: svg('<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
    shield: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
    refresh: svg('<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>'),
    headset: svg('<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>'),
    trash: svg('<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    minus: svg('<path d="M5 12h14"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
    logout: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
    box: svg('<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>'),
    grid: svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
    users: svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'),
    tag: svg('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>'),
    edit: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
    eye: svg('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'),
    store: svg('<path d="M3 9 4.5 3h15L21 9M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v8h14v-8"/>'),
    dollar: svg('<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
    alert: svg('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>'),
    chart: svg('<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/>'),
    lock: svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    bolt: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>'
  };

  /* ---------- Product illustrations (pure SVG, no images needed) ---------- */
  let artId = 0;
  const DARK = '#111827';
  const SHAPES = {
    phone: (s) => `<rect x="68" y="28" width="64" height="142" rx="13" fill="${DARK}"/><rect x="72" y="32" width="56" height="134" rx="10" fill="url(#${s})"/><rect x="90" y="37" width="20" height="5" rx="2.5" fill="${DARK}"/><circle cx="100" cy="100" r="22" fill="#fff" opacity=".18"/><rect x="84" y="150" width="32" height="3" rx="1.5" fill="#fff" opacity=".6"/>`,
    laptop: (s) => `<rect x="40" y="48" width="120" height="80" rx="7" fill="${DARK}"/><rect x="45" y="53" width="110" height="70" rx="3" fill="url(#${s})"/><circle cx="100" cy="88" r="16" fill="#fff" opacity=".2"/><path d="M26 132h148l-9 13H35z" fill="#e5e7eb"/><rect x="86" y="132" width="28" height="3" rx="1.5" fill="#9ca3af"/>`,
    tablet: (s) => `<rect x="46" y="36" width="108" height="136" rx="12" fill="${DARK}"/><rect x="52" y="42" width="96" height="124" rx="7" fill="url(#${s})"/><rect x="62" y="56" width="34" height="34" rx="8" fill="#fff" opacity=".25"/><rect x="104" y="56" width="34" height="34" rx="8" fill="#fff" opacity=".15"/><rect x="62" y="98" width="76" height="10" rx="5" fill="#fff" opacity=".2"/>`,
    headphones: (s) => `<path d="M54 118V98a46 46 0 0 1 92 0v20" fill="none" stroke="${DARK}" stroke-width="10" stroke-linecap="round"/><rect x="40" y="104" width="32" height="52" rx="14" fill="${DARK}"/><rect x="128" y="104" width="32" height="52" rx="14" fill="${DARK}"/><rect x="47" y="112" width="18" height="36" rx="8" fill="url(#${s})"/><rect x="135" y="112" width="18" height="36" rx="8" fill="url(#${s})"/>`,
    earbuds: (s) => `<rect x="58" y="96" width="84" height="62" rx="29" fill="#f9fafb"/><path d="M60 120h80" stroke="#d1d5db" stroke-width="2"/><circle cx="100" cy="138" r="4" fill="url(#${s})"/><circle cx="78" cy="62" r="15" fill="#f9fafb"/><rect x="72" y="64" width="11" height="28" rx="5.5" fill="#f9fafb"/><circle cx="122" cy="62" r="15" fill="#f9fafb"/><rect x="117" y="64" width="11" height="28" rx="5.5" fill="#f9fafb"/><circle cx="78" cy="62" r="6" fill="${DARK}"/><circle cx="122" cy="62" r="6" fill="${DARK}"/>`,
    watch: (s) => `<rect x="80" y="22" width="40" height="156" rx="12" fill="${DARK}" opacity=".85"/><rect x="62" y="58" width="76" height="84" rx="20" fill="#1f2937"/><rect x="68" y="64" width="64" height="72" rx="15" fill="url(#${s})"/><rect x="138" y="88" width="6" height="18" rx="3" fill="#374151"/><circle cx="100" cy="100" r="19" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="85 40" opacity=".85"/>`,
    speaker: (s) => `<rect x="64" y="32" width="72" height="136" rx="36" fill="${DARK}"/><circle cx="100" cy="82" r="24" fill="url(#${s})"/><circle cx="100" cy="82" r="9" fill="${DARK}"/><circle cx="100" cy="130" r="15" fill="url(#${s})" opacity=".85"/><circle cx="100" cy="130" r="5" fill="${DARK}"/>`,
    camera: (s) => `<rect x="56" y="56" width="36" height="18" rx="4" fill="${DARK}"/><rect x="32" y="68" width="136" height="88" rx="13" fill="${DARK}"/><circle cx="100" cy="112" r="34" fill="#374151"/><circle cx="100" cy="112" r="26" fill="url(#${s})"/><circle cx="100" cy="112" r="11" fill="${DARK}"/><circle cx="94" cy="106" r="4" fill="#fff" opacity=".6"/><circle cx="148" cy="82" r="5" fill="#f87171"/>`,
    controller: (s) => `<path d="M62 78h76a32 32 0 0 1 31 40l-9 32a15 15 0 0 1-26 5l-14-19H80l-14 19a15 15 0 0 1-26-5l-9-32a32 32 0 0 1 31-40z" fill="${DARK}"/><rect x="58" y="99" width="28" height="8" rx="2" fill="#e5e7eb"/><rect x="68" y="89" width="8" height="28" rx="2" fill="#e5e7eb"/><circle cx="134" cy="94" r="6" fill="url(#${s})"/><circle cx="146" cy="106" r="6" fill="url(#${s})"/><circle cx="122" cy="106" r="6" fill="url(#${s})"/><circle cx="134" cy="118" r="6" fill="url(#${s})"/>`,
    powerbank: (s) => `<rect x="60" y="36" width="80" height="128" rx="16" fill="${DARK}"/><path d="M106 66 82 106h17l-6 30 26-42h-17z" fill="url(#${s})"/><circle cx="86" cy="150" r="2.5" fill="#22c55e"/><circle cx="96" cy="150" r="2.5" fill="#22c55e"/><circle cx="106" cy="150" r="2.5" fill="#22c55e"/><circle cx="116" cy="150" r="2.5" fill="#374151"/>`,
    keyboard: (s) => {
      let keys = '';
      for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) {
        const hl = (r + c) % 5 === 0;
        keys += `<rect x="${31 + c * 11.7}" y="${84 + r * 11}" width="9" height="8.5" rx="2" fill="${hl ? `url(#${s})` : '#374151'}"/>`;
      }
      return `<rect x="24" y="76" width="152" height="58" rx="9" fill="${DARK}"/>${keys}`;
    }
  };

  function art(p) {
    const n = ++artId;
    const [c1, c2] = p.colors || ['#64748b', '#94a3b8'];
    const bg = 'bg' + n, sc = 'sc' + n;
    const shape = (SHAPES[p.art] || SHAPES.phone)(sc);
    return `<svg class="art" viewBox="0 0 200 200" role="img" aria-label="${esc(p.name || '')}" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="${bg}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
        <linearGradient id="${sc}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#${bg})"/>
      <circle cx="160" cy="34" r="70" fill="#fff" opacity=".14"/>
      <circle cx="20" cy="190" r="50" fill="#fff" opacity=".08"/>
      <ellipse cx="100" cy="182" rx="56" ry="6" fill="#000" opacity=".16"/>
      ${shape}
    </svg>`;
  }

  /* ---------- Small pieces ---------- */
  function stars(rating) {
    let out = '';
    for (let i = 1; i <= 5; i++) out += `<span class="${rating >= i - 0.25 ? 'on' : ''}">${ICONS.star}</span>`;
    return `<span class="stars" aria-label="${rating} out of 5">${out}</span>`;
  }

  function priceHTML(p) {
    return `<span class="price">${Store.formatRM(p.price)}</span>${p.oldPrice ? `<span class="price-old">${Store.formatRM(p.oldPrice)}</span>` : ''}`;
  }

  const discountPct = (p) => (p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);

  function productCard(p) {
    const off = discountPct(p);
    let flag = '';
    if (p.stock <= 0) flag = '<span class="flag flag-out">Sold out</span>';
    else if (p.stock < 10) flag = `<span class="flag flag-low">Only ${p.stock} left</span>`;
    return `<article class="product-card">
      <a class="pc-media" href="${BASE}product.html?id=${p.id}">
        ${art(p)}
        ${off ? `<span class="flag flag-sale">-${off}%</span>` : ''}
        ${flag}
      </a>
      <div class="pc-body">
        <div class="pc-cat">${esc(Store.category(p.category).name)}</div>
        <a class="pc-name" href="${BASE}product.html?id=${p.id}">${esc(p.name)}</a>
        <div class="pc-rating">${stars(p.rating)}<span>${p.rating} (${p.reviews.toLocaleString()})</span></div>
        <div class="pc-foot">
          <div class="pc-price">${priceHTML(p)}</div>
          <button class="btn-add" data-add="${p.id}" ${p.stock <= 0 ? 'disabled' : ''} aria-label="Add ${esc(p.name)} to cart">${ICONS.cart}</button>
        </div>
      </div>
    </article>`;
  }

  function statusBadge(status) {
    return `<span class="status status-${String(status).toLowerCase()}">${esc(status)}</span>`;
  }

  /* ---------- Toast ---------- */
  function toast(msg, type) {
    let wrap = document.querySelector('.toasts');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toasts'; document.body.appendChild(wrap); }
    const t = document.createElement('div');
    t.className = 'toast ' + (type || 'success');
    t.innerHTML = `<span class="toast-ic">${type === 'error' ? ICONS.alert : ICONS.check}</span><span>${esc(msg)}</span>`;
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
  }

  /* ---------- Modal ---------- */
  function openModal(html, opts) {
    closeModal();
    const m = document.createElement('div');
    m.className = 'modal-backdrop';
    m.innerHTML = `<div class="modal ${opts && opts.wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true">
      <button class="modal-close icon-btn" aria-label="Close">${ICONS.close}</button>${html}</div>`;
    m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.modal-close')) closeModal(); });
    document.body.appendChild(m);
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => m.classList.add('show'));
    return m.querySelector('.modal');
  }
  function closeModal() {
    document.querySelectorAll('.modal-backdrop').forEach((m) => m.remove());
    document.body.classList.remove('no-scroll');
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Header / footer ---------- */
  function updateCartBadge() {
    const n = Store.cartCount();
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  function renderHeader(active) {
    const el = document.getElementById('site-header');
    if (!el) return;
    const u = Store.user();
    const link = (href, label, key) => `<a href="${BASE}${href}" class="${active === key ? 'active' : ''}">${label}</a>`;
    const account = u
      ? `<div class="dropdown">
          <button class="account-btn" aria-haspopup="true">${ICONS.user}<span class="hide-sm">Hi, ${esc(u.name.split(' ')[0])}</span></button>
          <div class="dropdown-menu">
            <div class="dd-head"><b>${esc(u.name)}</b><small>${esc(u.role === 'admin' ? 'Administrator' : u.email)}</small></div>
            ${u.role === 'admin'
              ? `<a href="${BASE}admin/index.html">${ICONS.grid}Admin Panel</a>`
              : `<a href="${BASE}orders.html">${ICONS.box}My Orders</a>`}
            <button data-logout>${ICONS.logout}Logout</button>
          </div>
        </div>`
      : `<a href="${BASE}login.html" class="account-btn">${ICONS.user}<span class="hide-sm">Login</span></a>`;

    el.innerHTML = `
      <div class="announce">${ICONS.truck}<span>Free shipping on orders above RM 500 &nbsp;·&nbsp; Use code <b>DEMO10</b> for 10% off</span></div>
      <header class="header">
        <div class="container header-inner">
          <button class="icon-btn menu-toggle" aria-label="Open menu">${ICONS.menu}</button>
          <a href="${BASE}index.html" class="logo"><span class="logo-mark">${ICONS.bolt}</span><span>Volt<b>Hub</b></span></a>
          <nav class="nav" id="main-nav">
            ${link('index.html', 'Home', 'home')}
            ${link('shop.html', 'Shop All', 'shop')}
            ${link('shop.html?cat=smartphones', 'Phones', 'smartphones')}
            ${link('shop.html?cat=laptops', 'Laptops', 'laptops')}
            ${link('shop.html?cat=audio', 'Audio', 'audio')}
            ${link('shop.html?deals=1', 'Deals', 'deals')}
          </nav>
          <form class="search" action="${BASE}shop.html" role="search">
            <input type="search" name="q" placeholder="Search phones, laptops, audio…" aria-label="Search products">
            <button type="submit" aria-label="Search">${ICONS.search}</button>
          </form>
          <div class="header-actions">
            ${account}
            <a href="${BASE}cart.html" class="cart-btn" aria-label="Cart">${ICONS.cart}<span class="cart-count" data-cart-count hidden>0</span></a>
          </div>
        </div>
      </header>`;

    const q = new URLSearchParams(location.search).get('q');
    if (q) el.querySelector('.search input').value = q;
    el.querySelector('.menu-toggle').addEventListener('click', () => document.body.classList.toggle('nav-open'));
    updateCartBadge();
  }

  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    const S = DATA.store;
    el.innerHTML = `
      <footer class="footer">
        <div class="container footer-grid">
          <div>
            <a href="${BASE}index.html" class="logo logo-light"><span class="logo-mark">${ICONS.bolt}</span><span>Volt<b>Hub</b></span></a>
            <p class="muted-light">Malaysia's favourite place for genuine gadgets with official warranty, fast delivery and friendly support.</p>
            <div class="pay-badges"><span>FPX</span><span>VISA</span><span>Mastercard</span><span>COD</span></div>
          </div>
          <div><h4>Shop</h4>${DATA.categories.slice(0, 6).map((c) => `<a href="${BASE}shop.html?cat=${c.id}">${c.name}</a>`).join('')}</div>
          <div><h4>Help</h4><a href="#">Shipping &amp; Delivery</a><a href="#">Returns &amp; Refunds</a><a href="#">Warranty Claims</a><a href="#">FAQ</a><a href="${BASE}orders.html">Track Order</a></div>
          <div><h4>Contact</h4><p class="muted-light">${esc(S.address)}</p><p class="muted-light">${esc(S.phone)}<br>${esc(S.email)}</p></div>
        </div>
        <div class="container footer-bottom">
          <span>© ${new Date().getFullYear()} ${esc(S.name)} Sdn Bhd (Demo). All rights reserved.</span>
          <span>This is a demo website — no real payments are processed.</span>
        </div>
      </footer>`;
  }

  /* ---------- Global handlers ---------- */
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      const r = Store.addToCart(add.dataset.add, 1);
      toast(r.msg, r.ok ? (r.capped ? 'warning' : 'success') : 'error');
      updateCartBadge();
      if (r.ok) { add.classList.add('added'); setTimeout(() => add.classList.remove('added'), 700); }
      return;
    }
    if (e.target.closest('[data-logout]')) {
      Store.logout();
      location.href = BASE + 'index.html';
      return;
    }
    const dd = e.target.closest('.dropdown');
    document.querySelectorAll('.dropdown.open').forEach((d) => { if (d !== dd) d.classList.remove('open'); });
    if (dd && e.target.closest('.account-btn')) dd.classList.toggle('open');
  });

  window.UI = { BASE, ICONS, esc, art, stars, priceHTML, discountPct, productCard, statusBadge, toast, openModal, closeModal, renderHeader, renderFooter, updateCartBadge };
})();
