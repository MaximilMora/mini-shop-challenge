# Mini Shop: Cart Challenge

A tiny shop with a React frontend (Vite) and an Express + SQLite backend.
Products can already be listed. **Your job is to build the shopping cart.**

You'll present your work in a live call: a short demo, then a code walkthrough where you explain your decisions. How you reason about the problem matters as much as the code itself.

---

## Getting started

Requirements: **Node.js 22.13+** (Node 24 recommended, see `.nvmrc`). The backend uses Node's built-in SQLite module, so no database setup is needed.

```bash
npm install
npm run dev     # starts the API on :3001 and the client on http://localhost:5173
npm test        # runs the backend tests
```

The SQLite database file is created at `server/data/shop.db` on first run and seeded with 6 products.
To reset it, stop the server and delete that folder.

### Project layout

```
client/                  React app (Vite)
  src/api.js             fetch wrapper for the API: add your API calls here
  src/utils/formatPrice  cents -> "€14.50"
  src/hooks/useProducts  loads the product list
  src/components/        Header, ProductList, ProductCard, Cart
server/                  Express API
  src/db.js              schema + seed data
  src/app.js             wires the routers
  src/routes/            products.js (done), cart.js (yours)
  test/                  node:test tests (cart.test.js is the contract you must satisfy)
```

---

## The task

Do the parts in order and **commit at the end of each part**. Part 1 should work on its own before you touch the backend.

### Part 1: Cart in the frontend (localStorage)

1. Each product card has an **"Add to cart"** button.
   - Out-of-stock products (`stock === 0`) show a disabled button.
   - You can't add more units of a product than its `stock`. The button becomes disabled when you reach the limit.
2. Adding a product that is already in the cart **increases its quantity**. It doesn't create a second line.
3. The **header badge** shows the total number of units in the cart (2 mugs + 1 notebook = 3).
4. The **Cart panel** shows, for each item: name, unit price, quantity and line total. It also shows the cart total. If the cart is empty, it keeps the "Your cart is empty." message.
5. The cart **survives a page reload** (persist it in `localStorage`).

### Part 2: Persist the cart in the backend

1. Implement the cart endpoints in `server/src/routes/cart.js` following the **API contract** below. You'll need a new table: add it in `server/src/db.js`.
2. `npm test` must pass (all tests, including `server/test/cart.test.js`).
3. Switch the frontend to use the API instead of localStorage:
   - Load the cart from `GET /api/cart` when the app starts.
   - "Add to cart" calls `POST /api/cart/items`.
   - While a request is in flight, the button that triggered it is disabled.
   - If the API returns an error (e.g. 409 out of stock), show the error message to the user. Don't just `console.log` it.

### Part 3: Bonus (optional)

Pick any. Doing Parts 1–2 well beats rushing through Part 3.

- A "Remove" button per cart item (`DELETE /api/cart/items/:productId` is already in the contract).
- `+` / `−` quantity controls in the cart (you'll design the endpoint for decreasing).
- Frontend tests.
- Something else you think improves the product. Tell us why.

---

## Technical requirements

These matter. We'll check each one during the call.

- **Money is always integer cents.** Never store or compute prices as floats. Use `formatPrice()` for display.
- **No new dependencies** (no Redux, Zustand, React Query, UI kits, …). Plain React state/context and `fetch` are enough. If you believe you really need one, justify it in the call.
- **Cart state lives in one place.** Header and Cart panel must read from the same source of truth. Don't keep two copies that you sync by hand.
- **The server is the source of truth for prices and stock.** The client never sends a price.
- **Don't modify the existing tests.** Adding new tests is welcome.
- **Git history:** at least one commit per part, with meaningful messages. Don't squash everything into a single commit.
- Keep the existing code style. The app should run with `npm install && npm run dev` on a fresh clone.

---

## API contract

All responses are JSON. Errors always look like `{ "error": "Human readable message" }`.

A **cart** response looks like this:

```json
{
  "items": [
    {
      "productId": 1,
      "name": "Ceramic Mug",
      "emoji": "☕",
      "priceCents": 1450,
      "quantity": 2,
      "lineTotalCents": 2900
    }
  ],
  "totalCents": 2900
}
```

Items are ordered by when they were **first** added to the cart.

| Method   | Path                            | Body                               | Success                      | Errors |
|----------|---------------------------------|------------------------------------|------------------------------|--------|
| `GET`    | `/api/cart`                     | none                               | `200` cart                   | none |
| `POST`   | `/api/cart/items`               | `{ productId, quantity? = 1 }`     | `201` cart (the whole cart)  | `400` invalid body · `404` unknown product · `409` total quantity in cart would exceed stock |
| `DELETE` | `/api/cart/items/:productId`    | none                               | `200` cart                   | `404` product not in cart |

Notes:
- `productId` and `quantity` must be **positive integers** (`"2"` as a string is invalid).
- There is only one cart (no users/auth).
- Adding to the cart does **not** decrease product stock. Stock only limits how many units can be in the cart.

---

## The live call (~45 min)

1. **Demo** (5 min): show it working, including an error case.
2. **Walkthrough** (15–20 min): walk us through your commits and the key pieces of code.
3. **Questions** (15–20 min): we'll ask about your decisions and trade-offs, and what you'd change with more time.

Useful things to think about before the call:
- Why did you structure the cart state the way you did?
- What happens if two browser tabs add items at the same time?
- What did you find hard, and what would you do differently?

It's fine to use documentation, Google and AI tools. You must be able to explain every line you submit.
