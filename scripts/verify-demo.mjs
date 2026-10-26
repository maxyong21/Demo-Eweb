import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createDemoServer } from './serve.mjs';

// Uses an existing Playwright installation; does not add dependencies to the demo.
const require = createRequire(import.meta.url);
let chromium;
try { ({chromium} = require('playwright')); }
catch {
  const cache = path.join(process.env.LOCALAPPDATA || '', 'npm-cache', '_npx');
  for (const entry of await readdir(cache).catch(()=>[])) {
    try { ({chromium} = require(path.join(cache,entry,'node_modules','playwright'))); break; } catch { /* next cached install */ }
  }
}
if (!chromium) throw new Error('Playwright is required to run browser verification.');
const server = createDemoServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors = [];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/proposal.html');
  assert.match(await page.title(),/Lucky Dotcom/);
  assert.match(await page.locator('#scenario-sales').innerText(),/57,750/);
  await page.locator('#monthly-orders').fill('200');
  assert.match(await page.locator('#scenario-sales').innerText(),/115,500/);
  await page.locator('#order-growth').fill('-30');
  await page.locator('#basket-growth').fill('-30');
  assert.match(await page.locator('#scenario-sales').innerText(),/49,000/);
  assert.match(await page.locator('#sales-difference').innerText(),/−/);
  await page.locator('#monthly-orders').fill('-1');
  assert.equal(await page.locator('#scenario-sales').innerText(),'—');
  await page.locator('#reset-scenario').click();
  await page.locator('#monthly-orders').fill('0');
  assert.equal(await page.locator('#monthly-orders').getAttribute('aria-invalid'),'false');
  await page.locator('#reset-scenario').click();
  const screenshots = `.generated/verification-${Date.now()}`;
  await mkdir(screenshots,{recursive:true});
  await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
  await page.screenshot({path:`${screenshots}/proposal-desktop.png`,fullPage:true});
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),'Proposal overflows on mobile');
  await page.screenshot({path:`${screenshots}/proposal-mobile.png`,fullPage:true});
  // Follow the same login journey that the client sees.
  await page.locator('a[href="login.html?redirect=admin%2Findex.html"]').first().click();
  await page.locator('[data-fill="admin"]').click();
  await page.waitForURL('**/admin/index.html');
  assert.equal(await page.locator('.kpis .kpi').count(),4);
  const expected = await page.evaluate(()=>Store.orders().filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+o.total,0));
  const shown = Number((await page.locator('.kpi-value').first().innerText()).replace(/[^\d.]/g,''));
  assert(Math.abs(expected-shown)<.01,'Order value differs from stored order totals');
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('[data-day]').first().click();
  assert.match(await page.locator('#chart-detail').innerText(),/order value/);
  await page.locator('[data-metric="count"]').click();
  assert.equal(await page.locator('[data-metric="count"]').getAttribute('aria-pressed'),'true');
  await page.locator('#period').selectOption('7');
  assert.equal(await page.locator('[data-day]').count(),7);
  await page.locator('#status-filter').selectOption('Cancelled');
  assert.equal(await page.locator('.kpi-value').first().innerText(),'RM 0.00');
  assert.match(await page.locator('.analytics-table').innerText(),/No orders match/);
  await page.locator('#period').selectOption('30');
  assert.equal(await page.locator('.analytics-table [data-order]').count(),1);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-report').click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(),/30-days-cancelled\.csv/);
  const csv = await download.createReadStream();
  let text='';for await (const chunk of csv) text+=chunk;
  assert.match(text,/Cancelled/);assert.match(text,/"0.00"/);
  await page.locator('#clear-status').click();
  await page.locator('[data-category]').first().click();
  assert.match(await page.locator('#category-detail').innerText(),/units/);
  await page.locator('[data-status="Pending"]').click();
  assert.equal(await page.locator('#status-filter').inputValue(),'Pending');
  await page.locator('[data-order]').first().click();
  await page.locator('#om-status').selectOption('Processing');
  await page.locator('#om-save').click();
  assert.equal(await page.locator('.kpi-value').nth(1).innerText(),'1','Status update did not refresh dashboard');
  await page.locator('#clear-status').click();
  await page.locator('#period').selectOption('14');
  await page.locator('[data-metric="value"]').click();
  await page.locator('.toast').first().waitFor({state:'detached'});
  await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
  await page.screenshot({path:`${screenshots}/dashboard-desktop.png`,fullPage:true});
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),'Dashboard overflows on mobile');
  await page.screenshot({path:`${screenshots}/dashboard-mobile.png`,fullPage:true});
  await page.locator('.admin-menu').click();
  assert(await page.locator('body').evaluate(el=>el.classList.contains('side-open')));
  // Verify existing storefront and its proposal entry point still render.
  await page.goto(base+'/index.html');
  assert.equal(await page.locator('#main-nav a[href="proposal.html"]').count(),1);
  assert((await page.locator('.product-card').count())>0);
  for (const width of [390,1024,1440]) {
    await page.setViewportSize({width,height:900});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),`Storefront overflows at ${width}px`);
  }
  assert.deepEqual(errors,[],'Browser JavaScript errors');
  console.log('PASS: proposal calculator, mobile layouts, demo login, filtered analytics, order updates, category details, CSV export and storefront.');
  console.log(`Screenshots: ${screenshots}`);
} finally {
  await browser?.close();
  await new Promise(resolve=>server.close(resolve));
}
