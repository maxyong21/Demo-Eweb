/* =========================================================
   VoltHub Demo Store — admin panel shell + shared widgets
   ========================================================= */
(function () {
  const I = UI.ICONS;

  // Builds sidebar + top bar. Returns the content element, or null when not an admin.
  function mount(active, title, sub) {
    if (!Store.requireRole('admin')) return null;
    const u = Store.user();
    const pending = Store.orders().filter((o) => o.status === 'Pending').length;
    const lowStock = Store.products().filter((p) => p.stock < 10).length;
    const link = (href, icon, label, key, pill) =>
      `<a href="${href}" class="${active === key ? 'active' : ''}">${I[icon]}${label}${pill ? `<span class="pill">${pill}</span>` : ''}</a>`;

    document.body.classList.add('admin');
    document.getElementById('admin-app').innerHTML = `
      <div class="admin-shell">
        <aside class="sidebar">
          <a href="index.html" class="logo logo-light"><span class="logo-mark">${I.bolt}</span><span>${UI.esc(Demo.theme.first)}<b>${UI.esc(Demo.theme.last)}</b></span></a>
          <nav class="side-nav">
            <div class="side-label">Overview</div>
            ${link('index.html', 'grid', 'Dashboard', 'dashboard')}
            <div class="side-label">Store</div>
            ${link('orders.html', 'box', 'Orders', 'orders', pending)}
            ${link('products.html', 'tag', 'Products', 'products', lowStock ? lowStock : '')}
            ${link('customers.html', 'users', 'Customers', 'customers')}
            ${link('dealers.html', 'shield', 'Dealer Applications', 'dealers', Store.dealerApplications().filter(a=>a.status==='Pending').length)}
            <div class="side-label">Demo</div>
            <a href="../proposal.html">${I.chart}Lucky Dotcom Proposal</a>
            <a href="../demos.html">${I.store}Choose a Business Demo</a>
            <a href="../index.html" target="_blank" rel="noopener">${I.store}View Storefront</a>
            <button id="reset-demo">${I.refresh}Reset Demo Data</button>
            <button data-logout>${I.logout}Logout</button>
          </nav>
          <div class="side-foot"><span class="avatar">${UI.esc(u.name[0])}</span><div><b>${UI.esc(u.name)}</b><small>${UI.esc(u.email)}</small></div></div>
        </aside>
        <div class="admin-main">
          <header class="admin-top">
            <button class="icon-btn admin-menu" aria-label="Open menu">${I.menu}</button>
            <div><h1>${UI.esc(title)}</h1>${sub ? `<div class="sub">${UI.esc(sub)}</div>` : ''}</div>
            <div class="top-actions" id="top-actions"></div>
          </header>
          <div class="demo-switcher admin-demo-switcher">${Demo.selector()}<a href="../demos.html">About these demos ↗</a></div>
          <main class="admin-content" id="admin-content"></main>
        </div>
      </div>`;
    document.title = document.title.replace(/VoltHub/g, DATA.store.name);
    Demo.bind();

    document.querySelector('.admin-menu').addEventListener('click', () => document.body.classList.toggle('side-open'));
    document.body.addEventListener('click', (e) => {
      if (document.body.classList.contains('side-open') && !e.target.closest('.sidebar') && !e.target.closest('.admin-menu')) document.body.classList.remove('side-open');
    });
    document.getElementById('reset-demo').addEventListener('click', () => {
      if (!confirm('Reset the ' + Demo.theme.label + ' demo? This restores its sample products and orders and clears its cart. Other business demos are kept.')) return;
      Store.resetDemo();
      location.reload();
    });
    // Logout from admin goes back to the login page
    document.querySelector('.side-nav [data-logout]').addEventListener('click', (e) => {
      e.stopPropagation();
      Store.logout();
      location.href = '../login.html';
    });
    return document.getElementById('admin-content');
  }

  const demoBanner = () => `<div class="demo-banner">${I.alert}<span><b>${UI.esc(Demo.theme.label)} demo</b> — data is stored in this browser, separately from other business types. Reset restores this catalogue only.<br>${UI.esc(Demo.theme.caution)}</span></div>`;

  // Order detail modal with status update. onChange(order) is called after a status change.
  function orderModal(id, onChange) {
    const o = Store.order(id);
    if (!o) return;
    const opts = Store.STATUSES.concat('Cancelled');
    const m = UI.openModal(`
      <h2>Order ${o.id}</h2>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap" class="muted">${UI.statusBadge(o.status)}<span>${UI.esc(o.buyerType || 'Retail')} order · Placed ${Store.formatDate(o.createdAt, true)}</span></div>
      <div class="om-grid">
        <div>
          <h4>Items</h4>
          ${o.items.map((i) => `<div class="mini-item"><div class="cart-thumb">${UI.art(i)}<span class="qty-badge">${i.qty}</span></div><div class="mi-name">${UI.esc(i.name)}<div class="muted" style="font-weight:400;font-size:12px">${i.id} · ${Store.formatUnitPrice(i.price)} each</div></div><div class="mi-price">${Store.formatRM(i.price * i.qty)}</div></div>`).join('')}
          <div style="border-top:1px solid var(--border);margin:10px 0 4px"></div>
          <div class="summary-row"><span>Subtotal</span><span>${Store.formatRM(o.subtotal)}</span></div>
          ${o.discount ? `<div class="summary-row discount"><span>Discount (${o.coupon})</span><span>− ${Store.formatRM(o.discount)}</span></div>` : ''}
          <div class="summary-row"><span>Shipping (${o.shippingMethod})</span><span>${o.shipping ? Store.formatRM(o.shipping) : 'FREE'}</span></div>
          <div class="summary-row"><span>SST</span><span>${Store.formatRM(o.tax)}</span></div>
          <div class="summary-row total"><span>Total</span><span>${Store.formatRM(o.total)}</span></div>
        </div>
        <div>
          <h4>Customer</h4>
          <div class="detail-block"><b>${UI.esc(o.customerName)}</b><br>${UI.esc(o.email)}<br>${UI.esc(o.phone)}</div>
          <h4 style="margin-top:18px">Ship to</h4>
          <div class="detail-block">${UI.esc(o.address.line1)}<br>${UI.esc(o.address.postcode)} ${UI.esc(o.address.city)}<br>${UI.esc(o.address.state)}</div>
          <h4 style="margin-top:18px">Payment</h4>
          <div class="detail-block">${UI.esc(o.payment)}</div>
          ${o.notes ? `<h4 style="margin-top:18px">Notes</h4><div class="detail-block">${UI.esc(o.notes)}</div>` : ''}
          <h4 style="margin-top:18px">Update status</h4>
          <div class="status-update">
            <select class="select" id="om-status">${opts.map((s) => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select>
            <button class="btn btn-primary btn-sm" style="height:42px" id="om-save">Update</button>
          </div>
          <h4 style="margin-top:18px">History</h4>
          <ul class="history">${o.history.slice().reverse().map((h) => `<li><b>${h.status}</b><small>${Store.formatDate(h.at, true)}</small></li>`).join('')}</ul>
        </div>
      </div>`, { wide: true });

    m.querySelector('#om-save').addEventListener('click', () => {
      const s = m.querySelector('#om-status').value;
      if (s === o.status) { UI.toast('Status unchanged', 'warning'); return; }
      const updated = Store.updateOrderStatus(o.id, s);
      UI.toast(`${o.id} marked as ${s}`);
      UI.closeModal();
      if (onChange) onChange(updated);
    });
  }

  window.Admin = { mount, demoBanner, orderModal };
})();
