# Lucky Dotcom proposal and store demo

Run with Node.js, with no dependencies to install:

```sh
node scripts/serve.mjs
```

Open http://127.0.0.1:4173/proposal.html for the client presentation. It links to the existing storefront and improved business dashboard.

- **Admin demo:** `admin` / `admin123`
- **Customer demo:** `user` / `user123`

The proposal includes a sales scenario calculator and a print / Save as PDF button. The dashboard supports 7-, 14- and 30-day periods, status filters, clickable daily charts, category details, order updates and CSV downloads.

Data is fictional and stored in the current browser. Checkout does not process real payments. Dealer approval, wholesale pricing rules, quotations, reminders and Shopee integration remain proposed work. Use the local server so the store and admin pages share the same browser storage.

Browser verification is available with `node scripts/verify-demo.mjs` when Playwright is installed or available in the local npm cache. Screenshots are saved under `.generated/`.
