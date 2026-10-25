/* =========================================================
   VoltHub Demo Store — hardcoded demo data
   Everything the demo needs lives here. Edit freely.
   ========================================================= */
window.DATA = {
  store: {
    name: 'VoltHub',
    tagline: 'Next-gen tech, delivered tomorrow.',
    email: 'hello@volthub.demo',
    phone: '+60 3-2345 6789',
    address: 'Level 8, Menara Demo, Jalan Ampang, 50450 Kuala Lumpur'
  },

  settings: {
    currency: 'RM',
    sstRate: 0.08,          // 8% SST
    freeShippingMin: 500,   // free standard shipping at/above this (after discount)
    shippingFee: 15,
    expressFee: 25
  },

  users: [
    {
      username: 'user', password: 'user123', role: 'customer',
      name: 'Daniel Tan', email: 'daniel.tan@demo.my', phone: '+60 12-345 6789',
      customerId: 'C001',
      address: { line1: '12, Jalan Bukit Bintang', city: 'Kuala Lumpur', postcode: '55100', state: 'W.P. Kuala Lumpur' }
    },
    {
      username: 'admin', password: 'admin123', role: 'admin',
      name: 'Store Admin', email: 'admin@volthub.demo'
    }
  ],

  coupons: [
    { code: 'DEMO10', type: 'percent', value: 10, min: 0, label: '10% off your order' },
    { code: 'WELCOME50', type: 'fixed', value: 50, min: 300, label: 'RM 50 off orders above RM 300' }
  ],

  categories: [
    { id: 'smartphones', name: 'Smartphones', art: 'phone', colors: ['#6366f1', '#22d3ee'] },
    { id: 'laptops', name: 'Laptops', art: 'laptop', colors: ['#475569', '#94a3b8'] },
    { id: 'audio', name: 'Audio', art: 'headphones', colors: ['#0ea5e9', '#1e3a8a'] },
    { id: 'wearables', name: 'Wearables', art: 'watch', colors: ['#14b8a6', '#84cc16'] },
    { id: 'tablets', name: 'Tablets', art: 'tablet', colors: ['#8b5cf6', '#06b6d4'] },
    { id: 'accessories', name: 'Accessories', art: 'powerbank', colors: ['#22c55e', '#0ea5e9'] },
    { id: 'gaming', name: 'Gaming', art: 'controller', colors: ['#ec4899', '#8b5cf6'] },
    { id: 'cameras', name: 'Cameras', art: 'camera', colors: ['#78716c', '#f59e0b'] }
  ],

  products: [
    {
      id: 'P1001', name: 'Nova X12 Pro', category: 'smartphones', art: 'phone', colors: ['#6366f1', '#22d3ee'],
      price: 4299, oldPrice: 4699, stock: 24, rating: 4.8, reviews: 1284, featured: true,
      short: '6.7" 120Hz OLED, 200MP triple camera and an all-day 5,000mAh battery.',
      desc: 'The Nova X12 Pro is our flagship smartphone, built for people who want the very best. A stunning 6.7-inch LTPO OLED display, pro-grade 200MP camera system with 10x optical zoom, and the latest 3nm processor make it the fastest phone we have ever sold.',
      specs: { Display: '6.7" LTPO OLED, 120Hz', Processor: 'Octa-core 3nm', Memory: '12GB RAM / 256GB', Camera: '200MP + 50MP + 12MP', Battery: '5,000mAh, 65W fast charge', Warranty: '1 Year Official' }
    },
    {
      id: 'P1002', name: 'Nova A5 Lite', category: 'smartphones', art: 'phone', colors: ['#f472b6', '#fb923c'],
      price: 1099, oldPrice: null, stock: 58, rating: 4.4, reviews: 642, featured: false,
      short: 'Everyday smartphone with a big 6.5" display and 2-day battery life.',
      desc: 'Affordable without compromise. The Nova A5 Lite brings a large 6.5-inch display, dual camera and a massive battery that easily lasts two days of normal use.',
      specs: { Display: '6.5" IPS LCD, 90Hz', Processor: 'Octa-core 6nm', Memory: '6GB RAM / 128GB', Camera: '50MP + 2MP', Battery: '6,000mAh, 25W', Warranty: '1 Year Official' }
    },
    {
      id: 'P1003', name: 'Pixelon 8', category: 'smartphones', art: 'phone', colors: ['#10b981', '#3b82f6'],
      price: 2899, oldPrice: 3199, stock: 6, rating: 4.7, reviews: 913, featured: false,
      short: 'Pure software, brilliant AI camera and 7 years of updates.',
      desc: 'Pixelon 8 is all about smart photography. Its AI-powered camera produces beautiful photos in any light, and it is guaranteed 7 years of software and security updates.',
      specs: { Display: '6.2" OLED, 120Hz', Processor: 'Tensor-class AI chip', Memory: '8GB RAM / 128GB', Camera: '50MP + 12MP ultrawide', Battery: '4,575mAh, 27W', Warranty: '1 Year Official' }
    },
    {
      id: 'P1004', name: 'AeroBook Air 14', category: 'laptops', art: 'laptop', colors: ['#64748b', '#cbd5e1'],
      price: 5499, oldPrice: 5999, stock: 12, rating: 4.9, reviews: 476, featured: true,
      short: 'Ultra-thin 1.2kg laptop with 18-hour battery and a 2.8K display.',
      desc: 'Weighing just 1.2kg and only 11mm thin, the AeroBook Air 14 goes wherever you go. A gorgeous 2.8K display, silent fanless design and up to 18 hours of battery make it the perfect work and study companion.',
      specs: { Display: '14" 2.8K IPS, 100% sRGB', Processor: '10-core ARM chip', Memory: '16GB RAM / 512GB SSD', Weight: '1.2 kg', Battery: 'Up to 18 hours', Warranty: '2 Years Official' }
    },
    {
      id: 'P1005', name: 'TitanForce G16 Gaming Laptop', category: 'laptops', art: 'laptop', colors: ['#ef4444', '#7c3aed'],
      price: 7999, oldPrice: null, stock: 5, rating: 4.7, reviews: 238, featured: true,
      short: 'RTX-class graphics, 240Hz screen and RGB keyboard for serious gamers.',
      desc: 'Dominate every game. The TitanForce G16 packs a desktop-class GPU, 240Hz QHD+ display and an advanced vapour-chamber cooling system to keep frame rates high and temperatures low.',
      specs: { Display: '16" QHD+ 240Hz', Processor: '14-core i9-class', Graphics: 'RTX-class 8GB', Memory: '32GB RAM / 1TB SSD', Weight: '2.5 kg', Warranty: '2 Years Official' }
    },
    {
      id: 'P1006', name: 'SonicWave ANC 700', category: 'audio', art: 'headphones', colors: ['#0ea5e9', '#1e3a8a'],
      price: 1299, oldPrice: 1499, stock: 40, rating: 4.8, reviews: 2051, featured: true,
      short: 'Industry-leading noise cancelling with 40-hour battery.',
      desc: 'Block out the world and focus on your music. SonicWave ANC 700 features adaptive noise cancelling, hi-res audio and plush memory-foam ear cushions for all-day comfort.',
      specs: { Type: 'Over-ear, wireless', 'Noise Cancelling': 'Adaptive ANC', Battery: '40 hours (ANC on)', Connectivity: 'Bluetooth 5.3, multipoint', Weight: '250 g', Warranty: '1 Year Official' }
    },
    {
      id: 'P1007', name: 'PulseBuds Pro 2', category: 'audio', art: 'earbuds', colors: ['#a78bfa', '#f0abfc'],
      price: 699, oldPrice: 799, stock: 75, rating: 4.6, reviews: 1532, featured: false,
      short: 'True wireless earbuds with ANC, spatial audio and IP54.',
      desc: 'Tiny earbuds, huge sound. PulseBuds Pro 2 deliver rich bass, active noise cancelling and spatial audio in a compact charging case that fits any pocket.',
      specs: { Type: 'True wireless in-ear', 'Noise Cancelling': 'Active ANC', Battery: '8h + 24h with case', 'Water Resistance': 'IP54', Charging: 'USB-C & wireless', Warranty: '1 Year Official' }
    },
    {
      id: 'P1008', name: 'BoomCore Mini Speaker', category: 'audio', art: 'speaker', colors: ['#f59e0b', '#ef4444'],
      price: 349, oldPrice: null, stock: 90, rating: 4.5, reviews: 864, featured: false,
      short: 'Pocket-sized waterproof speaker with surprisingly big 360° sound.',
      desc: 'Take the party anywhere. BoomCore Mini is fully waterproof, dustproof and drop-resistant, with 360° sound and 12 hours of playtime.',
      specs: { Output: '10W, 360° sound', Battery: '12 hours', 'Water Resistance': 'IP67', Connectivity: 'Bluetooth 5.2', Weight: '320 g', Warranty: '1 Year Official' }
    },
    {
      id: 'P1009', name: 'FitPulse Watch S3', category: 'wearables', art: 'watch', colors: ['#14b8a6', '#84cc16'],
      price: 1199, oldPrice: null, stock: 33, rating: 4.7, reviews: 721, featured: true,
      short: 'AMOLED smartwatch with GPS, ECG, SpO2 and 10-day battery.',
      desc: 'Your health, on your wrist. FitPulse Watch S3 tracks heart rate, ECG, blood oxygen, sleep and over 100 workout modes, with built-in GPS and a bright always-on AMOLED display.',
      specs: { Display: '1.43" AMOLED, always-on', Sensors: 'HR, ECG, SpO2, GPS', Battery: 'Up to 10 days', 'Water Resistance': '5 ATM', Compatibility: 'Android & iOS', Warranty: '1 Year Official' }
    },
    {
      id: 'P1010', name: 'FitBand Go', category: 'wearables', art: 'watch', colors: ['#fb7185', '#fbbf24'],
      price: 199, oldPrice: 249, stock: 120, rating: 4.3, reviews: 1890, featured: false,
      short: 'Lightweight fitness band with heart-rate and sleep tracking.',
      desc: 'Simple, light and affordable. FitBand Go tracks your steps, heart rate and sleep, and lasts up to 14 days on a single charge.',
      specs: { Display: '1.1" AMOLED', Sensors: 'HR, SpO2', Battery: 'Up to 14 days', 'Water Resistance': '5 ATM', Weight: '22 g', Warranty: '1 Year Official' }
    },
    {
      id: 'P1011', name: 'SlateTab 11', category: 'tablets', art: 'tablet', colors: ['#8b5cf6', '#06b6d4'],
      price: 2199, oldPrice: null, stock: 18, rating: 4.6, reviews: 389, featured: false,
      short: '11" 2.5K tablet with stylus support — perfect for work and play.',
      desc: 'SlateTab 11 is a versatile tablet for streaming, note-taking and light productivity. Pair it with the stylus and keyboard cover to turn it into a portable workstation.',
      specs: { Display: '11" 2.5K, 120Hz', Processor: 'Octa-core 4nm', Memory: '8GB RAM / 256GB', Battery: '8,800mAh', Audio: 'Quad speakers', Warranty: '1 Year Official' }
    },
    {
      id: 'P1012', name: 'SlateTab Mini 8', category: 'tablets', art: 'tablet', colors: ['#f97316', '#facc15'],
      price: 1299, oldPrice: 1449, stock: 3, rating: 4.4, reviews: 205, featured: false,
      short: 'Compact 8.7" tablet that fits in one hand. Great for reading and kids.',
      desc: 'Small enough to hold in one hand, big enough to enjoy movies and games. SlateTab Mini 8 includes a kids mode with parental controls.',
      specs: { Display: '8.7" HD+', Processor: 'Octa-core', Memory: '4GB RAM / 64GB', Battery: '5,100mAh', Weight: '340 g', Warranty: '1 Year Official' }
    },
    {
      id: 'P1013', name: 'ChargeMax 20000mAh Power Bank', category: 'accessories', art: 'powerbank', colors: ['#22c55e', '#0ea5e9'],
      price: 159, oldPrice: null, stock: 200, rating: 4.6, reviews: 3120, featured: false,
      short: '65W fast charging power bank that can charge a laptop.',
      desc: 'Never run out of battery again. ChargeMax delivers up to 65W through USB-C, enough to charge laptops, tablets and phones — up to three devices at once.',
      specs: { Capacity: '20,000mAh', Output: '65W USB-C PD', Ports: '2x USB-C, 1x USB-A', Weight: '410 g', 'Flight Safe': 'Yes', Warranty: '1 Year Official' }
    },
    {
      id: 'P1014', name: 'KeyFlow Mechanical Keyboard', category: 'accessories', art: 'keyboard', colors: ['#334155', '#6366f1'],
      price: 459, oldPrice: null, stock: 45, rating: 4.7, reviews: 548, featured: false,
      short: 'Hot-swappable wireless mechanical keyboard with RGB backlight.',
      desc: 'Type in style. KeyFlow features hot-swappable switches, tri-mode connectivity (Bluetooth, 2.4GHz, USB-C) and per-key RGB lighting in a compact 75% layout.',
      specs: { Layout: '75% (84 keys)', Switches: 'Hot-swappable, linear', Connectivity: 'BT 5.1 / 2.4GHz / USB-C', Battery: '4,000mAh', Backlight: 'Per-key RGB', Warranty: '1 Year Official' }
    },
    {
      id: 'P1015', name: 'PlayCore Wireless Controller', category: 'gaming', art: 'controller', colors: ['#ec4899', '#8b5cf6'],
      price: 289, oldPrice: 329, stock: 60, rating: 4.5, reviews: 977, featured: true,
      short: 'Pro wireless controller for PC, console and mobile with hall-effect sticks.',
      desc: 'Play your way. PlayCore works across PC, console and mobile, with drift-free hall-effect joysticks, programmable back buttons and 30 hours of battery.',
      specs: { Compatibility: 'PC, Console, Android, iOS', Sticks: 'Hall-effect, anti-drift', Battery: '30 hours', Connectivity: 'BT / 2.4GHz / Wired', Extras: '2 back paddles', Warranty: '1 Year Official' }
    },
    {
      id: 'P1016', name: 'LumiShot Z50 Mirrorless Camera', category: 'cameras', art: 'camera', colors: ['#78716c', '#f59e0b'],
      price: 3799, oldPrice: 4199, stock: 9, rating: 4.8, reviews: 312, featured: true,
      short: '26MP APS-C mirrorless with 4K60 video and a 16-50mm kit lens.',
      desc: 'Capture life in stunning detail. LumiShot Z50 combines a 26MP sensor, fast eye-tracking autofocus and 4K60 video in a compact, travel-friendly body. Kit lens included.',
      specs: { Sensor: '26MP APS-C', Video: '4K 60fps, 10-bit', Autofocus: 'AI eye & subject tracking', Stabilisation: '5-axis IBIS', Lens: '16-50mm kit included', Warranty: '2 Years Official' }
    }
  ],

  customers: [
    { id: 'C001', name: 'Daniel Tan', email: 'daniel.tan@demo.my', phone: '+60 12-345 6789', city: 'Kuala Lumpur', state: 'W.P. Kuala Lumpur', postcode: '55100', line1: '12, Jalan Bukit Bintang', joined: '2025-03-14' },
    { id: 'C002', name: 'Aisyah Rahman', email: 'aisyah.r@demo.my', phone: '+60 13-222 4567', city: 'Shah Alam', state: 'Selangor', postcode: '40000', line1: '8, Jalan Plumbum 7/102', joined: '2025-05-02' },
    { id: 'C003', name: 'Priya Nair', email: 'priya.nair@demo.my', phone: '+60 16-781 2345', city: 'Petaling Jaya', state: 'Selangor', postcode: '46100', line1: '23, Jalan SS2/24', joined: '2025-06-21' },
    { id: 'C004', name: 'Jason Lim', email: 'jason.lim@demo.my', phone: '+60 17-555 1212', city: 'George Town', state: 'Pulau Pinang', postcode: '10200', line1: '45, Lebuh Chulia', joined: '2025-08-09' },
    { id: 'C005', name: 'Nurul Huda', email: 'nurul.huda@demo.my', phone: '+60 19-333 8899', city: 'Johor Bahru', state: 'Johor', postcode: '80000', line1: '17, Jalan Wong Ah Fook', joined: '2025-11-30' },
    { id: 'C006', name: 'Kevin Wong', email: 'kevin.wong@demo.my', phone: '+60 12-909 3434', city: 'Ipoh', state: 'Perak', postcode: '30000', line1: '6, Jalan Sultan Idris Shah', joined: '2026-01-18' },
    { id: 'C007', name: 'Siti Aminah', email: 'siti.aminah@demo.my', phone: '+60 11-2468 1357', city: 'Kota Kinabalu', state: 'Sabah', postcode: '88000', line1: '30, Jalan Gaya', joined: '2026-04-05' },
    { id: 'C008', name: 'Marcus Lee', email: 'marcus.lee@demo.my', phone: '+60 14-777 6655', city: 'Kuching', state: 'Sarawak', postcode: '93000', line1: '9, Jalan Padungan', joined: '2026-07-22' }
  ],

  // Seed orders: dates are relative to "today" so the dashboard always looks current.
  seedOrders: [
    { daysAgo: 13, customer: 'C002', items: [['P1004', 1]], status: 'Delivered', payment: 'FPX Online Banking' },
    { daysAgo: 12, customer: 'C003', items: [['P1006', 1], ['P1013', 1]], status: 'Delivered', payment: 'Credit / Debit Card' },
    { daysAgo: 11, customer: 'C001', items: [['P1007', 1]], status: 'Delivered', payment: 'Credit / Debit Card' },
    { daysAgo: 10, customer: 'C004', items: [['P1005', 1], ['P1015', 2]], status: 'Delivered', payment: 'FPX Online Banking' },
    { daysAgo: 9, customer: 'C005', items: [['P1010', 2]], status: 'Delivered', payment: 'Cash on Delivery' },
    { daysAgo: 8, customer: 'C006', items: [['P1002', 1], ['P1008', 1]], status: 'Cancelled', payment: 'Cash on Delivery' },
    { daysAgo: 7, customer: 'C007', items: [['P1009', 1]], status: 'Delivered', payment: 'Credit / Debit Card', coupon: 'DEMO10' },
    { daysAgo: 6, customer: 'C008', items: [['P1016', 1]], status: 'Delivered', payment: 'FPX Online Banking' },
    { daysAgo: 5, customer: 'C001', items: [['P1001', 1], ['P1013', 1]], status: 'Shipped', payment: 'FPX Online Banking' },
    { daysAgo: 4, customer: 'C003', items: [['P1011', 1], ['P1014', 1]], status: 'Shipped', payment: 'Credit / Debit Card' },
    { daysAgo: 3, customer: 'C002', items: [['P1003', 1]], status: 'Processing', payment: 'Credit / Debit Card', coupon: 'WELCOME50' },
    { daysAgo: 2, customer: 'C004', items: [['P1006', 1], ['P1007', 1]], status: 'Processing', payment: 'FPX Online Banking' },
    { daysAgo: 1, customer: 'C005', items: [['P1012', 1]], status: 'Pending', payment: 'Cash on Delivery' },
    { daysAgo: 0, customer: 'C008', items: [['P1015', 1], ['P1013', 2]], status: 'Pending', payment: 'Credit / Debit Card' }
  ],

  reviews: [
    { name: 'Hafiz M.', rating: 5, date: '2 weeks ago', text: 'Delivered the next day and packed very well. Product is 100% original with official warranty. Will buy again!' },
    { name: 'Michelle K.', rating: 5, date: '1 month ago', text: 'Exactly as described. Great price compared to other stores and the customer service team was very helpful.' },
    { name: 'Ravi S.', rating: 4, date: '1 month ago', text: 'Very happy with the purchase. Took off one star only because the courier came a bit late in the day.' }
  ],

  malaysianStates: ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'W.P. Kuala Lumpur', 'W.P. Labuan', 'W.P. Putrajaya'],

  banks: ['Maybank2u', 'CIMB Clicks', 'Public Bank', 'RHB Now', 'Hong Leong Connect', 'AmOnline', 'Bank Islam', 'BSN']
};
