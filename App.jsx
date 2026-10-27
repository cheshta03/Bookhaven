import { useMemo, useState } from "react";
import "./App.css";

const books = [
  { id: 1, title: "Atomic Habits", author: "James Clear", category: "Self Help", price: 399, old: 499, rating: 4.8, isbn: "0735211299", tag: "Bestseller" },
  { id: 2, title: "The Psychology of Money", author: "Morgan Housel", category: "Business", price: 349, old: 449, rating: 4.7, isbn: "0857197681", tag: "Popular" },
  { id: 3, title: "Ikigai", author: "Héctor García", category: "Self Help", price: 299, old: 399, rating: 4.6, isbn: "0143130722", tag: "Trending" },
  { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy", price: 399, old: 499, rating: 4.9, isbn: "054792822X", tag: "Classic" },
  { id: 5, title: "Think Like a Monk", author: "Jay Shetty", category: "Self Help", price: 349, old: 450, rating: 4.7, isbn: "1982134488", tag: "Popular" },
  { id: 6, title: "Dune", author: "Frank Herbert", category: "Sci-Fi", price: 449, old: 599, rating: 4.8, isbn: "0441172717", tag: "Sci-Fi" },
  { id: 7, title: "The 5 AM Club", author: "Robin Sharma", category: "Business", price: 399, old: 499, rating: 4.6, isbn: "1443456624", tag: "Bestseller" },
  { id: 8, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Business", price: 349, old: 450, rating: 4.5, isbn: "1612680194", tag: "Popular" },
  { id: 9, title: "The Silent Patient", author: "Alex Michaelides", category: "Mystery", price: 299, old: 399, rating: 4.5, isbn: "1250301696", tag: "Mystery" },
  { id: 10, title: "Pride and Prejudice", author: "Jane Austen", category: "Romance", price: 249, old: 349, rating: 4.8, isbn: "0141439513", tag: "Classic" },
  { id: 11, title: "Deep Work", author: "Cal Newport", category: "Technology", price: 399, old: 499, rating: 4.7, isbn: "1455586692", tag: "Focus" },
  { id: 12, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", price: 279, old: 399, rating: 4.7, isbn: "0062315005", tag: "Bestseller" },
];

const categories = [
  "All Books", "Fiction", "Self Help", "Business",
  "Mystery", "Romance", "Sci-Fi", "Fantasy", "Technology"
];

const money = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Books");
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [checkout, setCheckout] = useState(false);
  const [mobileCart, setMobileCart] = useState(false);
  const [sort, setSort] = useState("featured");
  const [customer, setCustomer] = useState({
    name: "", email: "", address: "", city: "", pincode: ""
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      const matchesCategory =
        category === "All Books" || book.category === category;
      const query = search.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, category, sort]);

  const addToCart = (book) => {
    setCart((current) => {
      const found = current.find((item) => item.id === book.id);
      if (found) {
        return current.map((item) =>
          item.id === book.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { ...book, qty: 1 }];
    });
    setMessage(`${book.title} added to your cart`);
    setTimeout(() => setMessage(""), 2200);
  };

  const changeQty = (id, amount) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + amount } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) =>
    setCart((current) => current.filter((item) => item.id !== id));

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const savings = cart.reduce(
    (sum, item) => sum + (item.old - item.price) * item.qty, 0
  );
  const couponDiscount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal === 0 || subtotal >= 799 ? 0 : 40;
  const total = subtotal + delivery - couponDiscount;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "BOOK10" && subtotal > 0) {
      setDiscountApplied(true);
      setMessage("BOOK10 applied! You saved 10%.");
    } else {
      setDiscountApplied(false);
      setMessage("Try coupon BOOK10 on your order.");
    }
    setTimeout(() => setMessage(""), 2500);
  };

  const placeOrder = (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setOrderPlaced(true);
  };

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-icon">▣</span>
          <span>
            <strong>BookHaven</strong>
            <small>Read More · Grow More</small>
          </span>
        </a>

        <label className="searchbox">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books, authors, or genres..."
            aria-label="Search books"
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </label>

        <button
          className="header-cart"
          onClick={() => setMobileCart(!mobileCart)}
        >
          🛒 <span className="cart-badge">{cartCount}</span>
          <span className="cart-label">Cart</span>
        </button>
        <div className="avatar">B</div>
      </header>

      <div className="layout" id="home">
        <aside className="sidebar">
          <div className="nav-links">
            <a className="nav-item active" href="#home">⌂ <span>Home</span></a>
            <a className="nav-item" href="#catalog">▤ <span>All Books</span></a>
            <a className="nav-item" href="#categories">▦ <span>Categories</span></a>
            <button
              className="nav-item"
              onClick={() => setMobileCart(!mobileCart)}
            >
              🛒 <span>My Cart</span>
              <b className="nav-count">{cartCount}</b>
            </button>
          </div>

          <div className="sidebar-divider" />
          <h3>Explore genres</h3>
          {categories.slice(1).map((cat) => (
            <button
              key={cat}
              className={`genre-link ${category === cat ? "selected" : ""}`}
              onClick={() => {
                setCategory(cat);
                document.getElementById("catalog")?.scrollIntoView({
                  behavior: "smooth"
                });
              }}
            >
              <span>◈</span>{cat}
            </button>
          ))}

          <div className="quote-card">
            <span className="quote-icon">▣</span>
            <p>“A book is a dream that you hold in your hands.”</p>
            <small>— Neil Gaiman</small>
          </div>
        </aside>

        <main className="main-content">
          <section className="hero">
            <div className="hero-content">
              <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
              <h1>Discover Your<br />Next Great Read<span>.</span></h1>
              <p>
                From timeless classics to modern bestsellers,
                find a story worth getting lost in.
              </p>
              <a className="primary-btn hero-btn" href="#catalog">
                Explore Collection <span>→</span>
              </a>
              <div className="hero-note">✦ Curated for curious minds</div>
            </div>
            <div className="hero-art">
              <div className="orb orb-one" />
              <div className="orb orb-two" />
              <div className="hero-book">B<span>H</span></div>
              <div className="floating-book book-one" />
              <div className="floating-book book-two" />
              <div className="floating-book book-three" />
              <div className="hero-sticker">GOOD BOOKS<br />BETTER DAYS ✦</div>
            </div>
          </section>

          <section className="benefits">
            <div><span>✦</span><p><b>Curated collection</b><small>Books worth your time</small></p></div>
            <div><span>↗</span><p><b>Great prices</b><small>More stories, less spend</small></p></div>
            <div><span>♧</span><p><b>Free delivery</b><small>On orders over ₹799</small></p></div>
          </section>

          <section className="category-section" id="categories">
            <div className="section-heading">
              <div>
                <span className="eyebrow">FIND YOUR NEXT OBSESSION</span>
                <h2>Browse Categories</h2>
              </div>
            </div>
            <div className="category-chips">
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`category-chip ${category === cat ? "chosen" : ""}`}
                >
                  <span>{["▤", "✧", "☼", "↗", "⌕", "♡", "◎", "◇", "⌘"][i]}</span>
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section className="catalog-section" id="catalog">
            <div className="section-heading catalog-heading">
              <div>
                <span className="eyebrow">THE BOOKSHELF</span>
                <h2>{category === "All Books" ? "Featured Books" : category}</h2>
                <p className="result-count">{filteredBooks.length} books to explore</p>
              </div>
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort books"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {filteredBooks.length ? (
              <div className="book-grid">
                {filteredBooks.map((book) => {
                  const inCart = cart.find((item) => item.id === book.id);
                  return (
                    <article className="book-card" key={book.id}>
                      <div className="cover-wrap">
                        <span className="book-tag">{book.tag}</span>
                        <img
                          src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                          alt={`Cover of ${book.title}`}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling.style.display = "flex";
                          }}
                        />
                        <div className="cover-fallback">
                          <span>BOOKHAVEN</span>
                          <b>{book.title}</b>
                          <small>{book.author}</small>
                        </div>
                      </div>
                      <div className="book-info">
                        <span className="book-category">{book.category}</span>
                        <h3>{book.title}</h3>
                        <p className="book-author">{book.author}</p>
                        <div className="rating">★ <b>{book.rating}</b> <span>Reader rating</span></div>
                        <div className="price-line">
                          <strong>{money(book.price)}</strong>
                          <del>{money(book.old)}</del>
                          <span className="discount">
                            {Math.round((1 - book.price / book.old) * 100)}% OFF
                          </span>
                        </div>
                        <button
                          className={`add-btn ${inCart ? "added" : ""}`}
                          onClick={() => addToCart(book)}
                        >
                          {inCart ? `✓ In Cart (${inCart.qty})` : "+ Add to Cart"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <span>⌕</span>
                <h3>No books found</h3>
                <p>Try another title, author, or category.</p>
                <button className="secondary-btn" onClick={() => {
                  setSearch("");
                  setCategory("All Books");
                }}>Show all books</button>
              </div>
            )}
          </section>

          <footer className="footer">
            <a className="brand footer-brand" href="#home">
              <span className="brand-icon">▣</span><strong>BookHaven</strong>
            </a>
            <p>Every great adventure begins with a page.</p>
            <small>© 2026 BookHaven · Made for book lovers.</small>
          </footer>
        </main>

        <aside className={`cart-panel ${mobileCart ? "cart-open" : ""}`}>
          <div className="cart-header">
            <div>
              <span className="eyebrow">YOUR COLLECTION</span>
              <h2>My Cart <span>({cartCount})</span></h2>
            </div>
            <button className="icon-btn close-mobile" onClick={() => setMobileCart(false)}>×</button>
            {cart.length > 0 && (
              <button className="clear-btn" onClick={() => {
                setCart([]);
                setDiscountApplied(false);
              }}>Clear all</button>
            )}
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <div>🛒</div>
                <h3>Your cart is waiting</h3>
                <p>Find a book that speaks to you and add it here.</p>
                <button className="secondary-btn" onClick={() => setMobileCart(false)}>
                  Explore books
                </button>
              </div>
            ) : cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="mini-cover">
                  <img
                    src={`https://covers.openlibrary.org/b/isbn/${item.isbn}-M.jpg`}
                    alt=""
                  />
                </div>
                <div className="cart-item-details">
                  <h4>{item.title}</h4>
                  <p>{item.author}</p>
                  <strong>{money(item.price * item.qty)}</strong>
                  <div className="qty-control">
                    <button onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity">−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`}>×</button>
              </div>
            ))}
          </div>

          <div className="cart-bottom">
            <div className="coupon-box">
              <label htmlFor="coupon">✧ Have a coupon?</label>
              <div className="coupon-input">
                <input
                  id="coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Try BOOK10"
                />
                <button onClick={applyCoupon}>Apply</button>
              </div>
              {discountApplied && <small className="success-text">10% coupon applied!</small>}
            </div>

            <div className="totals">
              <div><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div><span>Book discounts</span><span className="green">−{money(savings)}</span></div>
              <div><span>Delivery</span><span>{delivery === 0 ? <span className="green">FREE</span> : money(delivery)}</span></div>
              {discountApplied && <div><span>Coupon savings</span><span className="green">−{money(couponDiscount)}</span></div>}
              {subtotal > 0 && subtotal < 799 && (
                <p className="shipping-note">Add {money(799 - subtotal)} more for free delivery.</p>
              )}
            </div>

            <div className="grand-total">
              <span>Total</span><strong>{money(total)}</strong>
            </div>

            <button
              className="checkout-btn"
              disabled={!cart.length}
              onClick={() => {
                setCheckout(true);
                setMobileCart(false);
                setOrderPlaced(false);
              }}
            >
              Proceed to Checkout <span>→</span>
            </button>
            <div className="secure-note"><span>♢</span><div><b>Safe & secure checkout</b><small>Demo checkout · No payment charged</small></div></div>
          </div>
        </aside>
      </div>

      {message && <div className="toast">✓ {message}</div>}

      {checkout && (
        <div className="modal-backdrop" onClick={() => setCheckout(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCheckout(false)}>×</button>
            {orderPlaced ? (
              <div className="order-success">
                <div className="success-icon">✓</div>
                <span className="eyebrow">ORDER CONFIRMED</span>
                <h2>Happy reading, {customer.name.split(" ")[0]}!</h2>
                <p>Your demo order has been placed successfully. No payment was processed.</p>
                <div className="order-summary">
                  <span>Order reference</span><b>BH-{Date.now().toString().slice(-7)}</b>
                  <span>Order total</span><b>{money(total)}</b>
                  <span>Delivering to</span><b>{customer.city} · {customer.pincode}</b>
                </div>
                <button className="checkout-btn" onClick={() => {
                  setCart([]);
                  setCheckout(false);
                  setDiscountApplied(false);
                  setCoupon("");
                  setCustomer({ name: "", email: "", address: "", city: "", pincode: "" });
                  setOrderPlaced(false);
                }}>Continue Exploring</button>
              </div>
            ) : (
              <>
                <span className="eyebrow">ALMOST YOURS</span>
                <h2>Complete your order</h2>
                <p className="modal-subtitle">A few details, then it's time to turn the page.</p>
                <div className="modal-order-total">
                  <span>{cartCount} book(s) · Total payable</span><strong>{money(total)}</strong>
                </div>
                <form onSubmit={placeOrder} className="checkout-form">
                  <label>Full name<input required value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} placeholder="Your name" /></label>
                  <label>Email address<input type="email" required value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} placeholder="you@example.com" /></label>
                  <label>Delivery address<textarea required value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} placeholder="House number, street, area" rows={2} /></label>
                  <div className="form-row">
                    <label>City<input required value={customer.city} onChange={(e) => setCustomer({...customer, city: e.target.value})} placeholder="Your city" /></label>
                    <label>PIN code<input required pattern="[0-9]{6}" maxLength={6} value={customer.pincode} onChange={(e) => setCustomer({...customer, pincode: e.target.value})} placeholder="6 digits" /></label>
                  </div>
                  <div className="demo-payment">🔒 Demo checkout — no card or payment details needed.</div>
                  <button type="submit" className="checkout-btn">Place Demo Order · {money(total)} →</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
