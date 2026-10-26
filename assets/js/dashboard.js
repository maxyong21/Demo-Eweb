/* Analytics use the existing Store orders; no simulated traffic or profit claims. */
(function () {
  const root = Admin.mount('dashboard', 'Business overview', 'See what is selling and what needs your attention.');
  if (!root) return;
  const state = { days: 14, status: 'all', metric: 'value', selected: null };
  const money = Store.formatRM, esc = UI.esc;
  const dateLabel = (d) => new Date(d).toLocaleDateString('en-MY', {day:'numeric',month:'short'});
  const dayStart = (d) => { const n = new Date(d); n.setHours(0,0,0,0); return n; };
  const shift = (d, n) => { const v = new Date(d); v.setDate(v.getDate() + n); return v; };
  let filtered = [];

  function getReport(orders, from, to, status) {
    const rows = orders.filter(o => new Date(o.createdAt) >= from && new Date(o.createdAt) < to && (status === 'all' || o.status === status));
    const valid = rows.filter(o => o.status !== 'Cancelled');
    const value = valid.reduce((s,o) => s + o.total, 0);
    const buyers = new Map();
    valid.forEach(o => { const id = o.customerId || o.email; buyers.set(id, (buyers.get(id) || 0) + 1); });
    return { rows, valid, value, average: valid.length ? value / valid.length : 0, buyers: buyers.size, repeat: [...buyers.values()].filter(n => n > 1).length };
  }

  function trend(current, previous) {
    if (!previous) return current ? 'No previous-period baseline' : 'No orders in either period';
    const change = (current - previous) / previous * 100;
    return `<span class="${change >= 0 ? 'up' : 'stock-out'}">${change >= 0 ? '+' : ''}${change.toFixed(1)}%</span> vs previous ${state.days} days`;
  }

  function render() {
    const orders = Store.orders(), products = Store.products();
    const today = dayStart(Date.now()), end = shift(today, 1), start = shift(end, -state.days);
    const report = getReport(orders, start, end, state.status);
    const previous = getReport(orders, shift(start, -state.days), start, state.status);
    filtered = report.rows;
    const daily = Array.from({length:state.days}, (_,i) => {
      const from = shift(start,i), r = getReport(orders,from,shift(from,1),state.status);
      return { date:from, value:r.value, count:r.valid.length };
    });
    if (!daily.some(d => d.date.getTime() === state.selected)) state.selected = daily[daily.length - 1].date.getTime();
    const max = Math.max(1,...daily.map(d => state.metric === 'value' ? d.value : d.count));
    const low = products.filter(p => p.stock < 10).sort((a,b) => a.stock - b.stock);
    const pending = report.rows.filter(o => o.status === 'Pending').length;
    const sold = {}, categories = {};
    report.valid.forEach(o => o.items.forEach(item => {
      const id = item.id;
      sold[id] = sold[id] || {item,qty:0,value:0};
      sold[id].qty += item.qty;
      sold[id].value += item.qty * item.price;
      const cat = products.find(p => p.id === id)?.category || 'other';
      categories[cat] = categories[cat] || {value:0,qty:0};
      categories[cat].value += item.qty * item.price;
      categories[cat].qty += item.qty;
    }));
    const top = Object.values(sold).sort((a,b) => b.value - a.value).slice(0,5);
    const catEntries = Object.entries(categories).sort((a,b) => b[1].value - a[1].value);
    const gross = catEntries.reduce((s,[,c]) => s+c.value,0);
    const kpi = (label,icon,value,note,color) => `<div class="kpi"><div class="kpi-top">${label}<span class="kpi-ic ic-${color}">${UI.ICONS[icon]}</span></div><div class="kpi-value">${value}</div><div class="kpi-foot">${note}</div></div>`;
    root.innerHTML = `
      ${Admin.demoBanner()}
      <div class="dashboard-intro"><div><span class="dash-eyebrow">Your store, at a glance</span><h2>Know your numbers. Decide your next step.</h2><p>Explore orders, spot popular products and keep stock ready for your next customer.</p></div><button class="btn btn-outline btn-sm" id="export-report">Download report ↓</button></div>
      <div class="dashboard-filters">
        <label for="period">Time period<select class="select" id="period">${[7,14,30].map(n => `<option value="${n}" ${state.days === n ? 'selected' : ''}>Last ${n} days</option>`).join('')}</select></label>
        <label for="status-filter">Order status<select class="select" id="status-filter"><option value="all">All statuses</option>${Store.STATUSES.concat('Cancelled').map(s=>`<option ${state.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
        <div class="filter-summary">${dateLabel(start)} – ${dateLabel(today)} · ${report.rows.length} matching orders<br>Cards and reports follow these filters.</div>
      </div>
      <div class="kpis">
        ${kpi('Order value','dollar',money(report.value),trend(report.value,previous.value),'blue')}
        ${kpi('Orders','box',report.rows.length,`${report.valid.length} non-cancelled · ${report.rows.length-report.valid.length} cancelled`,'purple')}
        ${kpi('Average order','chart',money(report.average),trend(report.average,previous.average),'green')}
        ${kpi('Returning buyers','users',report.repeat,`${report.buyers ? Math.round(report.repeat/report.buyers*100) : 0}% of ${report.buyers} buyers ordered 2+ times in this period`,'orange')}
      </div>
      <p class="metric-note">Order value includes tax and delivery, excludes cancelled orders, and is not a measure of collected payments or profit.</p>
      <div class="dash-grid">
        <section class="card"><div class="card-head"><div><h3>How are orders performing?</h3><p>Daily totals · last ${state.days} days</p></div><div class="chart-metrics" aria-label="Chart metric"><button data-metric="value" aria-pressed="${state.metric === 'value'}">Order value</button><button data-metric="count" aria-pressed="${state.metric === 'count'}">Orders</button></div></div>
          <div class="chart-scroll"><div class="daily-chart" aria-label="Daily ${state.metric === 'value' ? 'order value in ringgit' : 'non-cancelled orders'}">${daily.map((d,i) => {
            const v = state.metric === 'value' ? d.value : d.count;
            return `<button class="day-bar" data-day="${d.date.getTime()}" aria-pressed="${state.selected === d.date.getTime()}" aria-label="${dateLabel(d.date)}: ${money(d.value)}, ${d.count} non-cancelled orders"><span class="bar-fill" style="height:${v/max*175}px"></span><small>${state.days <= 14 || i%3 === 0 || i === daily.length-1 ? d.date.getDate() : ''}</small></button>`;
          }).join('')}</div></div>
          <p class="chart-caption">Highest day: ${state.metric === 'value' ? money(Math.max(0,...daily.map(d=>d.value))) : Math.max(0,...daily.map(d=>d.count))+' orders'}. Select a bar to see its details.</p>
          <div class="chart-detail" id="chart-detail" aria-live="polite"></div>
        </section>
        <section class="card"><div class="card-head"><div><h3>What needs attention?</h3><p>Useful actions from your demo data</p></div></div><div class="action-list">
          <div class="action-item">${UI.ICONS.box}<div><b>${pending ? pending+' order'+(pending === 1 ? '' : 's')+' awaiting review' : 'No pending orders in this view'}</b><p>Review payment and stock before processing an order.</p><a href="orders.html">Review orders →</a></div></div>
          <div class="action-item">${UI.ICONS.alert}<div><b>${low.length} products running low</b><p>Across your entire catalogue, ${low.length ? esc(low[0].name)+' has '+low[0].stock+' units left.' : 'all products have at least 10 units.'}</p><a href="products.html">Check inventory →</a></div></div>
          <div class="action-item">${UI.ICONS.chart}<div><b>${top.length ? 'Your leading product' : 'Build your next sales opportunity'}</b><p>${top.length ? esc(top[0].item.name)+' leads by item value in this period. Check its margin before promoting it.' : 'Try a wider period or another status to explore your orders.'}</p><a href="../proposal.html#growth">Explore the sales plan →</a></div></div>
        </div></section>
      </div>
      <div class="dashboard-secondary">
        <section class="card"><div class="card-head"><div><h3>What are customers buying?</h3><p>Product category share · before discounts, tax and delivery</p></div></div>
        ${catEntries.length ? catEntries.map(([id,c]) => `<button class="category-row" data-category="${esc(id)}"><span><span>${esc(Store.category(id).name)}</span><b>${gross ? Math.round(c.value/gross*100) : 0}% · ${money(c.value)}</b></span><span class="category-track"><i style="width:${gross ? c.value/gross*100 : 0}%"></i></span></button>`).join('') : '<p class="empty-data">No non-cancelled product sales in this view.</p>'}
        <p class="category-detail" id="category-detail" aria-live="polite">Select a category for its units and item value.</p></section>
        <section class="card"><div class="card-head"><div><h3>Where are the orders?</h3><p>Select a status to filter the dashboard</p></div><button class="btn btn-outline btn-sm" id="clear-status">Show all</button></div>
        <div class="status-bars">${Store.STATUSES.concat('Cancelled').map(s=>{const n=report.rows.filter(o=>o.status===s).length;return `<div class="sb-row"><button class="status-link" data-status="${s}">${s}</button><div class="sb-track"><div class="sb-fill" style="width:${report.rows.length ? n/report.rows.length*100 : 0}%;background:${s==='Cancelled'?'#dc2626':'#2563eb'}"></div></div><b>${n}</b></div>`;}).join('')}</div>
        <details class="dashboard-help"><summary>How to read these numbers</summary><p>Cancelled orders remain in order counts but do not contribute to order value, average order value, returning buyers or product sales. Returning buyers have at least two non-cancelled orders within the selected period. Category and product totals use item prices before order-level discounts.</p></details></section>
      </div>
      <div class="dash-grid"><section class="card"><div class="card-head"><div><h3>Recent orders</h3><p>Latest 7 orders in this view</p></div><a class="link" href="orders.html">Manage all →</a></div>
      <div class="table-wrap"><table class="table analytics-table"><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th class="num">Total</th></tr></thead><tbody>${report.rows.slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,7).map(o=>`<tr><td><button data-order="${esc(o.id)}">${esc(o.id)}</button><div class="muted" style="font-size:11px">${dateLabel(o.createdAt)}</div></td><td>${esc(o.customerName)}</td><td>${UI.statusBadge(o.status)}</td><td class="num">${money(o.total)}</td></tr>`).join('') || '<tr><td colspan="4" class="empty-data">No orders match these filters. Try another status or time period.</td></tr>'}</tbody></table></div></section>
      <section class="card"><div class="card-head"><div><h3>Top products</h3><p>By item value before discounts</p></div></div><div class="top-list">${top.map(t=>`<div class="top-item"><div class="cart-thumb">${UI.art(t.item)}</div><div class="ti-main"><b>${esc(t.item.name)}</b><small>${t.qty} units</small></div><span class="ti-val">${money(t.value)}</span></div>`).join('') || '<p class="empty-data">No products sold in this view.</p>'}</div></section></div>
      <div class="report-footer"><span>${esc(Demo.theme.label)} sample data · stored in this browser · no live marketplace connection</span><a href="../demos.html">Explore another business demo →</a></div>`;

    const detail = (timestamp) => {
      state.selected = Number(timestamp);
      const day = daily.find(d=>d.date.getTime()===state.selected);
      root.querySelector('#chart-detail').innerHTML = `<b>${dateLabel(day.date)}</b> ${money(day.value)} order value · ${day.count} non-cancelled order${day.count===1?'':'s'}`;
      root.querySelectorAll('[data-day]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.day)===state.selected)));
    };
    detail(state.selected);
    root.querySelector('#period').addEventListener('change',e=>{state.days=Number(e.target.value);state.selected=null;render();root.querySelector('#period').focus();});
    root.querySelector('#status-filter').addEventListener('change',e=>{state.status=e.target.value;render();root.querySelector('#status-filter').focus();});
    root.querySelectorAll('[data-metric]').forEach(b=>b.addEventListener('click',()=>{state.metric=b.dataset.metric;render();root.querySelector(`[data-metric="${state.metric}"]`).focus();}));
    root.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>detail(b.dataset.day)));
    root.querySelectorAll('[data-status]').forEach(b=>b.addEventListener('click',()=>{state.status=b.dataset.status;render();root.querySelector('#status-filter').focus();}));
    root.querySelector('#clear-status').addEventListener('click',()=>{state.status='all';render();root.querySelector('#clear-status').focus();});
    root.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{const c=categories[b.dataset.category];root.querySelector('#category-detail').textContent=`${Store.category(b.dataset.category).name}: ${c.qty} units · ${money(c.value)} before discounts, tax and delivery.`;}));
    root.querySelectorAll('[data-order]').forEach(b=>b.addEventListener('click',()=>Admin.orderModal(b.dataset.order,render)));
    root.querySelector('#export-report').addEventListener('click',exportReport);
  }

  function exportReport() {
    const cell = value => '"'+String(value ?? '').replace(/^[=+@\-\t\r]/,"'$&").replace(/"/g,'""')+'"';
    const lines = [['Order','Date','Customer','Status','Total (RM)','Included order value (RM)'],...filtered.map(o=>[o.id,o.createdAt,o.customerName,o.status,o.total.toFixed(2),o.status==='Cancelled'?'0.00':o.total.toFixed(2)])];
    const blob = new Blob(['\uFEFF'+lines.map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url;a.download=`lucky-dotcom-demo-${state.days}-days-${state.status.toLowerCase()}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    UI.toast('Filtered demo report downloaded');
  }
  window.addEventListener('storage',render);
  render();
})();
