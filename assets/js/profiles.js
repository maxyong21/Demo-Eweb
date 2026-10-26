/* Change a catalogue, not the application. Each profile uses the same product schema. */
(function () {
  const original = JSON.parse(JSON.stringify(window.DATA));
  const themes = {
    gadgets: {
      label: 'Gadgets & electronics', name: 'VoltHub', first: 'Volt', last: 'Hub',
      headline: ['Find your next gadget.', 'Keep life connected.'],
      description: 'Explore phones, audio, wearables and everyday accessories in this sample gadget store.',
      search: 'Search phones, audio, accessories…',
      caution: 'Client-specific features such as dealer approval, quantity pricing and quotations are separate scope.',
      categories: original.categories, products: original.products,
      threshold:500, shipping:15, priceBreaks:[500,1500,4000],
      note:'Compatibility, warranty and delivery details are sample information.'
    },
    automotive: {
      label: 'Automotive spare parts', name: 'PartsHub', first: 'Parts', last: 'Hub',
      headline: ['Keep your workshop moving.', 'Find the parts you need.'],
      description: 'Explore service parts, filters, lighting and workshop essentials in this sample automotive catalogue.',
      search: 'Search brake pads, filters, engine oil…',
      caution: 'Vehicle fitment lookup, VIN matching and OEM cross-referencing are not implemented. Confirm compatibility before any real purchase.',
      threshold:250, shipping:15, priceBreaks:[50,150,400],
      note:'Fitment descriptions are illustrative. This demo does not validate vehicle compatibility.',
      categories:[
        ['brakes','Brakes','brake'],['filters','Filters','filter'],['lubricants','Lubricants','oil'],
        ['electrical','Electrical','battery'],['lighting','Lighting','bulb'],['workshop','Workshop essentials','tool']
      ],
      items:[
        ['Ceramic Brake Pad Set','brakes','brake',85,99,40,'Front axle set · sample fitment only',{Fitment:'Passenger car example; confirm model, year and part number',Contents:'4 brake pads',Material:'Ceramic compound'}],
        ['Ventilated Brake Disc Pair','brakes','brake',220,250,18,'Two front discs for a sample passenger-car application',{Fitment:'Illustrative 260 mm application; verify before ordering',Contents:'2 brake discs',Diameter:'260 mm example'}],
        ['Cabin Air Filter','filters','filter',28,null,80,'Replacement cabin filter · one piece',{Fitment:'Check housing dimensions and vehicle application',Contents:'1 filter',Media:'Pleated filter media'}],
        ['Engine Oil Filter','filters','filter',18,22,120,'Spin-on filter for an illustrative service application',{Fitment:'Confirm thread, dimensions and engine application',Contents:'1 oil filter',Type:'Spin-on example'}],
        ['Synthetic Engine Oil 5W-30 · 4L','lubricants','oil',125,139,50,'A 4-litre bottle for your sample service order',{Volume:'4 litres',Grade:'5W-30 example',Application:'Consult vehicle specifications; suitability is not validated'}],
        ['Brake Fluid DOT 4 · 500ml','lubricants','oil',24,null,70,'500ml service bottle · verify vehicle requirements',{Volume:'500 ml',Type:'DOT 4 example',Application:'Check vehicle manufacturer requirements'}],
        ['Maintenance-Free Battery · Example 55B24L','electrical','battery',230,260,14,'Sample battery size · confirm terminal position and fit',{Voltage:'12 V example',Fitment:'Verify battery tray, terminals and vehicle specification',Contents:'1 battery'}],
        ['Spark Plug Set · 4 Pieces','electrical','tool',68,null,60,'Four sample replacement spark plugs',{Contents:'4 spark plugs',Fitment:'Verify thread, reach and heat range',Type:'Illustrative service part'}],
        ['Halogen Headlamp Bulb Pair · H4','lighting','bulb',32,38,90,'Two example H4 bulbs · check vehicle compatibility',{Contents:'2 bulbs',Fitting:'H4 example',Fitment:'Check lamp housing and electrical requirements'}],
        ['Rear Indicator Bulb Pack','lighting','bulb',12,null,150,'Two sample amber indicator bulbs',{Contents:'2 bulbs',Colour:'Amber',Fitment:'Confirm bulb base and wattage before purchase'}],
        ['Wiper Blade Pair · 20 / 18 inch','workshop','tool',45,null,55,'Sample front wiper pair · check size and attachment',{Contents:'2 blades',Size:'20 / 18 inch example',Fitment:'Verify arm connection and vehicle requirements'}],
        ['Socket Tool Set · 24 Pieces','workshop','tool',160,185,8,'A compact example kit for workshop demonstrations',{Contents:'24 pieces',Use:'Workshop hand tools',Case:'Carry case included in sample'}],
        ['Engine Air Filter','filters','filter',35,null,65,'Example pleated engine intake filter',{Contents:'1 filter',Fitment:'Match vehicle application and dimensions',Type:'Panel filter'}],
        ['Transmission Fluid · 1L','lubricants','oil',48,null,36,'Sample service fluid · match the required specification',{Volume:'1 litre',Application:'Confirm transmission specification',Type:'Illustrative fluid product'}],
        ['Brake Cleaner · 500ml','workshop','oil',16,19,100,'A 500ml sample workshop cleaning aerosol',{Volume:'500 ml',Use:'Workshop cleaning example',Handling:'Follow the actual product label and shipping restrictions'}],
        ['Workshop Inspection Light','lighting','bulb',75,89,6,'Example rechargeable work light',{Use:'Workshop lighting',Power:'Rechargeable example',Contents:'1 inspection light'}]
      ]
    },
    grocery: {
      label: 'Kedai runcit & snacks', name: 'RuncitHub', first: 'Runcit', last: 'Hub',
      headline: ['Everyday favourites.', 'One easy basket.'],
      description: 'Browse snacks, drinks, pantry staples and household supplies in this sample kedai runcit.',
      search: 'Search snacks, biscuits, drinks, rice…',
      caution: 'Batch expiry tracking, weighed goods and delivery time slots are not implemented. Pack sizes and food information are sample data.',
      threshold:100, shipping:8, priceBreaks:[10,30,60],
      note:'Pack sizes are examples. Actual ingredients, allergens and expiry dates must come from the supplier.',
      categories:[
        ['snacks','Snacks','snack'],['biscuits','Biscuits','box'],['drinks','Drinks','bottle'],
        ['pantry','Pantry staples','bag'],['noodles','Instant noodles','box'],['household','Household','bottle']
      ],
      items:[
        ['Potato Chips · Original 100g','snacks','snack',4.5,5.2,120,'Single 100g bag of sample original-flavour crisps',{Pack:'1 × 100 g',Unit:'Bag',Storage:'Cool, dry place'}],
        ['Corn Snacks · Cheese 60g','snacks','snack',2.8,null,160,'Single 60g bag · sample cheese-flavour snack',{Pack:'1 × 60 g',Unit:'Bag',Storage:'Cool, dry place'}],
        ['Roasted Peanuts · 200g','snacks','bag',6.9,7.5,75,'A 200g pack of sample roasted peanuts',{Pack:'1 × 200 g',Unit:'Pack',Allergens:'Peanuts; check the actual supplier label'}],
        ['Cream Crackers · 300g','biscuits','box',5.4,6.2,90,'A 300g sample pack for the pantry',{Pack:'1 × 300 g',Unit:'Pack',Storage:'Keep sealed in a dry place'}],
        ['Chocolate Sandwich Biscuits · 120g','biscuits','box',3.2,null,140,'A sample 120g biscuit pack',{Pack:'1 × 120 g',Unit:'Pack',Ingredients:'Refer to actual packaging'}],
        ['Butter Cookies · 400g Tin','biscuits','box',18.9,21.9,28,'A 400g sample cookie tin',{Pack:'1 × 400 g',Unit:'Tin',Ingredients:'Refer to actual packaging'}],
        ['Mineral Water · 24 × 500ml','drinks','bottle',13.9,15.9,65,'One carton with 24 sample 500ml bottles',{Pack:'24 × 500 ml',Unit:'Carton',Storage:'Store away from heat and sunlight'}],
        ['Malt Drink · 6 × 200ml','drinks','bottle',9.8,null,48,'A six-pack of sample malt drinks',{Pack:'6 × 200 ml',Unit:'Multipack',Ingredients:'Refer to actual packaging'}],
        ['Jasmine Rice · 5kg','pantry','bag',29.9,32.9,45,'One 5kg sample bag of rice',{Pack:'1 × 5 kg',Unit:'Bag',Storage:'Cool, dry place'}],
        ['Cooking Oil · 1kg','pantry','bottle',7.5,null,80,'One 1kg sample bottle of cooking oil',{Pack:'1 × 1 kg',Unit:'Bottle',Storage:'Refer to actual packaging'}],
        ['White Sugar · 1kg','pantry','bag',3.1,null,100,'One 1kg sample pack of sugar',{Pack:'1 × 1 kg',Unit:'Pack',Storage:'Keep dry and sealed'}],
        ['Instant Noodles · Curry 5-Pack','noodles','box',5.9,6.5,110,'Five sample packets in one multipack',{Pack:'5 packets',Unit:'Multipack',Ingredients:'Check the actual label for ingredients and allergens'}],
        ['Cup Noodles · Chicken 65g','noodles','box',2.9,null,130,'One 65g sample cup',{Pack:'1 × 65 g',Unit:'Cup',Preparation:'Follow actual packaging instructions'}],
        ['Dishwashing Liquid · 900ml','household','bottle',5.5,null,60,'One sample household cleaning bottle',{Pack:'1 × 900 ml',Unit:'Bottle',Handling:'Follow actual label instructions'}],
        ['Facial Tissues · 4 Boxes','household','box',10.9,12.9,7,'Four sample tissue boxes in a bundle',{Pack:'4 boxes',Unit:'Bundle',Use:'Household essentials'}],
        ['Chocolate Wafer Bars · 12-Pack','snacks','box',8.9,9.9,5,'A sample multipack of twelve wafer bars',{Pack:'12 bars',Unit:'Multipack',Ingredients:'Refer to actual packaging'}]
      ]
    }
  };
  const palettes = [['#0f766e','#99f6e4'],['#b45309','#fde68a'],['#334155','#94a3b8'],['#4f46e5','#c4b5fd'],['#be123c','#fda4af'],['#15803d','#bbf7d0']];
  for (const [id,t] of Object.entries(themes)) {
    if (!t.items) continue;
    t.categories = t.categories.map(([key,name,art],i)=>({id:key,name,art,colors:palettes[i]}));
    t.products = t.items.map(([name,category,art,price,oldPrice,stock,short,specs],i)=>({
      id:(id==='automotive'?'A':'G')+(1001+i),name,category,art,price,oldPrice,stock,short,specs,
      desc:short+'. '+t.note,colors:t.categories.find(c=>c.id===category).colors,
      rating:4.5,reviews:0,featured:[0,3,4,6,8,11,14,15].includes(i)
    }));
    delete t.items;
  }
  function saved(storage,key) { try {return storage.getItem(key);} catch {return null;} }
  function remember(storage,key,value) { try {storage.setItem(key,value);} catch { /* URL still works */ } }
  // sessionStorage keeps simultaneous client-demo tabs on their own selection.
  const requested = new URLSearchParams(location.search).get('demo');
  let session,local;
  try {session=window.sessionStorage;} catch {session=null;}
  try {local=window.localStorage;} catch {local=null;}
  const candidates = [requested,saved(session,'demo_profile'),saved(local,'demo_profile'),'gadgets'];
  const active = candidates.find(id=>Object.hasOwn(themes,id));
  remember(session,'demo_profile',active);
  remember(local,'demo_profile',active);
  const theme = themes[active];
  DATA.demoProfile = active;
  DATA.store = {...original.store,name:theme.name,tagline:theme.description,email:'hello@'+theme.name.toLowerCase()+'.demo'};
  DATA.categories = theme.categories;
  DATA.products = theme.products;
  DATA.settings = {...original.settings,freeShippingMin:theme.threshold,shippingFee:theme.shipping};
  if (active !== 'gadgets') {
    DATA.seedOrders = original.seedOrders.map(order=>({...order,items:order.items.map(([id,qty])=>[
      theme.products[Number(id.slice(1))-1001].id,active==='grocery'?qty*6:qty
    ])}));
    DATA.reviews = [{name:'Sample customer',rating:5,date:'Demo only',text:'This is illustrative review content, not a verified customer review.'}];
  }
  function switchTo(id) {
    if (!Object.hasOwn(themes,id) || id===active) return;
    remember(session,'demo_profile',id);remember(local,'demo_profile',id);
    const url = new URL(location.href);
    const redirect = url.searchParams.get('redirect');
    url.search='';url.hash='';url.searchParams.set('demo',id);
    if (url.pathname.endsWith('/product.html')) url.searchParams.set('id',themes[id].products[0].id);
    if (url.pathname.endsWith('/login.html') && redirect) url.searchParams.set('redirect',redirect);
    if (url.pathname.endsWith('/checkout.html')) url.pathname=url.pathname.replace(/checkout\.html$/,'cart.html');
    location.assign(url.href);
  }
  function selector() {
    return `<label class="demo-profile-label" for="demo-profile">Business demo<select id="demo-profile" aria-describedby="demo-profile-note">${Object.entries(themes).map(([id,t])=>`<option value="${id}" ${id===active?'selected':''}>${t.label}</option>`).join('')}</select></label><span id="demo-profile-note">Sample catalogue · separate data for each business</span>`;
  }
  function bind() {
    document.getElementById('demo-profile')?.addEventListener('change',e=>switchTo(e.target.value));
    // Links retain this tab's profile, including opening product links in another tab.
    document.addEventListener('click',e=>{
      const link=e.target.closest('a[href]');
      if (!link || link.getAttribute('href').startsWith('#')) return;
      const url=new URL(link.href,location.href);
      if (url.origin===location.origin && url.pathname.endsWith('.html') && !url.pathname.endsWith('/proposal.html')) {
        url.searchParams.set('demo',active);link.href=url.href;
      }
    },true);
  }
  function priceRanges() {
    const [a,b,c]=theme.priceBreaks;
    return [{id:'all',label:'Any price',min:0,max:Infinity},{id:'low',label:`Under RM ${a}`,min:0,max:a},
      {id:'mid',label:`RM ${a} – RM ${b}`,min:a,max:b},{id:'high',label:`RM ${b} – RM ${c}`,min:b,max:c},
      {id:'top',label:`RM ${c} and above`,min:c,max:Infinity}];
  }
  window.Demo = {active,theme,profiles:themes,selector,bind,switchTo,priceRanges};
})();
