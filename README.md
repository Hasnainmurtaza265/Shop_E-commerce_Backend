# Shop.Co Backend (matched to your uploaded frontend)

This backend uses the exact eight products and product fields found in your `product.json` and `topSelling.json`.

## Setup
1. Install Node.js 18 or newer.
2. Open this folder in VS Code.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Add your MongoDB Atlas URI and a long random JWT secret.
6. Run `npm run seed` once to insert the eight frontend products.
7. Run `npm run dev`.

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Example `.env`:
```env
PORT=4000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/shopco?retryWrites=true&w=majority
JWT_SECRET=use_a_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

API runs at `http://localhost:4000`. Check `http://localhost:4000/api/health`.
Product images copied from your frontend are served from `http://localhost:4000/images/...`.

**Seed warning:** `npm run seed` deletes all existing Product documents before inserting the eight Shop.Co products. Run it only on a fresh/test database.

## Product data compatibility
The API retains your frontend's fields:
`legacyId`, `name`, `price`, `oldPrice`, `discount`, `rating`, `image`, `category`.
Existing numeric product routes work: `/api/products/1`, `/api/products/51`, etc.
The seed script imports all eight records from the two JSON files in the uploaded frontend.

## Routes

All responses use JSON. Protected endpoints require:
`Authorization: Bearer YOUR_TOKEN`

### Authentication
- `POST /api/auth/register` body: `{ "name":"Customer", "email":"customer@example.com", "password":"password123" }`
- `POST /api/auth/login` body: `{ "email":"customer@example.com", "password":"password123" }`
- `GET /api/auth/me` protected

### Products (public GET)
- `GET /api/products`
- `GET /api/products/:id` (supports legacy numeric IDs and MongoDB IDs)
- `GET /api/products?search=shirt`
- `GET /api/products?category=T-shirts`
- `GET /api/products?minPrice=100&maxPrice=250`
- `GET /api/products?sort=price_asc`
- `GET /api/products?sort=price_desc`
- `GET /api/products?sort=newest`
- Admin: `POST`, `PUT /:id`, `DELETE /:id` under `/api/products`

Product create body example:
```json
{
  "name": "New T-shirt",
  "price": 150,
  "oldPrice": 180,
  "discount": "-15%",
  "rating": 4.5,
  "image": "/images/black-t-shirt.png",
  "category": "T-shirts",
  "description": "Product description",
  "sizes": ["Small", "Medium", "Large", "X-Large"],
  "colors": ["Olive", "Teal", "Navy"],
  "stock": 25
}
```

### Categories
- `GET /api/categories`

### Cart (login required)
- `GET /api/cart`
- `POST /api/cart/items` body: `{ "productId": 1, "quantity": 1, "size": "Large", "color": "Olive" }`
- `PATCH /api/cart/items/:itemId` body: `{ "quantity": 2 }`
- `DELETE /api/cart/items/:itemId`
- `DELETE /api/cart`

Cart response item fields are deliberately flattened to your frontend style: `id`, `name`, `price`, `image`, `quantity`, `size`, `color`, plus `cartItemId` and `productId`.

### Wishlist (login required)
- `GET /api/wishlist`
- `POST /api/wishlist/:productId` toggles the product in/out of wishlist. Numeric legacy IDs are accepted.

### Orders (login required)
- `POST /api/orders/checkout` body:
```json
{
  "shippingAddress": {
    "fullName": "Customer Name",
    "phone": "03001234567",
    "address": "Street and house",
    "city": "Karachi",
    "postalCode": "75000",
    "country": "Pakistan"
  },
  "deliveryFee": 15
}
```
The checkout calculation matches your current cart UI: 20% discount and $15 delivery by default. Payment method is cash on delivery; no online payment gateway is connected.
- `GET /api/orders/my`
- Admin: `GET /api/orders`
- Admin: `PATCH /api/orders/:id/status` body `{ "status":"processing" }`

## Make your account admin
1. Register using `/api/auth/register`.
2. In MongoDB Atlas, open the `users` collection.
3. Change your user document's `role` from `customer` to `admin`.
4. Log in again to receive a fresh token.

Public registration cannot set an admin role.

## Important: backend is not yet wired into React
Your uploaded React app currently imports product JSON directly and saves cart data in `localStorage`; it does not contain login/signup or checkout form pages. This ZIP provides the matching backend and API. To use MongoDB data in the live UI, replace those JSON imports and update the cart context to call these endpoints; authenticated cart/order APIs need a logged-in user token.

For local frontend requests, set a Vite env variable:
```env
VITE_API_URL=http://localhost:4000/api
```
Example:
```js
const API = import.meta.env.VITE_API_URL;
const response = await fetch(`${API}/products`);
const result = await response.json();
console.log(result.products);
```

For deployment, host this backend separately, set `CLIENT_URL` to your exact Vercel frontend origin, then set `VITE_API_URL` to `https://YOUR-BACKEND-DOMAIN/api` and redeploy the frontend. Never commit `.env`.
