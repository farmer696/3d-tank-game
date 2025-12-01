/*
PlaneMarket — Single-file React App (App.jsx)

What this is:
- A single-file React component you can paste into a Create React App / Vite React project.
- Uses Tailwind classes for styling (no Tailwind import required in this file; see setup below).
- Provides: product listing (planes), product detail modal, cart, simple checkout form (mock), search + filters, responsive layout.

How to use:
1) Create a new React app (Vite recommended):
   npm create vite@latest plane-market -- --template react
   cd plane-market
   npm install

2) Install Tailwind (see Tailwind docs). Minimal steps:
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   // then add to tailwind.config.cjs content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}']
   // add @tailwind base; @tailwind components; @tailwind utilities; to src/index.css

3) Replace src/App.jsx with this file content. Make sure src/main.jsx imports './index.css'.

4) Run: npm run dev

Deploy to GitHub Pages:
- Build: npm run build
- Push repository to GitHub
- Use GitHub Pages (deploy from gh-pages branch) or use GitHub Actions to push built files to gh-pages.
- Or deploy to Vercel/Netlify for easier hosting.

Notes & limitations:
- This is a demo/mock e-commerce site. No real payments. Checkout simulates order submission.
- Plane images use placeholder links; replace with real images.

*/

import React, { useState, useMemo } from "react";

const PLANE_DATA = [
  {
    id: "p-001",
    name: "Cessna Skyhawk 172",
    price: 299000,
    seats: 4,
    range_km: 1280,
    speed_kts: 122,
    img: "https://images.unsplash.com/photo-1516728778615-2d590ea1856f?auto=format&fit=crop&w=800&q=60",
    description:
      "Classic, reliable 4-seat piston single. Great for training, touring, and general aviation enthusiasts.",
    category: "Piston",
  },
  {
    id: "p-002",
    name: "Piper PA-28 Cherokee",
    price: 249000,
    seats: 4,
    range_km: 1200,
    speed_kts: 120,
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=60",
    description:
      "Robust and forgiving trainer with plenty of aftermarket support. Comfortable and affordable.",
    category: "Piston",
  },
  {
    id: "p-003",
    name: "Beechcraft King Air 350i",
    price: 7500000,
    seats: 9,
    range_km: 3600,
    speed_kts: 312,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60",
    description:
      "Twin-turboprop executive aircraft with excellent short-field performance and modern avionics.",
    category: "Turboprop",
  },
  {
    id: "p-004",
    name: "Gulfstream G550",
    price: 38000000,
    seats: 16,
    range_km: 12250,
    speed_kts: 488,
    img: "https://images.unsplash.com/photo-1557601653-4a1e3b2b2a6a?auto=format&fit=crop&w=800&q=60",
    description:
      "Long-range heavy business jet. Luxurious cabin and transoceanic range for VIP travel.",
    category: "Jet",
  },
  {
    id: "p-005",
    name: "Cirrus SR22",
    price: 850000,
    seats: 4,
    range_km: 1600,
    speed_kts: 183,
    img: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=800&q=60",
    description:
      "High-performance single-engine with modern glass cockpit and parachute safety system (airframe parachute).",
    category: "Piston",
  },
];

