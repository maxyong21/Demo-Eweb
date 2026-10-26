# Lucky Dotcom proposal and store demo

Run with Node.js, with no dependencies to install:

```sh
node scripts/serve.mjs
```

Open http://127.0.0.1:4173/proposal.html for the client presentation. It links to the existing storefront and improved business dashboard.

The proposal now starts with discovery (`proposal.html#diagnosis`). It separates the concern reported by the team, chosen demo rules and unverified business needs. A symptom explorer maps possible bottlenecks to evidence, immediate non-website actions, conditional website benefits, demo limitations and success measures. It includes a client interview guide, primary research links and pilot decision criteria. No symptom or sales uplift is assumed by default; the calculator starts at 0% change.

Open http://127.0.0.1:4173/demos.html for the reusable demo gallery. Choose gadgets, automotive spare parts or kedai runcit/snacks. The Business demo selector is also available on the storefront and admin pages. Use `index.html?demo=automotive` or `index.html?demo=grocery` to open a specific catalogue directly.

Each profile has separate browser-stored products, cart, orders, dealer applications and edits. Login persists across business changes within a tab. Tabs can sign in separately, so a customer can wait for an admin's approval in another tab. Resetting affects only the selected profile. This is a demonstration, not production multi-tenant access control.

Use **Admin → Products** to add or edit products, prices, stock, descriptions, illustrations and specifications. To create another industry, add a catalogue configuration to `assets/js/profiles.js`; the page layouts and commerce functions are shared. The image upload workflow remains proposed work.

- **Admin demo:** `admin` / `admin123`
- **Customer demo:** `user` / `user123`

The proposal includes a sales scenario calculator and a print / Save as PDF button. The dashboard supports 7-, 14- and 30-day periods, status filters, clickable daily charts, category details, order updates and CSV downloads.

Data is fictional and stored in the current browser. Checkout does not process real payments. Quotations, reminders, image uploads and Shopee integration remain proposed work. Use the local server so the store and admin pages share the same browser storage.

## Dealer workflow

- Regular customers order from 1 unit, subject to available stock. A cart above 100 total units triggers an optional dealer invitation; customers may continue at retail prices.
- Open **Dealer access** on the storefront (`dealer.html`), sign in as the demo customer and submit the business form. Applications remain Pending until reviewed under **Admin → Dealer Applications** (`admin/dealers.html`). Admin can approve, decline or revoke access and leave a note.
- Under **Admin → Products → Edit → Approved dealer pricing**, enable rules and set minimum units, pack increments and quantity/total-price rows. The first row must match the minimum; subsequent unit rates must not increase. No dealer rule means the product keeps regular pricing and quantities.
- `50: 45` means RM45 for 50 units, or RM0.90 per unit. `100: 85` means quantities from 100 use RM0.85 per unit; 150 costs RM127.50. These are volume price breaks, not a restriction to buying exact packs. Pack increments control allowed multiples separately.
- Dealer rules apply automatically after approval. Invalid quantities, insufficient stock and the optional dealer order-value minimum block checkout. Retail coupons do not stack with dealer-priced items. Existing orders keep their recorded prices after rule or approval changes.
- Each catalogue includes a RM1 **Dealer Pricing Example** with 2,000 units, a minimum of 50 and the two example price breaks. It is added once to existing demo data without resetting edits. The example can be edited or deleted.
- These checks work inside the browser demo. Production requires a backend database, secure authentication and server-side enforcement before accepting real orders.

Browser verification is available with `node scripts/verify-demo.mjs` when Playwright is installed or available in the local npm cache. Screenshots are saved under `.generated/`.
