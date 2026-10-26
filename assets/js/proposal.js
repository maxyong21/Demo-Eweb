(function () {
  const $ = id => document.getElementById(id);
  const format = n => new Intl.NumberFormat('en-MY',{style:'currency',currency:'MYR',maximumFractionDigits:0}).format(n);
  const signed = n => (n >= 0 ? '+' : '−') + Math.abs(n) + '%';
  function calculate() {
    const orders = $('monthly-orders'), average = $('order-value');
    const growth = Number($('order-growth').value), basket = Number($('basket-growth').value);
    $('order-growth-label').textContent = signed(growth);
    $('basket-growth-label').textContent = signed(basket);
    const valid = orders.value !== '' && average.value !== '' && orders.validity.valid && average.validity.valid;
    $('calculator-error').textContent = valid ? '' : 'Enter a valid order count and average order value of zero or more.';
    orders.setAttribute('aria-invalid',String(!orders.value || !orders.validity.valid));
    average.setAttribute('aria-invalid',String(!average.value || !average.validity.valid));
    const current = Number(orders.value) * Number(average.value);
    const scenario = current * (1 + growth/100) * (1 + basket/100);
    $('current-sales').textContent = valid ? format(current) : '—';
    $('scenario-sales').textContent = valid ? format(scenario) : '—';
    $('sales-difference').textContent = valid ? (scenario-current >= 0 ? '+' : '−') + format(Math.abs(scenario-current)) : '—';
  }
  ['monthly-orders','order-value','order-growth','basket-growth'].forEach(id => $(id).addEventListener('input',calculate));
  $('reset-scenario').addEventListener('click',()=>{
    $('monthly-orders').value=100;$('order-value').value=500;$('order-growth').value=10;$('basket-growth').value=5;calculate();
  });
  $('print-proposal').addEventListener('click',()=>window.print());
  calculate();
})();