function currency(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);

  const categories = useMemo(() => ["All", ...new Set(PLANE_DATA.map((p) => p.category))], []);

  const filtered = PLANE_DATA.filter((p) => {
    const matchesQuery = (p.name + " " + p.description).toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === "All" || p.category === category;
    return matchesQuery && matchesCat;
  });

  const addToCart = (plane, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((it) => it.id === plane.id);
      if (exists) return prev.map((it) => (it.id === plane.id ? { ...it, qty: it.qty + qty } : it));
      return [...prev, { ...plane, qty }];
    });
    setShowCart(true);
  };

  const updateQty = (id, qty) => {
    setCart((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(0, qty) } : it)).filter((it) => it.qty > 0));
  };

  const cartTotal = cart.reduce((s, it) => s + it.price * it.qty, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    // mock submission
    const form = new FormData(e.target);
    const name = form.get("name");
    const email = form.get("email");
    if (!name || !email) {
      alert("Please enter name and email to place order.");
      return;
    }
    const order = {
      id: `ORD-${Date.now()}`,
      name,
      email,
      total: cartTotal,
      items: cart,
      date: new Date().toISOString(),
    };
    // in a real app you'd POST to a backend
    console.log("ORDER", order);
    setCart([]);
    setShowCart(false);
    setCheckoutSuccess(order);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-7xl mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold">PM</div>
          <div>
            <h1 className="text-2xl font-bold">PlaneMarket</h1>
            <p className="text-sm text-gray-600">Buy new & preowned planes — demo storefront</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-2">
            <input
              className="px-3 py-2 rounded border border-gray-200 bg-white"
              placeholder="Search planes, e.g. 'Cessna'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="px-3 py-2 rounded border" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCart((s) => !s)}
            className="relative px-3 py-2 rounded-lg bg-white border hover:shadow"
          >
            Cart
            <span className="ml-2 font-bold">{cart.length}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Planes</h2>
            <div className="text-sm text-gray-500">{filtered.length} results</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <article key={p.id} className="bg-white rounded-lg shadow p-3 flex flex-col">
                <img src={p.img} alt={p.name} className="w-full h-40 object-cover rounded" />
                <div className="mt-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-600 flex-1 mt-1">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">{p.seats} seats • {p.range_km} km range</div>
                      <div className="text-lg font-semibold mt-1">{currency(p.price)}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(p)}
                        className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCart(p)}
                        className="px-3 py-2 rounded bg-sky-600 text-white font-semibold"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="lg:col-span-1">
          <div className="sticky top-6 bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold">Quick Filters</h3>
            <div className="mt-2 flex flex-col gap-2">
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={category === "All"}
                  onChange={() => setCategory("All")}
                  className="mr-2"
                />
                All Categories
              </label>
              {categories.filter((c)=>c!=='All').map((c)=> (
                <label key={c} className="text-sm">
                  <input type="radio" name="cat" checked={category===c} onChange={()=>setCategory(c)} className="mr-2" />
                  {c}
                </label>
              ))}
            </div>

            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold">Featured</h4>
              <div className="mt-2">
                {PLANE_DATA.slice(0,2).map((p)=> (
                  <div key={p.id} className="flex items-center gap-2 py-2">
                    <img src={p.img} alt="" className="w-16 h-10 object-cover rounded" />
                    <div className="text-sm">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-gray-500">{currency(p.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold">Newsletter</h4>
              <p className="text-sm text-gray-500 mt-1">Get updates on new listings and deals.</p>
              <div className="mt-2 flex gap-2">
                <input placeholder="Email" className="flex-1 px-2 py-1 border rounded" />
                <button className="px-3 py-1 rounded bg-sky-600 text-white">Subscribe</button>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Cart drawer */}
      {showCart && (
        <div className="fixed right-4 bottom-4 w-96 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Cart</h4>
            <button onClick={() => setShowCart(false)} className="text-sm text-gray-500">Close</button>
          </div>
          <div className="mt-3 max-h-56 overflow-auto">
            {cart.length === 0 ? (
              <div className="text-gray-500 text-sm">Your cart is empty.</div>
            ) : (
              cart.map((it) => (
                <div key={it.id} className="flex items-center gap-3 py-2 border-b">
                  <img src={it.img} alt="" className="w-16 h-10 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-gray-500">{currency(it.price)} • {it.qty}x</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(it.id, it.qty - 1)} className="px-2 py-1 border rounded">-</button>
                    <div className="px-2">{it.qty}</div>
                    <button onClick={() => updateQty(it.id, it.qty + 1)} className="px-2 py-1 border rounded">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 border-t pt-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Total</div>
              <div className="font-semibold">{currency(cartTotal)}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>{if(cart.length>0) document.getElementById('checkout-form')?.scrollIntoView({behavior:'smooth'})}} className="flex-1 px-3 py-2 rounded border">Checkout</button>
              <button onClick={()=>setCart([])} className="px-3 py-2 rounded bg-red-600 text-white">Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* Selected details modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full overflow-auto">
            <div className="flex items-start gap-4 p-4">
              <img src={selected.img} alt="" className="w-48 h-32 object-cover rounded" />
              <div className="flex-1">
                <h3 className="text-xl font-bold">{selected.name}</h3>
                <div className="text-sm text-gray-500">{currency(selected.price)}</div>
                <p className="mt-2 text-gray-700">{selected.description}</p>
                <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                  <li>{selected.seats} seats</li>
                  <li>{selected.range_km} km range</li>
                  <li>{selected.speed_kts} kts cruise</li>
                </ul>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => addToCart(selected)} className="px-4 py-2 rounded bg-sky-600 text-white">Add to cart</button>
                  <button onClick={() => setSelected(null)} className="px-4 py-2 rounded border">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto text-center text-sm text-gray-500 py-8">
        <div>Demo storefront — no real sales. Replace images and add a backend to accept payments.</div>
      </footer>

      {/* Checkout section (simple) */}
      <div id="checkout-form" className="max-w-2xl mx-auto mt-6 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold">Checkout (demo)</h3>
        <form onSubmit={handleCheckout} className="mt-3 grid grid-cols-1 gap-3">
          <input name="name" placeholder="Full name" className="px-3 py-2 border rounded" />
          <input name="email" placeholder="Email" className="px-3 py-2 border rounded" />
          <textarea name="notes" placeholder="Shipping/Delivery notes (optional)" className="px-3 py-2 border rounded" />
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Order total:</div>
            <div className="font-semibold">{currency(cartTotal)}</div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white flex-1">Place order</button>
            <button type="button" onClick={()=>{setCart([]); setCheckoutSuccess(null)}} className="px-4 py-2 rounded border">Reset</button>
          </div>
        </form>

        {checkoutSuccess && (
          <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded">
            <div className="font-semibold">Order placed — {checkoutSuccess.id}</div>
            <div className="text-sm text-gray-600">We sent a mock confirmation to {checkoutSuccess.email}.</div>
          </div>
        )}
      </div>
    </div>
  );
}
