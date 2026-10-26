/* =========================================================
   VoltHub Demo Store — data layer (localStorage)
   Cart, orders, product edits and login session are stored in
   the browser so client + admin share the same data.
   ========================================================= */
(function () {
  const NS = DATA.demoProfile === 'gadgets' || !DATA.demoProfile ? 'volthub_' : 'demo_' + DATA.demoProfile + '_';
  const VERSION = '1';
  const K = {
    version: NS + 'version',
    products: NS + 'products',
    orders: NS + 'orders',
    cart: NS + 'cart',
    coupon: NS + 'coupon',
    session: 'volthub_session',
    dealers: NS + 'dealers',
    wholesaleSettings: NS + 'wholesale_settings',
    wholesaleMigration: NS + 'wholesale_v1'
  };
  const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const HOUR = 3600000, DAY = 86400000;

  // In-memory fallback for browsers that block localStorage (private mode, etc.)
  const mem = {};
  function read(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? (key in mem ? mem[key] : fallback) : JSON.parse(v);
    } catch (e) { return key in mem ? mem[key] : fallback; }
  }
  function write(key, value) {
    mem[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* memory only */ }
  }
  function remove(key) {
    delete mem[key];
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const round2 = (n) => Math.round((n + Number.EPSILON * Math.max(1, Math.abs(n))) * 100) / 100;

  /* ---------- Totals ---------- */
  function findCoupon(code) {
    if (!code) return null;
    return DATA.coupons.find((c) => c.code === String(code).trim().toUpperCase()) || null;
  }

  function calcTotals(items, couponCode, shippingMethod) {
    const s = DATA.settings;
    const subtotal = round2(items.reduce((sum, i) => sum + round2(i.price * i.qty), 0));
    // Retail coupons do not stack with negotiated dealer prices.
    const coupon = items.some(i=>i.wholesaleApplied) ? null : findCoupon(couponCode);
    let discount = 0;
    if (coupon && subtotal >= (coupon.min || 0)) {
      discount = coupon.type === 'percent' ? round2(subtotal * coupon.value / 100) : coupon.value;
    }
    discount = Math.min(discount, subtotal);
    const afterDiscount = subtotal - discount;
    let shipping = 0;
    if (subtotal > 0) {
      shipping = afterDiscount >= s.freeShippingMin ? 0 : s.shippingFee;
      if (shippingMethod === 'express') shipping += s.expressFee;
    }
    const tax = round2(afterDiscount * s.sstRate);
    return {
      subtotal, discount, shipping, tax,
      total: round2(afterDiscount + shipping + tax),
      coupon: coupon && discount > 0 ? coupon.code : null
    };
  }

  /* ---------- Seeding ---------- */
  function buildHistory(status, createdAt) {
    const now = Date.now();
    const at = (offset) => new Date(Math.min(createdAt + offset, now)).toISOString();
    if (status === 'Cancelled') {
      return [{ status: 'Pending', at: at(0) }, { status: 'Cancelled', at: at(2 * HOUR) }];
    }
    const offsets = [0, 4 * HOUR, DAY + 2 * HOUR, 3 * DAY];
    return STATUSES.slice(0, STATUSES.indexOf(status) + 1).map((st, i) => ({ status: st, at: at(offsets[i]) }));
  }

  function buildSeedOrders(products) {
    const now = Date.now();
    return DATA.seedOrders.map((s, i) => {
      const cust = DATA.customers.find((c) => c.id === s.customer);
      const items = s.items.map(([pid, qty]) => {
        const p = products.find((x) => x.id === pid);
        return { id: pid, name: p.name, price: p.price, qty, art: p.art, colors: p.colors };
      });
      const d = new Date(now - s.daysAgo * DAY);
      d.setHours(9 + ((i * 3) % 11), (i * 17) % 60, 0, 0);
      const createdAt = Math.min(d.getTime(), now - 30 * 60000);
      return Object.assign({
        id: 'ORD-' + (10001 + i),
        createdAt: new Date(createdAt).toISOString(),
        customerId: cust.id,
        customerName: cust.name,
        email: cust.email,
        phone: cust.phone,
        address: { line1: cust.line1, city: cust.city, postcode: cust.postcode, state: cust.state },
        items,
        shippingMethod: 'standard',
        payment: s.payment,
        status: s.status,
        history: buildHistory(s.status, createdAt),
        notes: ''
      }, calcTotals(items, s.coupon, 'standard'));
    }).reverse();
  }

  function seed(force) {
    if (!force && read(K.version, null) === VERSION) return;
    const products = clone(DATA.products);
    write(K.products, products);
    write(K.orders, buildSeedOrders(products));
    write(K.cart, []);
    remove(K.coupon);
    if (force) { remove(K.dealers); remove(K.wholesaleSettings);try {sessionStorage.removeItem('bulk_invitation_'+DATA.demoProfile);}catch { /* optional hint */ } }
    write(K.version, VERSION);
  }
  seed(false);

  /* ---------- Products ---------- */
  const products = () => read(K.products, clone(DATA.products));
  const product = (id) => products().find((p) => p.id === id) || null;
  const saveProducts = (list) => write(K.products, list);
  const category = (id) => DATA.categories.find((c) => c.id === id) || { id, name: id, art: 'phone', colors: ['#64748b', '#94a3b8'] };

  // Add the wholesale example once without discarding existing catalogue edits.
  if (!read(K.wholesaleMigration, false)) {
    const example = DATA.products.find(p=>p.dealerExample);
    const list = products();
    if (example && !list.some(p=>p.id===example.id)) { list.push(clone(example)); saveProducts(list); }
    write(K.wholesaleMigration, true);
  }

  /* ---------- Dealer applications and product pricing ---------- */
  const dealerApplications = () => read(K.dealers, []);
  const wholesaleSettings = () => read(K.wholesaleSettings, {minimumOrderValue:0});
  function dealerApplication() {
    const u = user();
    return u?.role === 'customer' ? dealerApplications().find(a=>a.customerId===u.customerId) || null : null;
  }
  const isDealer = () => dealerApplication()?.status === 'Approved';
  function submitDealerApplication(fields) {
    const u = user();
    if (!u || u.role !== 'customer') return {ok:false,msg:'Please sign in as a customer to apply.'};
    const list = dealerApplications(), existing = list.find(a=>a.customerId===u.customerId);
    if (existing && existing.status !== 'Rejected') return {ok:false,msg:'Your application is already '+existing.status.toLowerCase()+'.'};
    const clean = {};
    for (const key of ['company','registration','contact','email','phone','address','businessType','notes']) clean[key]=String(fields[key] || '').trim().slice(0,key==='notes'?2000:500);
    if (['company','registration','contact','email','phone','address','businessType'].some(k=>!clean[k]) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email) || !fields.consent) return {ok:false,msg:'Complete the required business details and confirmation.'};
    const at = new Date().toISOString();
    const application = {...clean,id:existing?.id || 'DLR-'+(list.reduce((n,a)=>Math.max(n,Number(a.id.split('-')[1]) || 0),1000)+1),customerId:u.customerId,accountEmail:u.email,status:'Pending',submittedAt:at,reviewedAt:null,reviewNote:''};
    if (existing) list[list.indexOf(existing)]=application; else list.push(application);
    write(K.dealers,list);
    return {ok:true,application};
  }
  function reviewDealerApplication(id,status,note) {
    if (user()?.role !== 'admin') return {ok:false,msg:'Admin access is required.'};
    if (!['Approved','Rejected'].includes(status)) return {ok:false,msg:'Choose approve or reject.'};
    const list=dealerApplications(), application=list.find(a=>a.id===id);
    if (!application) return {ok:false,msg:'Application not found.'};
    application.status=status;application.reviewNote=String(note || '').trim().slice(0,2000);application.reviewedAt=new Date().toISOString();
    write(K.dealers,list);return {ok:true,application};
  }
  function saveWholesaleSettings(settings) {
    if (user()?.role !== 'admin') return {ok:false,msg:'Admin access is required.'};
    const minimumOrderValue=Number(settings.minimumOrderValue);
    if (!Number.isFinite(minimumOrderValue) || minimumOrderValue<0) return {ok:false,msg:'Enter a minimum order value of zero or more.'};
    write(K.wholesaleSettings,{minimumOrderValue:round2(minimumOrderValue)});return {ok:true};
  }
  function validateWholesaleRule(rule) {
    if (!rule?.enabled) return '';
    if (!Number.isSafeInteger(rule.minimum) || rule.minimum<1 || !Number.isSafeInteger(rule.multiple) || rule.multiple<1 || rule.minimum%rule.multiple) return 'Use a positive whole-number minimum that is a multiple of the pack increment.';
    if (!Array.isArray(rule.tiers) || !rule.tiers.length) return 'Add at least one quantity and total-price row.';
    const sorted=rule.tiers.slice().sort((a,b)=>a.quantity-b.quantity);
    if (sorted[0].quantity!==rule.minimum) return 'The first price break must equal the dealer minimum quantity.';
    for (let i=0;i<sorted.length;i++) {
      const t=sorted[i];
      if (!Number.isSafeInteger(t.quantity) || t.quantity<rule.minimum || t.quantity%rule.multiple || !Number.isFinite(t.total) || t.total<=0 || Math.abs(t.total*100-Math.round(t.total*100))>0.000001 || (i && sorted[i-1].quantity===t.quantity)) return 'Each price break needs a unique whole-number quantity matching the pack increment and a positive total price with at most two decimal places.';
      if (i && t.total/t.quantity > sorted[i-1].total/sorted[i-1].quantity+1e-9) return 'The effective unit price must stay the same or decrease at higher quantities.';
    }
    return '';
  }
  const dealerRule = p => isDealer() && p?.wholesale?.enabled ? p.wholesale : null;
  function quoteProduct(p,qty) {
    const rule=dealerRule(p);
    const tier=rule?.tiers?.filter(t=>t.quantity<=qty).sort((a,b)=>b.quantity-a.quantity)[0];
    const wholesaleApplied=Boolean(tier);
    const price=tier ? tier.total/tier.quantity : p.price;
    return {price,retailPrice:p.price,wholesaleApplied,tier:tier || null,lineTotal:round2(price*qty)};
  }
  function quantityError(p,qty) {
    if (!Number.isSafeInteger(qty) || qty<1) return 'Use a positive whole-number quantity.';
    if (qty>p.stock) return 'Only '+p.stock+' units of '+p.name+' are available.';
    const rule=dealerRule(p);
    if (rule && (qty<rule.minimum || qty%rule.multiple)) return p.name+': dealer minimum '+rule.minimum+' units; order in multiples of '+rule.multiple+'.';
    return '';
  }
  function cartValidation() {
    const raw=cartRaw(),list=products(),errors=[];
    if (!raw.length) errors.push('Your cart is empty.');
    raw.forEach(line=>{const p=list.find(p=>p.id===line.id);const error=p ? quantityError(p,line.qty) : 'A product is no longer available. Remove it from the cart.';if(error) errors.push(error);});
    if (isDealer()) {
      const min=wholesaleSettings().minimumOrderValue;
      const subtotal=cartItems().reduce((s,i)=>s+i.lineTotal,0);
      if (subtotal<min) errors.push('Dealer orders require an item subtotal of at least '+formatRM(min)+' before tax and shipping.');
    }
    return errors;
  }
  function bulkOpportunity(extra) {
    if (isDealer()) return false;
    const rows=cartRaw().map(c=>({...c}));
    if(extra) {const row=rows.find(c=>c.id===extra.id);if(row)row.qty=extra.qty;else rows.push(extra);}
    return rows.reduce((s,c)=>s+c.qty,0)>100 || rows.some(c=>c.qty>100);
  }

  /* ---------- Cart ---------- */
  const cartRaw = () => read(K.cart, []);
  function cartItems() {
    const list = products();
    return cartRaw()
      .map((c) => { const p = list.find((x) => x.id === c.id); return p ? Object.assign({}, p, { qty: c.qty }, quoteProduct(p,c.qty)) : null; })
      .filter(Boolean);
  }
  const cartCount = () => cartRaw().reduce((n, c) => n + c.qty, 0);

  function addToCart(id, qty) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    const p = product(id);
    if (!p) return { ok: false, msg: 'Product not found' };
    const cart = cartRaw();
    const line = cart.find((c) => c.id === id);
    const current = line ? line.qty : 0;
    const rule = dealerRule(p);
    if (rule) {
      const error = quantityError(p,current+qty);
      if(error) return {ok:false,msg:error};
    }
    if (p.stock <= 0) return { ok: false, msg: 'Sorry, this item is sold out' };
    if (current + qty > p.stock) {
      if (line) line.qty = p.stock; else cart.push({ id, qty: p.stock });
      write(K.cart, cart);
      return { ok: true, capped: true, msg: 'Only ' + p.stock + ' in stock — cart updated to maximum' };
    }
    if (line) line.qty += qty; else cart.push({ id, qty });
    write(K.cart, cart);
    return { ok: true, msg: p.name + ' added to cart' };
  }

  function setQty(id, qty) {
    const p = product(id);
    qty = parseInt(qty, 10) || 0;
    let cart = cartRaw();
    if (qty>0 && p) {const error=quantityError(p,qty);if(error) return {ok:false,msg:error};}
    if (qty <= 0) cart = cart.filter((c) => c.id !== id);
    else cart.forEach((c) => { if (c.id === id) c.qty = p ? Math.min(qty, p.stock) : qty; });
    write(K.cart, cart);
    return {ok:true};
  }
  const removeFromCart = (id) => setQty(id, 0);
  const clearCart = () => { write(K.cart, []); remove(K.coupon); };

  const getCoupon = () => read(K.coupon, null);
  function applyCoupon(code) {
    if (cartItems().some(i=>i.wholesaleApplied)) return {ok:false,msg:'Retail coupons do not stack with dealer prices.'};
    const c = findCoupon(code);
    if (!c) return { ok: false, msg: 'Invalid coupon code' };
    const sub = cartItems().reduce((s, i) => s + i.price * i.qty, 0);
    if (sub < (c.min || 0)) return { ok: false, msg: 'This coupon requires a minimum spend of ' + formatRM(c.min) };
    write(K.coupon, c.code);
    return { ok: true, msg: 'Coupon applied: ' + c.label };
  }
  const removeCoupon = () => remove(K.coupon);
  const cartTotals = (shippingMethod) => calcTotals(cartItems(), getCoupon(), shippingMethod);

  /* ---------- Orders ---------- */
  const orders = () => read(K.orders, []);
  const order = (id) => orders().find((o) => o.id === id) || null;
  const saveOrders = (list) => write(K.orders, list);

  function placeOrder(info) {
    const items = cartItems();
    if (!items.length) return { ok: false, msg: 'Your cart is empty' };
    const u = user();
    if (!u || u.role!=='customer') return {ok:false,msg:'Please sign in as a customer before ordering.'};
    const errors=cartValidation();
    if(errors.length) return {ok:false,msg:errors.join(' ')};
    const list = orders();
    const nextNum = list.reduce((m, o) => Math.max(m, parseInt(o.id.replace(/\D/g, ''), 10) || 0), 10000) + 1;
    const now = new Date().toISOString();
    const lines = items.map((p) => ({ id: p.id, name: p.name, price: p.price, retailPrice:p.retailPrice, wholesaleApplied:p.wholesaleApplied, pricingTier:p.tier, qty: p.qty, art: p.art, colors: p.colors }));
    const o = Object.assign({
      id: 'ORD-' + nextNum,
      createdAt: now,
      customerId: u ? u.customerId : null,
      buyerType: isDealer() ? 'Dealer' : 'Retail',
      customerName: info.name,
      email: info.email,
      phone: info.phone,
      address: { line1: info.line1, city: info.city, postcode: info.postcode, state: info.state },
      items: lines,
      shippingMethod: info.shippingMethod || 'standard',
      payment: info.payment,
      status: 'Pending',
      history: [{ status: 'Pending', at: now }],
      notes: info.notes || ''
    }, calcTotals(lines, getCoupon(), info.shippingMethod));
    list.unshift(o);
    saveOrders(list);

    // Reduce stock
    const prods = products();
    lines.forEach((l) => { const p = prods.find((x) => x.id === l.id); if (p) p.stock = Math.max(0, p.stock - l.qty); });
    saveProducts(prods);

    clearCart();
    return { ok: true, order: o };
  }

  function updateOrderStatus(id, status) {
    const list = orders();
    const o = list.find((x) => x.id === id);
    if (!o || o.status === status) return o;
    // Restock if cancelling, deduct again if un-cancelling
    if (status === 'Cancelled' || o.status === 'Cancelled') {
      const sign = status === 'Cancelled' ? 1 : -1;
      const prods = products();
      o.items.forEach((l) => { const p = prods.find((x) => x.id === l.id); if (p) p.stock = Math.max(0, p.stock + sign * l.qty); });
      saveProducts(prods);
    }
    o.status = status;
    o.history.push({ status, at: new Date().toISOString() });
    saveOrders(list);
    return o;
  }

  /* ---------- Auth ---------- */
  // Per-tab sessions let a presenter keep a customer and an admin open together.
  let tabSession;
  function user() {
    try {
      const raw=sessionStorage.getItem(K.session);
      if(raw!==null) return JSON.parse(raw);
      const previous=read(K.session,null);
      sessionStorage.setItem(K.session,JSON.stringify(previous));return previous;
    } catch {return tabSession===undefined ? read(K.session,null) : tabSession;}
  }
  function login(username, password) {
    const u = DATA.users.find((x) => x.username === String(username).trim().toLowerCase() && x.password === password);
    if (!u) return { ok: false, msg: 'Incorrect username or password' };
    const session = { username: u.username, role: u.role, name: u.name, email: u.email, phone: u.phone || '', customerId: u.customerId || null, address: u.address || null };
    write(K.session, session);
    tabSession=session;
    try {sessionStorage.setItem(K.session,JSON.stringify(session));} catch { /* memory fallback */ }
    return { ok: true, user: session };
  }
  const logout = () => {remove(K.session);tabSession=null;try {sessionStorage.setItem(K.session,'null');} catch { /* memory fallback */ }};

  function base() { return (document.body && document.body.dataset.base) || ''; }

  // Redirects to login when the current user does not have the role. Returns true when allowed.
  function requireRole(role) {
    const u = user();
    if (u && u.role === role) return true;
    const page = location.pathname.split('/').pop() || 'index.html';
    const target = (base() ? 'admin/' : '') + page + location.search;
    location.replace(base() + 'login.html?redirect=' + encodeURIComponent(target) + (u ? '&switch=1' : ''));
    return false;
  }

  /* ---------- Helpers ---------- */
  function formatRM(n) {
    return 'RM ' + Number(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function formatUnitPrice(n) {
    return 'RM '+Number(n || 0).toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:6});
  }
  function formatDate(iso, withTime) {
    const d = new Date(iso);
    const opts = { day: 'numeric', month: 'short', year: 'numeric' };
    if (withTime) Object.assign(opts, { hour: 'numeric', minute: '2-digit' });
    return d.toLocaleString('en-MY', opts);
  }

  const resetDemo = () => seed(true);

  window.Store = {
    STATUSES, products, product, saveProducts, category,
    cartItems, cartCount, addToCart, setQty, removeFromCart, clearCart,
    getCoupon, applyCoupon, removeCoupon, cartTotals, calcTotals,
    orders, order, saveOrders, placeOrder, updateOrderStatus,
    user, login, logout, requireRole, base,
    formatRM, formatUnitPrice, formatDate, resetDemo,
    dealerApplications,dealerApplication,isDealer,submitDealerApplication,reviewDealerApplication,
    wholesaleSettings,saveWholesaleSettings,validateWholesaleRule,dealerRule,quoteProduct,quantityError,cartValidation,bulkOpportunity,
    storagePrefix:NS
  };
})();
