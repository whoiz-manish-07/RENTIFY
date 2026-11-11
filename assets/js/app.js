import { categories, categoryImages, heroImage } from './data.js?seed=20261113';
import { auth } from './auth.js';
import { customerStore } from './customerStore.js?demo=20261112';
import { adminStore } from './adminStore.js?demo=20261112';
import { store } from './store.js?demo=20261112';
import { dayCount, escapeHtml, icons, money, today } from './utils.js';
import { allowedTransitions, calculateRental, checkAvailability, canTransition, getReservedQuantity } from './bookingRules.js';

const app = document.querySelector('#app');
const modalRoot = document.querySelector('#modalRoot');
const toastRegion = document.querySelector('[data-toast-region]');
const routes = new Set(['home', 'explore', 'dashboard', 'bookings', 'booking-detail', 'wishlist', 'reviews', 'profile', 'notifications', 'admin', 'product', 'auth', 'onboarding']);
const protectedRoutes = new Set(['dashboard', 'bookings', 'booking-detail', 'wishlist', 'reviews', 'profile', 'notifications', 'admin', 'onboarding']);
const ui = { route: 'home', productId: null, bookingId: null, bookingTab: 'upcoming', adminTab: 'overview', adminQuery: '', adminStatus: 'All', adminCategory: 'All', filter: 'All', sort: 'featured', query: '', maxPrice: 1200, availability: 'all', authMode: 'signin', authReturn: null, authNotice: '', lastFocus: null };

const productCard = (product) => {
  const saved = customerStore.getWishlist().includes(product.id);
  return `
    <article class="product-card">
      <div class="product-card__media">
        <a href="#product/${product.id}" data-product-link="${product.id}" aria-label="View ${escapeHtml(product.name)}">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" width="600" height="480" data-image-fallback>
        </a>
        <span class="product-tag">${escapeHtml(product.tag || 'Available')}</span>
        <button class="save-button${saved ? ' is-saved' : ''}" type="button" data-action="wishlist" data-id="${product.id}" aria-label="${saved ? 'Remove' : 'Save'} ${escapeHtml(product.name)} ${saved ? 'from' : 'to'} wishlist" aria-pressed="${saved}">${icons.heart}</button>
      </div>
      <div class="product-card__body">
        <p class="overline">${escapeHtml(product.category)}</p>
        <h3><a href="#product/${product.id}" data-product-link="${product.id}">${escapeHtml(product.name)}</a></h3>
        <div class="product-card__rating"><span aria-label="${product.rating} out of 5 stars">★ ${product.rating} <small>(${product.reviews})</small></span><span>${product.stock} available</span></div>
        <div class="product-card__footer">
          <p class="price"><strong>${money(product.price)}</strong><span>/ day</span></p>
          <button class="button button--compact" type="button" data-action="book" data-id="${product.id}">Rent now ${icons.arrow}</button>
        </div>
      </div>
    </article>`;
};

const emptyState = (title, copy, action = '') => `
  <div class="empty-state">
    <span class="empty-state__mark" aria-hidden="true">R</span>
    <h2>${title}</h2><p>${copy}</p>${action}
  </div>`;

const authView = () => {
  const isRegister = ui.authMode === 'register';
  return `<section class="auth-shell" aria-labelledby="auth-title">
    <aside class="auth-editorial" style="--auth-image: url('${heroImage}')">
      <a class="auth-brand" href="#home" data-route="home">RENTIFY<span>.</span></a>
      <div class="auth-editorial__copy"><p class="eyebrow">Good things, borrowed</p><h1>Make room for what matters.</h1><p>Premium gear for the plans you have today, without the ownership that follows you home.</p><span class="auth-editorial__caption">A frontend demo marketplace · No real transactions</span></div>
    </aside>
    <div class="auth-panel"><div class="auth-panel__inner">
      <div class="auth-heading"><p class="eyebrow">${isRegister ? 'Start your rental story' : 'Welcome back'}</p><h1 id="auth-title">${isRegister ? 'Create your account.' : 'Sign in to RENTIFY.'}</h1><p>${isRegister ? 'Save your shortlist, track requests, and make the next plan easier.' : 'Your saved gear and rental requests are waiting.'}</p></div>
      ${ui.authNotice ? `<div class="auth-notice" role="status">${escapeHtml(ui.authNotice)}</div>` : ''}
      <form class="auth-form" data-auth-form data-mode="${isRegister ? 'register' : 'signin'}" novalidate>
        ${isRegister ? `<label class="field"><span>Full name</span><input name="name" autocomplete="name" required maxlength="80" placeholder="Your name"><small class="field-error" aria-live="polite" data-error-for="name"></small></label><label class="field"><span>Phone number</span><input name="phone" type="tel" inputmode="numeric" autocomplete="tel" required pattern="[0-9]{10}" maxlength="10" placeholder="10-digit phone number"><small class="field-error" aria-live="polite" data-error-for="phone"></small></label>` : ''}
        <label class="field"><span>Email address</span><input name="email" type="email" autocomplete="email" required placeholder="you@example.com"><small class="field-error" aria-live="polite" data-error-for="email"></small></label>
        <label class="field"><span>Password</span><span class="password-control"><input name="password" type="password" autocomplete="${isRegister ? 'new-password' : 'current-password'}" required minlength="8" placeholder="8 characters minimum"><button type="button" class="password-toggle" data-password-toggle aria-label="Show password">Show</button></span><small class="field-error" aria-live="polite" data-error-for="password"></small>${isRegister ? '<span class="password-strength" data-password-strength>Password strength will appear here</span>' : ''}</label>
        ${isRegister ? `<label class="field"><span>Confirm password</span><span class="password-control"><input name="confirmPassword" type="password" autocomplete="new-password" required placeholder="Repeat your password"><button type="button" class="password-toggle" data-password-toggle aria-label="Show password">Show</button></span><small class="field-error" aria-live="polite" data-error-for="confirmPassword"></small></label>` : ''}
        <div class="auth-form__meta">${!isRegister ? '<button class="text-button" type="button" data-auth-action="forgot">Forgot password?</button>' : '<span>Use 8+ characters for this demo account.</span>'}<label class="remember-control"><input type="checkbox" name="remember" checked> Remember me</label></div>
        <button class="button button--full auth-submit" type="submit">${isRegister ? 'Create customer account' : 'Sign in'} ${icons.arrow}</button>
        <p class="auth-form__legal">Demo authentication only. No real passwords, payments, or backend authorization are used.</p>
      </form>
      <div class="auth-divider"><span>or continue with a demo</span></div>
      <div class="demo-access"><button type="button" class="demo-access__item" data-demo-login="customer"><span>Customer demo</span><small>customer@rentify.demo</small></button><button type="button" class="demo-access__item" data-demo-login="admin"><span>Admin demo</span><small>admin@rentify.demo</small></button></div>
      <p class="auth-switch">${isRegister ? 'Already have an account?' : 'New to RENTIFY?'} <button type="button" class="text-button" data-auth-action="toggle-mode">${isRegister ? 'Sign in' : 'Create an account'}</button></p>
    </div></div>
  </section>`;
};

const onboardingView = () => `<section class="onboarding-shell site-container" aria-labelledby="onboarding-title">
  <div class="onboarding-progress"><span class="is-active">01 Welcome</span><span>02 Preferences</span><span>03 Ready</span></div>
  <div class="onboarding-card" data-onboarding-step="welcome"><p class="eyebrow">A better starting point</p><h1 id="onboarding-title">Welcome to RENTIFY, ${escapeHtml(auth.getUser()?.name || 'there')}.</h1><p>Tell us what you are planning so the collection feels more like yours. You can change this later.</p><div class="onboarding-actions"><button class="button" type="button" data-onboarding-next>Choose your categories ${icons.arrow}</button><button class="text-button" type="button" data-onboarding-skip>Skip for now</button></div></div>
  <div class="onboarding-card" data-onboarding-step="preferences" hidden><p class="eyebrow">Make it yours</p><h1>What are you renting for?</h1><p>Choose as many as you like.</p><div class="preference-grid">${categories.slice(1).map((category) => `<label class="preference-option"><input type="checkbox" value="${escapeHtml(category.value)}"><span>${escapeHtml(category.label)}</span></label>`).join('')}</div><div class="onboarding-actions"><button class="button" type="button" data-onboarding-complete>Save preferences ${icons.arrow}</button><button class="text-button" type="button" data-onboarding-skip>Skip for now</button></div></div>
  <div class="onboarding-card" data-onboarding-step="complete" hidden><span class="onboarding-mark">R</span><p class="eyebrow">You are all set</p><h1>Your next plan starts here.</h1><p>Your preferences are saved in this browser. Explore the collection whenever you are ready.</p><button class="button" type="button" data-onboarding-explore>Explore the collection ${icons.arrow}</button></div>
</section>`;

const productGrid = (products) => products.length
  ? `<div class="product-grid">${products.map(productCard).join('')}</div>`
  : emptyState('Nothing matched', 'Try a different search or category.');

const categoryTiles = () => categories.slice(1).map((category, index) => `
  <button class="category-card category-card--photo category-card--${category.value.toLowerCase()}" type="button" data-category="${category.value}">
    <span class="category-card__index">0${index + 1}</span><span>${category.label}</span>${icons.arrow}
  </button>`).join('');

const homeView = () => `
  <section class="hero site-container" aria-labelledby="hero-title">
    <div class="hero__copy">
      <p class="eyebrow">The rental edit · 2026</p>
      <h1 id="hero-title">Great gear.<br>Zero commitment.</h1>
      <p class="hero__intro">Rent the things that make your plans better—quality checked, clearly priced, and ready when you are.</p>
      <div class="button-row">
        <a class="button" href="#explore" data-route="explore">Explore collection ${icons.arrow}</a>
        <a class="text-link" href="#how-it-works" data-scroll="how-it-works">See how it works ${icons.arrow}</a>
      </div>
      <dl class="hero__proof">
        <div><dt>24</dt><dd>curated essentials</dd></div>
        <div><dt>4.8</dt><dd>demo review average</dd></div>
        <div><dt>24h</dt><dd>demo cancellation window</dd></div>
      </dl>
    </div>
    <div class="hero__visual">
      <img src="${heroImage}" alt="A curated arrangement of modern technology equipment" width="900" height="1000">
      <div class="hero__price"><span>Rental from</span><strong>₹199 <small>/ day</small></strong></div>
    </div>
  </section>
  <section class="section site-container" aria-labelledby="categories-title">
    <div class="section-heading">
      <div><p class="eyebrow">Browse the collection</p><h2 id="categories-title">Choose by category</h2></div>
      <a class="text-link" href="#explore" data-route="explore">View everything ${icons.arrow}</a>
    </div>
    <div class="category-grid">${categoryTiles()}</div>
  </section>
  <section class="section section--surface" aria-labelledby="popular-title">
    <div class="site-container">
      <div class="section-heading">
        <div><p class="eyebrow">Most requested</p><h2 id="popular-title">Popular right now</h2><p>Useful things, priced for the days you actually need them.</p></div>
        <a class="text-link" href="#explore" data-route="explore">Shop all gear ${icons.arrow}</a>
      </div>
      ${productGrid([...store.get().products].sort((a, b) => b.rating - a.rating).slice(0, 8))}
    </div>
  </section>
  <section class="section site-container" aria-labelledby="collections-title">
    <div class="section-heading"><div><p class="eyebrow">Curated for the moment</p><h2 id="collections-title">Featured collections</h2><p>Thoughtful starting points for the way you want to spend your time.</p></div></div>
    <div class="collection-grid">
      <button class="collection-card collection-card--wide" type="button" data-category="Cameras"><img src="${categoryImages.Cameras}" alt="Camera ready for a creative project"><span><small>Make something</small><strong>Creator kits</strong></span></button>
      <button class="collection-card" type="button" data-category="Outdoor"><img src="${categoryImages.Outdoor}" alt="Tent set up outdoors"><span><small>Get outside</small><strong>Weekend escape</strong></span></button>
      <button class="collection-card" type="button" data-category="Events"><img src="${categoryImages.Events}" alt="Lights ready for a celebration"><span><small>Bring people together</small><strong>Small celebrations</strong></span></button>
    </div>
  </section>
  <section class="section section--surface" aria-labelledby="trust-title">
    <div class="site-container"><div class="section-heading"><div><p class="eyebrow">The RENTIFY promise</p><h2 id="trust-title">Less ownership. More possibility.</h2></div></div>
      <div class="trust-grid"><div><span class="trust-icon">01</span><h3>Clear before you commit</h3><p>See the daily rate, refundable deposit, and estimated total before a demo request is placed.</p></div><div><span class="trust-icon">02</span><h3>Quality checked</h3><p>Every listed item is presented as inspected in this demo catalog. Conditions are shown honestly.</p></div><div><span class="trust-icon">03</span><h3>Built for real plans</h3><p>Keep a shortlist, compare gear, and choose only what your next project or weekend needs.</p></div></div>
    </div>
  </section>
  <section class="section site-container" id="how-it-works" aria-labelledby="steps-title">
    <div class="editorial-grid">
      <div class="editorial-grid__intro"><p class="eyebrow">No complications</p><h2 id="steps-title">From “I need it” to “I have it.”</h2><p>Reserve useful equipment in a few thoughtful steps, with every cost visible before you confirm.</p></div>
      <ol class="steps-list">
        <li><span>01</span><div><h3>Find the right fit</h3><p>Browse quality-checked gear and compare clear daily rates.</p></div></li>
        <li><span>02</span><div><h3>Choose your dates</h3><p>See availability and the full rental total before booking.</p></div></li>
        <li><span>03</span><div><h3>Pick up and go</h3><p>Use what you need, then return it when your plans are done.</p></div></li>
      </ol>
    </div>
  </section>
  <section class="section site-container faq-section" aria-labelledby="faq-title"><div class="section-heading"><div><p class="eyebrow">Good to know</p><h2 id="faq-title">Questions, answered.</h2></div></div><div class="faq-list">
    <details><summary>Is this a real rental service?</summary><p>RENTIFY is a browser-only demo. No payment, delivery, identity verification, or real reservation is performed.</p></details>
    <details><summary>What is the security deposit?</summary><p>The deposit is a demo estimate held separately in the cost preview. It is not charged and has no real-world refund process here.</p></details>
    <details><summary>Can I cancel a request?</summary><p>Pending requests can be cancelled in My rentals. This changes only the local demo data in your browser.</p></details>
  </div></section>
  <section class="site-container closing-banner">
    <div><p class="eyebrow">Ready when you are</p><h2>More experiences.<br>Fewer things.</h2></div>
    <a class="button button--inverted" href="#explore" data-route="explore">Browse equipment ${icons.arrow}</a>
  </section>`;

const filteredProducts = () => {
  const query = ui.query.trim().toLowerCase();
  const products = store.get().products.filter((product) =>
    (ui.filter === 'All' || product.category === ui.filter)
    && (!query || `${product.name} ${product.brand || ''} ${product.category} ${product.description || ''}`.toLowerCase().includes(query))
    && product.price <= ui.maxPrice
    && (ui.availability === 'all' || product.stock > 0),
  );
  if (ui.sort === 'low') products.sort((a, b) => a.price - b.price);
  if (ui.sort === 'high') products.sort((a, b) => b.price - a.price);
  if (ui.sort === 'rating') products.sort((a, b) => b.rating - a.rating);
  if (ui.sort === 'popular') products.sort((a, b) => b.reviews - a.reviews);
  return products;
};

const exploreView = () => {
  const products = filteredProducts();
  return `
    <section class="page site-container" aria-labelledby="explore-title">
      <header class="page-heading"><p class="eyebrow">The collection</p><h1 id="explore-title">Find your next thing.</h1><p>Considered equipment for projects, weekends, and everything between.</p></header>
      <div class="catalog-toolbar catalog-toolbar--stack">
        <label class="search-control"><span class="visually-hidden">Search equipment</span>${icons.search}<input type="search" data-search placeholder="Search the collection" value="${escapeHtml(ui.query)}"></label>
        <div class="catalog-toolbar__selects">
          <label><span class="visually-hidden">Filter by category</span><select data-filter>${categories.map((category) => `<option value="${category.value}"${ui.filter === category.value ? ' selected' : ''}>${category.label}</option>`).join('')}</select></label>
          <label><span class="visually-hidden">Sort products</span><select data-sort><option value="featured">Featured</option><option value="popular"${ui.sort === 'popular' ? ' selected' : ''}>Most popular</option><option value="rating"${ui.sort === 'rating' ? ' selected' : ''}>Top rated</option><option value="low"${ui.sort === 'low' ? ' selected' : ''}>Price: low to high</option><option value="high"${ui.sort === 'high' ? ' selected' : ''}>Price: high to low</option></select></label>
        </div>
      </div>
      <div class="filter-row"><label class="range-control"><span>Up to <strong data-price-value>${money(ui.maxPrice)}</strong> / day</span><input type="range" min="149" max="1200" step="50" value="${ui.maxPrice}" data-price-range></label><label class="availability-control"><input type="checkbox" data-availability${ui.availability === 'available' ? ' checked' : ''}> Available now</label><button class="text-link filter-reset" type="button" data-action="reset-filters">Reset filters</button></div>
      <div class="catalog-meta"><span data-result-count>${products.length} items</span><span>All prices per day</span></div>
      <div data-product-results>${productGrid(products)}</div>
    </section>`;
};

const productDetailView = () => {
  const product = store.get().products.find(({ id }) => id === ui.productId);
  if (!product) return emptyState('Product not found', 'This item may have been removed from the demo catalog.', '<a class="button" href="#explore" data-route="explore">Back to collection</a>');
  const related = store.get().products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const customerReviews = customerStore.getAllReviews().filter((review) => !review.hidden && store.get().bookings.some((booking) => String(booking.id) === String(review.bookingId) && booking.productId === product.id));
  return `<section class="page product-detail site-container" aria-labelledby="product-title">
    <a class="back-link" href="#explore" data-route="explore">${icons.arrow} Back to collection</a>
    <div class="detail-grid"><div class="gallery"><div class="gallery-main"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" data-detail-image data-image-fallback></div><div class="gallery-thumbs"><button class="gallery-thumb is-active" data-gallery-image="${escapeHtml(product.image)}"><img src="${escapeHtml(product.image)}" alt="Main view"></button><button class="gallery-thumb" data-gallery-image="${escapeHtml(product.image)}&crop=faces"><img src="${escapeHtml(product.image)}&crop=faces" alt="Alternate view"></button></div></div>
    <div class="detail-copy"><p class="eyebrow">${escapeHtml(product.brand || 'RENTIFY')} · ${escapeHtml(product.condition || 'Checked')}</p><h1 id="product-title">${escapeHtml(product.name)}</h1><div class="detail-rating"><span>★ ${product.rating}</span><span>Demo reviews · ${product.reviews}</span><span>${product.stock} available</span></div><p class="detail-description">${escapeHtml(product.description || 'Quality checked equipment for the days you need it.')}</p>
      <div class="detail-price"><strong>${money(product.price)}</strong><span>/ day</span><small>+ ${money(product.deposit)} refundable demo deposit</small></div>
      <div class="availability-box"><span>Choose dates</span><div class="detail-dates"><label class="field"><span>Start date</span><input id="detailStart" type="date" min="${today()}" value="${today()}" data-detail-start data-detail-date></label><label class="field"><span>End date</span><input id="detailEnd" type="date" min="${today()}" value="${today()}" data-detail-end data-detail-date></label></div><label class="field"><span>Quantity</span><input type="number" min="1" max="${Math.max(1, product.stock)}" step="1" value="1" data-detail-quantity data-detail-date></label><span>Availability is checked again before confirmation.</span><div class="detail-cost" data-detail-cost></div></div>
      <button class="button button--full" type="button" data-action="book" data-id="${product.id}">Reserve this gear ${icons.arrow}</button>
      <div class="detail-note">Demo only. No payment is collected.</div>
      <div class="detail-panels"><details open><summary>What's included</summary><ul>${(product.included || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></details><details><summary>Specifications</summary><dl>${(product.specifications || []).map((item) => `<div><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd></div>`).join('')}</dl></details></div>
    </div></div>
    <section class="detail-section" aria-labelledby="reviews-title"><div class="section-heading"><div><p class="eyebrow">Demo feedback</p><h2 id="reviews-title">Reviews from the sample catalog.</h2></div></div><div class="review-grid"><article><strong>“Easy to understand and ready to use.”</strong><p>Demo review · Priya S.</p></article><article><strong>“The condition notes made choosing simple.”</strong><p>Demo review · Arjun K.</p></article>${customerReviews.map((review) => `<article><strong class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</strong><p>${escapeHtml(review.text)}</p><small>Verified demo rental</small></article>`).join('')}</div></section>
    <section class="detail-section" aria-labelledby="related-title"><div class="section-heading"><div><p class="eyebrow">Keep exploring</p><h2 id="related-title">You may also like.</h2></div></div>${productGrid(related)}</section>
  </section>`;
};

const statusClass = (status) => `status status--${status.toLowerCase()}`;

const accountNav = (active) => `<nav class="account-nav" aria-label="Account navigation">${[
  ['dashboard', 'Overview'], ['bookings', 'My bookings'], ['wishlist', 'Wishlist'], ['reviews', 'My reviews'], ['profile', 'Profile & settings'], ['notifications', 'Notifications'],
].map(([route, label]) => `<a href="#${route}" data-route="${route}" class="${active === route ? 'is-active' : ''}">${label}${route === 'notifications' && customerStore.getUnreadCount() ? `<span class="nav-count">${customerStore.getUnreadCount()}</span>` : ''}</a>`).join('')}</nav>`;

const customerBookings = () => {
  const user = auth.getUser();
  return store.get().bookings.filter((booking) => booking.userId === user?.id || (!booking.userId && booking.email === user?.email));
};

const bookingProduct = (booking) => store.get().products.find((product) => product.id === booking.productId);
const bookingBucket = (booking) => {
  if (booking.status === 'Cancelled' || booking.status === 'Rejected') return 'cancelled';
  if (booking.status === 'Completed') return 'completed';
  if (booking.status === 'Active' || (booking.status === 'Approved' && booking.start <= today() && booking.end >= today())) return 'active';
  return 'upcoming';
};

const bookingCard = (booking, compact = false) => {
  const product = bookingProduct(booking);
  return `<article class="booking-card"><img src="${escapeHtml(product?.image || heroImage)}" alt="${escapeHtml(product?.name || 'Removed equipment')}" data-image-fallback><div class="booking-card__body"><div class="booking-card__top"><div><p class="overline">${escapeHtml(product?.category || 'Rental')}</p><h3>${escapeHtml(product?.name || 'Removed equipment')}</h3></div><span class="${statusClass(booking.status)}">${escapeHtml(booking.status)}</span></div><p class="booking-card__dates">${escapeHtml(booking.start)} <span aria-hidden="true">→</span> ${escapeHtml(booking.end)} · ${booking.quantity || 1} unit${Number(booking.quantity || 1) === 1 ? '' : 's'}</p><div class="booking-card__meta"><span>${money(booking.total)} total</span><span>${money(booking.deposit ?? (product?.deposit || 0))} deposit</span></div><div class="booking-card__actions"><a class="text-link" href="#booking-detail/${booking.id}" data-booking-link="${booking.id}">View details ${icons.arrow}</a>${['Pending', 'Approved'].includes(booking.status) ? `<button class="table-action table-action--danger" type="button" data-action="cancel-booking" data-id="${booking.id}">Cancel booking</button>` : ''}</div></div></article>`;
};

const dashboardView = () => {
  const bookings = customerBookings();
  const upcoming = bookings.filter((booking) => ['upcoming', 'active'].includes(bookingBucket(booking))).slice(0, 2);
  const completed = bookings.filter((booking) => bookingBucket(booking) === 'completed').length;
  const active = bookings.filter((booking) => bookingBucket(booking) === 'active').length;
  const recommendations = store.get().products.filter((product) => !customerStore.getWishlist().includes(product.id)).slice(0, 4);
  return `<section class="account-page site-container" aria-labelledby="dashboard-title">${accountNav('dashboard')}<header class="account-heading"><p class="eyebrow">Your RENTIFY</p><h1 id="dashboard-title">Good to see you, ${escapeHtml(auth.getUser()?.name || 'there')}.</h1><p>Your plans, saved gear, and rental history in one considered place.</p></header><div class="dashboard-grid"><div class="dashboard-main"><section class="account-section"><div class="section-heading section-heading--compact"><div><p class="eyebrow">Coming up</p><h2>Upcoming rentals</h2></div><a class="text-link" href="#bookings" data-route="bookings">View all ${icons.arrow}</a></div>${upcoming.length ? `<div class="booking-stack">${upcoming.map((booking) => bookingCard(booking)).join('')}</div>` : emptyState('No upcoming rentals', 'Your next good plan could start with a piece of gear.', '<a class="button" href="#explore" data-route="explore">Explore equipment</a>')}</section><section class="account-section"><div class="section-heading section-heading--compact"><div><p class="eyebrow">For your next plan</p><h2>Recommended equipment</h2></div><a class="text-link" href="#explore" data-route="explore">Browse all ${icons.arrow}</a></div>${productGrid(recommendations)}</section></div><aside class="dashboard-aside"><div class="quick-actions"><p class="eyebrow">Quick actions</p><a class="quick-action" href="#explore" data-route="explore"><span>Find a new rental</span>${icons.arrow}</a><a class="quick-action" href="#wishlist" data-route="wishlist"><span>Open your wishlist</span>${icons.arrow}</a><a class="quick-action" href="#profile" data-route="profile"><span>Update your details</span>${icons.arrow}</a></div><div class="account-stats"><div><span>Upcoming</span><strong>${bookings.filter((booking) => bookingBucket(booking) === 'upcoming').length}</strong></div><div><span>Active</span><strong>${active}</strong></div><div><span>Completed</span><strong>${completed}</strong></div></div><div class="activity-card"><p class="eyebrow">Recent activity</p>${bookings.slice(-3).reverse().map((booking) => `<div class="activity-row"><span class="activity-dot"></span><span>${escapeHtml(bookingProduct(booking)?.name || 'Rental')} <small>${escapeHtml(booking.status)}</small></span></div>`).join('') || '<p class="muted-copy">Your activity will appear here.</p>'}</div></aside></div></section>`;
};

const bookingsView = () => {
  const bookings = customerBookings();
  const visible = bookings.filter((booking) => bookingBucket(booking) === ui.bookingTab);
  return `<section class="account-page site-container" aria-labelledby="bookings-title">${accountNav('bookings')}<header class="account-heading account-heading--compact"><p class="eyebrow">Your rental journey</p><h1 id="bookings-title">My bookings.</h1><p>Every request and return, saved to your demo account.</p></header><div class="booking-tabs" role="tablist">${[['upcoming', 'Upcoming'], ['active', 'Active'], ['completed', 'Completed'], ['cancelled', 'Cancelled']].map(([value, label]) => `<button type="button" role="tab" aria-selected="${ui.bookingTab === value}" class="${ui.bookingTab === value ? 'is-active' : ''}" data-action="booking-tab" data-tab="${value}">${label}<span>${bookings.filter((booking) => bookingBucket(booking) === value).length}</span></button>`).join('')}</div>${visible.length ? `<div class="booking-stack booking-stack--wide">${visible.map((booking) => bookingCard(booking)).join('')}</div>` : emptyState(`No ${ui.bookingTab} bookings`, ui.bookingTab === 'upcoming' ? 'Reserve something useful for the next thing on your calendar.' : 'Bookings will move here as their status changes.', ui.bookingTab === 'upcoming' ? '<a class="button" href="#explore" data-route="explore">Explore equipment</a>' : '')}</section>`;
};

const bookingDetailView = () => {
  const booking = customerBookings().find((item) => String(item.id) === String(ui.bookingId));
  if (!booking) return `<section class="page site-container">${emptyState('Booking not found', 'This rental is not part of your account.', '<a class="button" href="#bookings" data-route="bookings">Back to bookings</a>')}</section>`;
  const product = bookingProduct(booking);
  const steps = ['Requested', 'Approved', 'Active', 'Completed'];
  const current = booking.status === 'Pending' ? 0 : booking.status === 'Approved' ? (bookingBucket(booking) === 'active' ? 2 : 1) : booking.status === 'Completed' ? 3 : -1;
  return `<section class="account-page site-container" aria-labelledby="booking-detail-title">${accountNav('bookings')}<a class="back-link" href="#bookings" data-route="bookings">${icons.arrow} Back to bookings</a><div class="booking-detail-grid"><div><img class="booking-detail-image" src="${escapeHtml(product?.image || heroImage)}" alt="${escapeHtml(product?.name || 'Rental')}" data-image-fallback><div class="status-timeline">${steps.map((step, index) => `<div class="timeline-step ${index <= current ? 'is-complete' : ''}"><span>${index < current ? '✓' : String(index + 1).padStart(2, '0')}</span><div><strong>${step}</strong><small>${index === 0 ? booking.start : index === 3 ? booking.end : index <= current ? 'Recorded in demo' : 'Waiting for update'}</small></div></div>`).join('')}</div></div><div class="booking-detail-copy"><p class="eyebrow">${escapeHtml(product?.brand || 'RENTIFY')} · ${escapeHtml(booking.status)}</p><h1 id="booking-detail-title">${escapeHtml(product?.name || 'Rental booking')}</h1><p class="detail-description">${escapeHtml(product?.description || 'Your rental details are saved to this browser account.')}</p><div class="detail-summary"><div><span>Rental dates</span><strong>${escapeHtml(booking.start)} → ${escapeHtml(booking.end)}</strong></div><div><span>Rental total</span><strong>${money(booking.total)}</strong></div><div><span>Quantity</span><strong>${booking.quantity || 1} unit${Number(booking.quantity || 1) === 1 ? '' : 's'}</strong></div></div><div class="cost cost--detail"><div><span>${money(product?.price || 0)} × ${booking.rentalDays || Math.max(1, dayCount(booking.start, booking.end))} days × ${booking.quantity || 1} units</span><strong>${money(booking.subtotal ?? ((product?.price || 0) * Math.max(1, dayCount(booking.start, booking.end)) * (booking.quantity || 1)))}</strong></div><div><span>Refundable deposit</span><strong>${money(booking.deposit ?? ((product?.deposit || 0) * (booking.quantity || 1)))}</strong></div><div class="cost__total"><span>Total due at pickup</span><strong>${money(booking.total)}</strong></div></div>${['Pending', 'Approved'].includes(booking.status) ? '<button class="button button--secondary" type="button" data-action="cancel-booking" data-id="' + booking.id + '">Cancel booking</button>' : ''}${booking.status === 'Completed' && !customerStore.getReview(booking.id) ? '<a class="button" href="#reviews" data-route="reviews">Leave a review ' + icons.arrow + '</a>' : ''}<p class="detail-note">Demo record only. No payment or backend reservation exists.</p></div></div></section>`;
};

const wishlistView = () => {
  const saved = store.get().products.filter(({ id }) => customerStore.getWishlist().includes(id));
  return `<section class="account-page site-container" aria-labelledby="wishlist-title">${accountNav('wishlist')}<header class="account-heading account-heading--compact"><p class="eyebrow">Saved for later</p><h1 id="wishlist-title">Your wishlist.</h1><p>Keep a shortlist while you decide what the next plan needs.</p></header>${saved.length ? productGrid(saved) : emptyState('Your shortlist is empty', 'Save an item and it will be waiting here.', '<a class="button" href="#explore" data-route="explore">Explore equipment</a>')}</section>`;
};

const reviewsView = () => {
  const completed = customerBookings().filter((booking) => booking.status === 'Completed');
  return `<section class="account-page site-container" aria-labelledby="reviews-title">${accountNav('reviews')}<header class="account-heading account-heading--compact"><p class="eyebrow">Your perspective</p><h1 id="reviews-title">My reviews.</h1><p>Share useful feedback on completed demo rentals. One review per booking.</p></header>${completed.length ? `<div class="review-list">${completed.map((booking) => { const review = customerStore.getReview(booking.id); const product = bookingProduct(booking); return `<article class="review-card"><img src="${escapeHtml(product?.image || heroImage)}" alt="${escapeHtml(product?.name || 'Rental')}" data-image-fallback><div><p class="overline">${escapeHtml(booking.end)}</p><h3>${escapeHtml(product?.name || 'Rental')}</h3>${review ? `<p class="review-stars" aria-label="${review.rating} out of 5 stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p><p>${escapeHtml(review.text)}</p><div class="booking-card__actions"><button class="table-action" data-action="edit-review" data-id="${booking.id}">Edit</button><button class="table-action table-action--danger" data-action="delete-review" data-id="${review.id}">Delete</button></div>` : `<button class="button button--compact" data-action="review" data-id="${booking.id}">Review this rental</button>`}</div></article>`; }).join('')}</div>` : emptyState('Reviews unlock after a rental', 'Complete a rental in the demo and your review prompt will appear here.', '<a class="button" href="#explore" data-route="explore">Explore equipment</a>')}</section>`;
};

const profileView = () => {
  const profile = customerStore.getProfile();
  return `<section class="account-page site-container" aria-labelledby="profile-title">${accountNav('profile')}<header class="account-heading account-heading--compact"><p class="eyebrow">Your details</p><h1 id="profile-title">Profile & settings.</h1><p>Keep your account details and preferences current in this browser.</p></header><div class="settings-grid"><form class="settings-card" data-profile-form><p class="eyebrow">Profile</p><label class="field"><span>Full name</span><input name="name" required value="${escapeHtml(profile.name)}"></label><label class="field"><span>Email</span><input value="${escapeHtml(profile.email)}" disabled></label><label class="field"><span>Phone (optional)</span><input name="phone" type="tel" value="${escapeHtml(profile.phone)}" placeholder="+91 00000 00000"></label><label class="field"><span>City (optional)</span><input name="city" value="${escapeHtml(profile.city)}" placeholder="Your city"></label><button class="button" type="submit">Save profile ${icons.arrow}</button></form><div class="settings-card"><p class="eyebrow">Preferences</p><label class="settings-toggle"><span>Product updates and rental reminders</span><input type="checkbox" data-notification-setting ${profile.notifications ? 'checked' : ''}></label><div class="theme-setting"><span>Colour theme</span><button class="button button--secondary" type="button" data-action="theme-setting">Cycle theme</button></div><p class="detail-note">Theme changes are saved locally. Notifications are demo-only.</p><button class="button button--secondary" type="button" data-auth-action="signout">Sign out</button></div></div><section class="account-section"><div class="section-heading section-heading--compact"><div><p class="eyebrow">History</p><h2>Rental history</h2></div></div><p class="muted-copy">${customerBookings().length} booking${customerBookings().length === 1 ? '' : 's'} saved to this account.</p></section></section>`;
};

const notificationsView = () => {
  const notifications = customerStore.getNotifications();
  return `<section class="account-page site-container" aria-labelledby="notifications-title">${accountNav('notifications')}<header class="account-heading account-heading--compact"><p class="eyebrow">Keep in the loop</p><h1 id="notifications-title">Notifications.</h1><p>Useful updates about your demo rentals, all in one place.</p></header>${notifications.length ? `<div class="notification-list">${notifications.map((notification) => `<article class="notification-card ${notification.read ? '' : 'is-unread'}"><span class="notification-mark">${notification.type === 'review' ? '★' : 'R'}</span><div><h3>${escapeHtml(notification.title)}</h3><p>${escapeHtml(notification.message)}</p><small>${escapeHtml(new Date(notification.createdAt).toLocaleDateString('en-IN'))}</small></div>${notification.read ? '' : `<button class="table-action" data-action="read-notification" data-id="${notification.id}">Mark read</button>`}</article>`).join('')}</div><button class="text-link" type="button" data-action="read-all-notifications">Mark all as read</button>` : emptyState('All quiet for now', 'Booking updates and review reminders will appear here.')}</section>`;
};

const legacyBookingsView = () => {
  const { bookings, products } = store.get();
  const user = auth.getUser();
  const visibleBookings = user?.role === 'admin' ? bookings : bookings.filter((booking) => booking.email === user?.email);
  return `<section class="page site-container" aria-labelledby="bookings-title"><header class="page-heading"><p class="eyebrow">Your rental journey</p><h1 id="bookings-title">My rentals.</h1></header>${visibleBookings.length ? `<div class="data-card"><div class="table-responsive"><table class="data-table"><tbody>${visibleBookings.map((booking) => `<tr><td>${escapeHtml(booking.name)}</td><td>${escapeHtml(booking.start)} - ${escapeHtml(booking.end)}</td><td>${money(booking.total)}</td></tr>`).join('')}</tbody></table></div></div>` : emptyState('No rentals yet', 'When you reserve something, it will appear here.')}</section>`;
};

const legacyWishlistView = () => {
  const saved = store.get().products.filter(({ id }) => store.get().wishlist.includes(id));
  return `<section class="page site-container">${saved.length ? productGrid(saved) : emptyState('Your shortlist is empty', 'Save an item and it will be waiting here.')}</section>`;
};

const adminNav = () => `<nav class="admin-nav" aria-label="Admin navigation">${[['overview', 'Overview'], ['products', 'Products'], ['bookings', 'Bookings'], ['customers', 'Customers'], ['availability', 'Availability'], ['reviews', 'Reviews'], ['analytics', 'Analytics'], ['settings', 'Settings']].map(([value, label]) => `<button type="button" class="${ui.adminTab === value ? 'is-active' : ''}" data-admin-tab="${value}">${label}</button>`).join('')}</nav>`;

const adminShell = (content, title = 'Admin overview.') => `<section class="admin-page site-container" aria-labelledby="admin-title">${adminNav()}<header class="admin-heading"><div><p class="eyebrow">RENTIFY · Merchant demo</p><h1 id="admin-title">${title}</h1><p>Manage the local marketplace with transparent, browser-only demo data.</p></div><button class="button button--secondary" type="button" data-action="reset">Reset demo data</button></header>${content}</section>`;

const adminBookingStatus = (booking) => allowedTransitions(booking.status);

const maxHeldQuantity = (productId, bookings = store.get().bookings) => {
  const held = bookings.filter((booking) => Number(booking.productId) === Number(productId) && ['Pending', 'Approved', 'Active'].includes(booking.status));
  return held.reduce((maximum, booking) => Math.max(maximum, getReservedQuantity(held, productId, booking.start, booking.end)), 0);
};

const adminBookingRows = (bookings) => {
  const { products } = store.get();
  return bookings.length ? bookings.map((booking) => {
    const product = products.find((item) => item.id === booking.productId);
    const actions = adminBookingStatus(booking).map((next) => `<button class="table-action${['Rejected', 'Cancelled'].includes(next) ? ' table-action--danger' : ''}" data-action="status" data-id="${booking.id}" data-status="${next}">${next}</button>`).join('');
    return `<tr><td><strong>${escapeHtml(product?.name || 'Removed product')}</strong><small>${escapeHtml(booking.start)} → ${escapeHtml(booking.end)}</small></td><td>${escapeHtml(booking.name)}<small>${escapeHtml(booking.email)}</small></td><td>${money(booking.total)}</td><td><span class="${statusClass(booking.status)}">${escapeHtml(booking.status)}</span></td><td><div class="table-actions">${actions || '—'}<button class="table-action" data-action="booking-detail-admin" data-id="${booking.id}">View</button></div></td></tr>`;
  }).join('') : '<tr><td colspan="5" class="table-empty">No booking requests match these filters.</td></tr>';
};

const adminOverview = () => {
  const { products, bookings } = store.get();
  const customers = auth.getAccounts().filter((account) => account.role === 'customer');
  const completed = bookings.filter((booking) => booking.status === 'Completed');
  const active = bookings.filter((booking) => booking.status === 'Active');
  const pending = bookings.filter((booking) => booking.status === 'Pending');
  const revenue = completed.reduce((sum, booking) => sum + Number(booking.total || 0), 0);
  const recent = [...bookings].sort((a, b) => b.id - a.id).slice(0, 5);
  const trend = [...Array(7)].map((_, index) => {
    const date = new Date(Date.now() - ((6 - index) * 86400000)).toISOString().slice(0, 10);
    return { date, count: bookings.filter((booking) => booking.start === date).length };
  });
  const max = Math.max(1, ...trend.map((item) => item.count));
  return adminShell(`<div class="admin-stat-grid">${[['Products', products.length], ['Customers', customers.length], ['Bookings', bookings.length], ['Active rentals', active.length], ['Pending requests', pending.length], ['Completed', completed.length], ['Revenue estimate', money(revenue)]].map(([label, value]) => `<article class="admin-stat"><span>${label}</span><strong>${value}</strong><small>stored demo data</small></article>`).join('')}</div><div class="admin-dashboard-grid"><section class="admin-panel"><div class="section-heading section-heading--compact"><div><p class="eyebrow">Last seven days</p><h2>Booking trend</h2></div></div><div class="admin-chart" role="img" aria-label="Bookings by start date">${trend.map((item) => `<div class="admin-chart__column"><span style="height:${Math.max(8, (item.count / max) * 100)}%" title="${item.count} bookings"></span><small>${item.date.slice(5)}</small></div>`).join('')}</div></section><section class="admin-panel"><div class="section-heading section-heading--compact"><div><p class="eyebrow">Latest movement</p><h2>Recent activity</h2></div><button class="text-link" type="button" data-admin-tab="bookings">All bookings ${icons.arrow}</button></div>${recent.length ? recent.map((booking) => `<div class="admin-activity"><span class="activity-dot"></span><div><strong>${escapeHtml(booking.name)}</strong><small>${escapeHtml(booking.status)} · ${escapeHtml(booking.start)}</small></div></div>`).join('') : '<p class="muted-copy">Activity will appear when demo bookings are created.</p>'}</section></div>`);
};

const adminProducts = () => {
  const { products } = store.get();
  const query = ui.adminQuery.toLowerCase();
  const filtered = products.filter((product) => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query) && (ui.adminCategory === 'All' || product.category === ui.adminCategory));
  return adminShell(`<div class="admin-toolbar"><label class="header-search admin-search"><span class="visually-hidden">Search products</span><input value="${escapeHtml(ui.adminQuery)}" data-admin-search placeholder="Search products"></label><select data-admin-category aria-label="Filter products by category"><option>All</option>${categories.slice(1).map((category) => `<option${ui.adminCategory === category.value ? ' selected' : ''}>${category.value}</option>`).join('')}</select><button class="button" type="button" data-action="product-form">Add product ${icons.arrow}</button></div><div class="data-card"><div class="table-responsive"><table class="data-table admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Deposit</th><th>Stock</th><th>Condition</th><th>Actions</th></tr></thead><tbody>${filtered.length ? filtered.map((product) => `<tr><td><div class="admin-product-cell"><img src="${escapeHtml(product.image || heroImage)}" alt="" data-image-fallback><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.brand || 'Unbranded')}</small></div></td><td>${escapeHtml(product.category)}</td><td>${money(product.price)}<small>/ day</small></td><td>${money(product.deposit)}</td><td>${product.stock}</td><td>${escapeHtml(product.condition || 'Checked')}</td><td><div class="table-actions"><button class="table-action" data-action="product-form" data-id="${product.id}">Edit</button><button class="table-action table-action--danger" data-action="delete-product" data-id="${product.id}">Archive</button></div></td></tr>`).join('') : '<tr><td colspan="7" class="table-empty">No products match these filters.</td></tr>'}</tbody></table></div></div>`, 'Products');
};

const adminBookings = () => {
  const { bookings, products } = store.get();
  const query = ui.adminQuery.toLowerCase();
  const filtered = bookings.filter((booking) => {
    const product = products.find((item) => item.id === booking.productId);
    return `${booking.name} ${booking.email} ${product?.name || ''}`.toLowerCase().includes(query) && (ui.adminStatus === 'All' || booking.status === ui.adminStatus);
  });
  return adminShell(`<div class="admin-toolbar"><label class="header-search admin-search"><span class="visually-hidden">Search bookings</span><input value="${escapeHtml(ui.adminQuery)}" data-admin-search placeholder="Search customer or product"></label><select data-admin-status aria-label="Filter bookings by status"><option>All</option>${['Pending', 'Approved', 'Active', 'Completed', 'Rejected', 'Cancelled'].map((status) => `<option${ui.adminStatus === status ? ' selected' : ''}>${status}</option>`).join('')}</select></div><div class="data-card"><div class="table-responsive"><table class="data-table admin-table"><thead><tr><th>Rental</th><th>Customer</th><th>Total</th><th>Status</th><th>Manage</th></tr></thead><tbody>${adminBookingRows(filtered)}</tbody></table></div></div>`, 'Bookings');
};

const adminCustomers = () => {
  const customers = auth.getAccounts().filter((account) => account.role === 'customer');
  const { bookings } = store.get();
  const query = ui.adminQuery.toLowerCase();
  const filtered = customers.filter((customer) => `${customer.name} ${customer.email}`.toLowerCase().includes(query));
  return adminShell(`<div class="admin-toolbar"><label class="header-search admin-search"><span class="visually-hidden">Search customers</span><input value="${escapeHtml(ui.adminQuery)}" data-admin-search placeholder="Search customers"></label></div><div class="data-card"><div class="table-responsive"><table class="data-table admin-table"><thead><tr><th>Customer</th><th>Bookings</th><th>Last activity</th><th>Access</th><th>Actions</th></tr></thead><tbody>${filtered.length ? filtered.map((customer) => { const customerBookings = bookings.filter((booking) => booking.userId === customer.id || (!booking.userId && booking.email === customer.email)); const last = [...customerBookings].sort((a, b) => b.id - a.id)[0]; return `<tr><td><strong>${escapeHtml(customer.name)}</strong><small>${escapeHtml(customer.email)}</small></td><td>${customerBookings.length}</td><td>${last ? escapeHtml(last.status) : 'No bookings'}</td><td><span class="status ${customer.active === false ? 'status--cancelled' : 'status--approved'}">${customer.active === false ? 'Deactivated' : 'Active'}</span></td><td><div class="table-actions"><button class="table-action" data-action="customer-detail" data-id="${customer.id}">View</button><button class="table-action" data-action="toggle-customer" data-id="${customer.id}" data-active="${customer.active === false ? 'true' : 'false'}">${customer.active === false ? 'Activate' : 'Deactivate'}</button></div></td></tr>`; }).join('') : '<tr><td colspan="5" class="table-empty">No customers match this search.</td></tr>'}</tbody></table></div></div>`, 'Customers');
};

const adminAvailability = () => {
  const { products, bookings } = store.get();
  const blocked = adminStore.getBlockedDates();
  return adminShell(`<div class="admin-dashboard-grid"><section class="admin-panel"><div class="section-heading section-heading--compact"><div><p class="eyebrow">Inventory control</p><h2>Stock levels</h2></div></div>${products.map((product) => `<form class="inventory-row" data-inventory-form data-id="${product.id}"><img src="${escapeHtml(product.image || heroImage)}" alt="" data-image-fallback><span><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.category)}</small></span><label><span class="visually-hidden">Stock</span><input name="stock" type="number" min="0" max="999" value="${product.stock}" aria-label="Stock for ${escapeHtml(product.name)}"></label><button class="table-action" type="submit">Save</button></form>`).join('')}</section><section class="admin-panel"><div class="section-heading section-heading--compact"><div><p class="eyebrow">Maintenance</p><h2>Blocked dates</h2></div></div><form class="blocked-date-form" data-blocked-date-form><div class="form-grid"><label class="field"><span>Start</span><input name="start" type="date" min="${today()}" required></label><label class="field"><span>End</span><input name="end" type="date" min="${today()}" required></label></div><label class="field"><span>Reason</span><input name="reason" maxlength="80" placeholder="Maintenance"></label><button class="button" type="submit">Block dates ${icons.arrow}</button></form><div class="blocked-date-list">${blocked.length ? blocked.map((record) => `<div class="blocked-date"><span><strong>${escapeHtml(record.start)} → ${escapeHtml(record.end)}</strong><small>${escapeHtml(record.reason || 'Maintenance')}</small></span><button class="table-action table-action--danger" data-action="remove-blocked-date" data-id="${record.id}">Remove</button></div>`).join('') : '<p class="muted-copy">No maintenance windows are blocked.</p>'}</div><h3 class="admin-subheading">Reservations</h3>${bookings.filter((booking) => !['Cancelled', 'Rejected', 'Completed'].includes(booking.status)).slice(0, 8).map((booking) => `<div class="blocked-date"><span><strong>${escapeHtml(booking.start)} → ${escapeHtml(booking.end)}</strong><small>${escapeHtml(booking.name)}</small></span><span class="status status--approved">${escapeHtml(booking.status)}</span></div>`).join('') || '<p class="muted-copy">No active reservations.</p>'}</section></div>`, 'Availability');
};

const adminReviews = () => {
  const { products } = store.get();
  const reviews = customerStore.getAllReviews();
  return adminShell(`<div class="admin-toolbar"><select data-admin-rating aria-label="Filter reviews by rating"><option value="All">All ratings</option>${[5, 4, 3, 2, 1].map((rating) => `<option value="${rating}">${rating} stars</option>`).join('')}</select></div><div class="admin-review-list">${reviews.length ? reviews.map((review) => { const booking = store.get().bookings.find((item) => item.id === review.bookingId); const product = products.find((item) => item.id === booking?.productId); return `<article class="admin-review ${review.hidden ? 'is-hidden' : ''}"><div><p class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p><h3>${escapeHtml(product?.name || 'Removed product')}</h3><p>${escapeHtml(review.text)}</p><small>${review.hidden ? 'Hidden from storefront' : 'Visible in storefront'} · ${escapeHtml(booking?.email || 'Customer')}</small></div><button class="table-action" data-action="toggle-review" data-id="${review.id}" data-hidden="${review.hidden ? 'false' : 'true'}">${review.hidden ? 'Restore' : 'Hide'}</button></article>`; }).join('') : emptyState('No customer reviews yet', 'Reviews from completed demo rentals will appear here.')}</div>`, 'Reviews');
};

const adminAnalytics = () => {
  const { bookings, products } = store.get();
  const byCategory = products.map((product) => ({ name: product.category, count: bookings.filter((booking) => booking.productId === product.id).length })).reduce((result, item) => { const existing = result.find((entry) => entry.name === item.name); if (existing) existing.count += item.count; else result.push(item); return result; }, []).sort((a, b) => b.count - a.count);
  const popular = products.map((product) => ({ ...product, rentals: bookings.filter((booking) => booking.productId === product.id).length })).sort((a, b) => b.rentals - a.rentals).slice(0, 6);
  const revenue = bookings.filter((booking) => booking.status === 'Completed').reduce((sum, booking) => sum + Number(booking.total || 0), 0);
  return adminShell(`<div class="admin-stat-grid"><article class="admin-stat"><span>Completed revenue</span><strong>${money(revenue)}</strong><small>from stored completed bookings</small></article><article class="admin-stat"><span>Average booking</span><strong>${money(bookings.length ? bookings.reduce((sum, booking) => sum + Number(booking.total || 0), 0) / bookings.length : 0)}</strong><small>all request statuses</small></article></div><div class="admin-dashboard-grid"><section class="admin-panel"><p class="eyebrow">Category distribution</p><h2>What customers rent</h2>${byCategory.length ? byCategory.map((item) => `<div class="analytics-row"><span>${escapeHtml(item.name)}</span><strong>${item.count}</strong></div>`).join('') : '<p class="muted-copy">Create bookings to see category demand.</p>'}</section><section class="admin-panel"><p class="eyebrow">Popular products</p><h2>Most requested</h2>${popular.map((product) => `<div class="analytics-row"><span>${escapeHtml(product.name)}</span><strong>${product.rentals}</strong></div>`).join('')}</section></div>`, 'Analytics');
};

const adminSettings = () => {
  const user = auth.getUser();
  return adminShell(`<div class="settings-grid"><form class="settings-card" data-admin-profile-form><p class="eyebrow">Demo admin profile</p><label class="field"><span>Name</span><input name="name" required value="${escapeHtml(user?.name || '')}"></label><label class="field"><span>Email</span><input value="${escapeHtml(user?.email || '')}" disabled></label><button class="button" type="submit">Save profile ${icons.arrow}</button></form><div class="settings-card"><p class="eyebrow">Appearance</p><p class="muted-copy">The admin uses the same RENTIFY theme preference as the storefront.</p><button class="button button--secondary" type="button" data-action="theme-setting">Cycle theme</button><p class="detail-note">This is a frontend-only merchant demo. Route guards and account controls do not provide backend authorization.</p><button class="button button--secondary" type="button" data-action="signout-admin">Sign out</button></div></div>`, 'Settings');
};

const adminView = () => ({ overview: adminOverview, products: adminProducts, bookings: adminBookings, customers: adminCustomers, availability: adminAvailability, reviews: adminReviews, analytics: adminAnalytics, settings: adminSettings }[ui.adminTab]());

const views = { home: homeView, explore: exploreView, dashboard: dashboardView, bookings: bookingsView, 'booking-detail': bookingDetailView, wishlist: wishlistView, reviews: reviewsView, profile: profileView, notifications: notificationsView, admin: adminView, product: productDetailView, auth: authView, onboarding: onboardingView };

function updateWishlistCount() {
  const count = customerStore.getWishlist().length;
  document.querySelectorAll('[data-wishlist-count]').forEach((badge) => {
    badge.textContent = count;
    badge.hidden = count === 0;
  });
}

function detailCostBreakdown(product) {
  const start = document.querySelector('[data-detail-start]')?.value;
  const end = document.querySelector('[data-detail-end]')?.value;
  const quantity = Number(document.querySelector('[data-detail-quantity]')?.value || 1);
  const output = document.querySelector('[data-detail-cost]');
  if (!output) return;
  const breakdown = calculateRental({ start, end, dailyRate: product.price, depositPerUnit: product.deposit, quantity });
  if (!breakdown.days) {
    output.textContent = 'Choose a return date on or after your start date.';
    return;
  }
  output.innerHTML = `<div><span>${money(product.price)} × ${breakdown.days} day${breakdown.days > 1 ? 's' : ''} × ${breakdown.quantity} unit${breakdown.quantity > 1 ? 's' : ''}</span><strong>${money(breakdown.subtotal)}</strong></div><div><span>Refundable deposit</span><strong>${money(breakdown.deposit)}</strong></div><div class="cost__total"><span>Total payable</span><strong>${money(breakdown.total)}</strong></div>`;
}

function closeMenu() {
  const menu = document.querySelector('[data-mobile-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
}

function updateActiveNav() {
  document.querySelectorAll('[data-route]').forEach((link) => {
    const active = link.dataset.route === ui.route;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
}

function updateUserHeader() {
  const user = auth.getUser();
  const label = document.querySelector('[data-user-label]');
  const adminLink = document.querySelector('.header-admin');
  const accountLink = document.querySelector('.account-link');
  const authMenu = document.querySelector('[data-auth-menu]');
  const authDesktop = document.querySelector('[data-auth-menu-desktop]');
  if (label) label.textContent = user ? user.name : '';
  if (adminLink) {
    adminLink.textContent = user?.role === 'admin' ? 'Admin area' : 'Admin demo';
    adminLink.hidden = user?.role !== 'admin';
  }
  if (accountLink) {
    accountLink.href = user ? '#bookings' : '#auth';
    accountLink.dataset.route = user ? 'bookings' : 'auth';
    accountLink.setAttribute('aria-label', user ? `Open rentals for ${user.name}` : 'Sign in');
  }
  if (authMenu) {
    authMenu.textContent = user ? 'Sign out' : 'Sign in';
    authMenu.dataset.authAction = user ? 'signout' : '';
    authMenu.href = user ? '#home' : '#auth';
  }
  if (authDesktop) {
    authDesktop.textContent = user ? 'Sign out' : 'Sign in';
    authDesktop.dataset.authAction = user ? 'signout' : '';
    authDesktop.href = user ? '#home' : '#auth';
  }
}

function render({ focusMain = false } = {}) {
  app.innerHTML = views[ui.route]();
  updateWishlistCount();
  updateActiveNav();
  updateUserHeader();
  if (ui.route === 'product') {
    const product = store.get().products.find(({ id }) => id === ui.productId);
    if (product) detailCostBreakdown(product);
  }
  if (focusMain) app.focus({ preventScroll: true });
}

function applyTheme(preference) {
  const safePreference = ['light', 'dark', 'system'].includes(preference) ? preference : 'system';
  const resolved = safePreference === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : safePreference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = safePreference;
  localStorage.setItem('rentify_theme_v1', safePreference);
  document.querySelector('meta[name="theme-color"]').content = resolved === 'dark' ? '#101010' : '#FAFAF9';
  const toggle = document.querySelector('[data-theme-toggle]');
  toggle.setAttribute('aria-pressed', String(resolved === 'dark'));
  toggle.setAttribute('aria-label', `Color theme: ${safePreference}. Activate to switch theme`);
  toggle.title = `Theme: ${safePreference}`;
}

function syncHeaderSearch(query) {
  const input = document.querySelector('#headerSearch');
  if (input) input.value = query;
}

function navigate(route, { updateHash = true, focusMain = true } = {}) {
  if (protectedRoutes.has(route) && !auth.getUser()) {
    ui.authReturn = route;
    ui.authNotice = 'Sign in to continue to your RENTIFY account.';
    ui.route = 'auth';
  } else if (route === 'admin' && auth.getUser()?.role !== 'admin') {
    ui.authReturn = 'admin';
    ui.authNotice = 'The admin demo is available through the admin demo account.';
    ui.route = 'auth';
  } else if (route === 'onboarding' && auth.getUser()?.role === 'admin') {
    ui.route = 'admin';
  } else if (route === 'onboarding' && auth.isOnboardingComplete()) {
    ui.route = 'explore';
  } else {
    ui.route = routes.has(route) ? route : 'home';
  }
  closeModal();
  closeMenu();
  render({ focusMain });
  const nextHash = ui.route === 'product' ? `#product/${ui.productId}` : ui.route === 'booking-detail' ? `#booking-detail/${ui.bookingId}` : `#${ui.route}`;
  if (updateHash) history.pushState(null, '', nextHash);
  else if (route !== ui.route) history.replaceState(null, '', nextHash);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function routeFromHash() {
  const [route, value] = location.hash.slice(1).split('/');
  if (route === 'product') {
    const id = Number(value);
    if (store.get().products.some((product) => product.id === id)) {
      ui.productId = id;
      return 'product';
    }
  }
  if (route === 'booking-detail' && value) {
    ui.bookingId = value;
    return 'booking-detail';
  }
  return routes.has(route) ? route : 'home';
}

function toast(message) {
  const element = document.createElement('div');
  element.className = 'app-toast';
  element.textContent = message;
  toastRegion.replaceChildren(element);
  requestAnimationFrame(() => element.classList.add('is-visible'));
  window.setTimeout(() => {
    element.classList.remove('is-visible');
    window.setTimeout(() => element.remove(), 200);
  }, 2800);
}

function openModal(content) {
  ui.lastFocus = document.activeElement;
  modalRoot.innerHTML = `<div class="modal-backdrop" data-modal-backdrop><div class="app-modal" role="dialog" aria-modal="true" aria-label="RENTIFY dialog">${content}</div></div>`;
  document.body.classList.add('has-modal');
  modalRoot.querySelector('input, select, button')?.focus();
}

function closeModal() {
  if (!modalRoot.firstElementChild) return;
  modalRoot.replaceChildren();
  document.body.classList.remove('has-modal');
  ui.lastFocus?.focus?.();
}

function costBreakdown(product) {
  const start = document.querySelector('#rentalStart')?.value;
  const end = document.querySelector('#rentalEnd')?.value;
  const quantity = Number(document.querySelector('[data-booking-form] input[name="quantity"]')?.value || 1);
  const breakdown = calculateRental({ start, end, dailyRate: product.price, depositPerUnit: product.deposit, quantity });
  const output = document.querySelector('[data-cost]');
  if (!output) return;
  if (!breakdown.days) {
    output.innerHTML = '<p class="form-error">Return date must be on or after the start date.</p>';
    return;
  }
  output.innerHTML = `<div><span>${money(product.price)} × ${breakdown.days} day${breakdown.days > 1 ? 's' : ''} × ${breakdown.quantity} unit${breakdown.quantity > 1 ? 's' : ''}</span><strong>${money(breakdown.subtotal)}</strong></div><div><span>Refundable deposit × ${breakdown.quantity}</span><strong>${money(breakdown.deposit)}</strong></div><div class="cost__total"><span>Total due at pickup</span><strong>${money(breakdown.total)}</strong></div>`;
}

function bookingModal(product, initial = {}) {
  const date = today();
  openModal(`
    <div class="modal-header"><div><p class="eyebrow">Reservation request</p><h2>Reserve ${escapeHtml(product.name)}</h2></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Close dialog">${icons.close}</button></div>
    <img class="modal-product-image" src="${escapeHtml(product.image)}" alt="" width="760" height="320">
    <form data-booking-form data-id="${product.id}">
      <div class="form-grid"><label class="field"><span>Full name</span><input name="name" autocomplete="name" required maxlength="80" value="${escapeHtml(auth.getUser()?.name || '')}" placeholder="Your name"></label><label class="field"><span>Email address</span><input name="email" type="email" autocomplete="email" required value="${escapeHtml(auth.getUser()?.email || '')}" readonly></label></div>
      <div class="form-grid"><label class="field"><span>Start date</span><input id="rentalStart" name="start" type="date" min="${date}" value="${escapeHtml(initial.start || date)}" required data-date-input></label><label class="field"><span>Return date</span><input id="rentalEnd" name="end" type="date" min="${date}" value="${escapeHtml(initial.end || date)}" required data-date-input></label></div>
      <label class="field"><span>Quantity</span><input name="quantity" type="number" min="1" max="${Math.max(1, product.stock)}" step="1" value="${escapeHtml(initial.quantity || 1)}" required data-date-input><small class="form-note">${product.stock} unit${product.stock === 1 ? '' : 's'} available before date checks.</small></label>
      <div class="cost" data-cost></div>
      <button class="button button--full" type="submit" data-submit-button><span>Confirm demo booking</span>${icons.arrow}<span class="spinner" aria-hidden="true"></span></button>
      <p class="form-note">Demo only. No payment is collected.</p>
    </form>`);
  costBreakdown(product);
}

function productModal(product = null) {
  const editing = Boolean(product);
  openModal(`
    <div class="modal-header"><div><p class="eyebrow">Catalog</p><h2>${editing ? 'Edit' : 'Add'} equipment</h2></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Close dialog">${icons.close}</button></div>
    <form data-product-form data-id="${product?.id || ''}">
      <div class="form-grid"><label class="field"><span>Product name</span><input name="name" required maxlength="90" value="${escapeHtml(product?.name || '')}"></label><label class="field"><span>Brand</span><input name="brand" required maxlength="60" value="${escapeHtml(product?.brand || '')}"></label></div>
      <label class="field"><span>Description</span><textarea name="description" rows="3" maxlength="500" required>${escapeHtml(product?.description || '')}</textarea></label>
      <label class="field"><span>Image URL</span><input name="image" type="url" required value="${escapeHtml(product?.image || '')}" placeholder="https://images.unsplash.com/..."><small class="form-note">Use a direct image URL. The image appears on the storefront product card.</small></label>
      <div class="form-grid"><label class="field"><span>Category</span><select name="category">${categories.slice(1).map((category) => `<option value="${category.value}"${product?.category === category.value ? ' selected' : ''}>${category.label}</option>`).join('')}</select></label><label class="field"><span>Condition</span><select name="condition">${['Excellent', 'Very good', 'Good', 'Fair'].map((condition) => `<option${product?.condition === condition ? ' selected' : ''}>${condition}</option>`).join('')}</select></label></div>
      <div class="form-grid"><label class="field"><span>Daily price (₹)</span><input name="price" type="number" min="1" step="1" required value="${product?.price || ''}"></label><label class="field"><span>Deposit (₹)</span><input name="deposit" type="number" min="0" step="1" required value="${product?.deposit ?? ''}"></label><label class="field"><span>Stock quantity</span><input name="stock" type="number" min="0" max="999" step="1" required value="${product?.stock ?? 1}"></label></div>
      <div class="form-grid"><label class="field"><span>Included accessories</span><textarea name="included" rows="4" placeholder="One item per line">${escapeHtml((product?.included || []).join('\n'))}</textarea></label><label class="field"><span>Specifications</span><textarea name="specifications" rows="4" placeholder="Label: Value">${escapeHtml((product?.specifications || []).map((item) => `${item.label}: ${item.value}`).join('\n'))}</textarea></label></div>
      <button class="button button--full" type="submit">Save equipment ${icons.arrow}</button>
    </form>`);
}

function reviewModal(booking, review = null) {
  const product = bookingProduct(booking);
  openModal(`<div class="modal-header"><div><p class="eyebrow">Demo review</p><h2>${review ? 'Edit' : 'Review'} ${escapeHtml(product?.name || 'your rental')}</h2></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Close dialog">${icons.close}</button></div><form data-review-form data-booking-id="${booking.id}"><label class="field"><span>Rating</span><select name="rating" required>${[5, 4, 3, 2, 1].map((rating) => `<option value="${rating}"${Number(review?.rating || 5) === rating ? ' selected' : ''}>${rating} out of 5</option>`).join('')}</select></label><label class="field"><span>Your feedback</span><textarea name="text" rows="5" maxlength="500" required placeholder="What made this rental useful?">${escapeHtml(review?.text || '')}</textarea><small class="field-error" data-review-error aria-live="polite"></small></label><button class="button button--full" type="submit">${review ? 'Save changes' : 'Publish demo review'} ${icons.arrow}</button><p class="form-note">Demo review only. It is visible in this browser.</p></form>`);
}

function cancelBookingModal(booking) {
  const product = bookingProduct(booking);
  openModal(`<div class="modal-header"><div><p class="eyebrow">Cancel request</p><h2>Cancel ${escapeHtml(product?.name || 'this rental')}?</h2></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Close dialog">${icons.close}</button></div><p class="modal-copy">This demo request will move to your cancelled bookings. No payment or real reservation is affected.</p><div class="modal-actions"><button class="button button--secondary" type="button" data-action="close-modal">Keep request</button><button class="button button--danger" type="button" data-action="confirm-cancel" data-id="${booking.id}">Cancel request</button></div>`);
}

function confirmAction(title, copy, action, id = '') {
  openModal(`<div class="modal-header"><div><p class="eyebrow">Please confirm</p><h2>${escapeHtml(title)}</h2></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Close dialog">${icons.close}</button></div><p class="modal-copy">${escapeHtml(copy)}</p><div class="modal-actions"><button class="button button--secondary" type="button" data-action="close-modal">Keep it</button><button class="button button--danger" type="button" data-action="${action}" data-id="${id}">Confirm</button></div>`);
}

function updateCatalog() {
  const products = filteredProducts();
  const results = document.querySelector('[data-product-results]');
  if (!results) return;
  results.innerHTML = productGrid(products);
  document.querySelector('[data-result-count]').textContent = `${products.length} items`;
  const priceValue = document.querySelector('[data-price-value]');
  if (priceValue) priceValue.textContent = money(ui.maxPrice);
}

document.addEventListener('click', (event) => {
  const authAction = event.target.closest('[data-auth-action]');
  if (authAction) {
    event.preventDefault();
    if (authAction.dataset.authAction === 'signout' || authAction.dataset.authAction === 'signout-admin') {
      auth.signOut();
      ui.authNotice = 'You have been signed out of the demo account.';
      navigate('home');
      toast('Signed out');
    } else if (authAction.dataset.authAction === 'toggle-mode') {
      ui.authMode = ui.authMode === 'signin' ? 'register' : 'signin';
      ui.authNotice = '';
      render({ focusMain: true });
    } else if (authAction.dataset.authAction === 'forgot') {
      toast('Demo reset link sent. Check is simulated in this browser.');
    }
    return;
  }

  const demoLogin = event.target.closest('[data-demo-login]');
  if (demoLogin) {
    const credentials = auth.demoCredentials.find(({ role }) => role === demoLogin.dataset.demoLogin);
    if (document.querySelector('[data-auth-form]')?.dataset.mode !== 'signin') {
      ui.authMode = 'signin';
      render();
    }
    const form = document.querySelector('[data-auth-form]');
    if (credentials && form) {
      form.elements.email.value = credentials.email;
      form.elements.password.value = credentials.password;
      form.elements.email.focus();
      toast('Demo credentials filled. Submit to continue.');
    }
    return;
  }

  const onboardingNext = event.target.closest('[data-onboarding-next]');
  if (onboardingNext) {
    document.querySelector('[data-onboarding-step="welcome"]').hidden = true;
    document.querySelector('[data-onboarding-step="preferences"]').hidden = false;
    document.querySelector('.onboarding-progress span:nth-child(2)')?.classList.add('is-active');
    return;
  }
  const onboardingSkip = event.target.closest('[data-onboarding-skip]');
  if (onboardingSkip) {
    auth.completeOnboarding([]);
    navigate('explore');
    toast('Onboarding skipped. You can start exploring.');
    return;
  }
  const onboardingComplete = event.target.closest('[data-onboarding-complete]');
  if (onboardingComplete) {
    const preferences = [...document.querySelectorAll('.preference-option input:checked')].map((input) => input.value);
    auth.completeOnboarding(preferences);
    document.querySelector('[data-onboarding-step="preferences"]').hidden = true;
    document.querySelector('[data-onboarding-step="complete"]').hidden = false;
    document.querySelector('.onboarding-progress span:nth-child(3)')?.classList.add('is-active');
    return;
  }
  if (event.target.closest('[data-onboarding-explore]')) {
    navigate('explore');
    return;
  }

  const routeLink = event.target.closest('[data-route]');
  if (routeLink) {
    event.preventDefault();
    navigate(routeLink.dataset.route);
    return;
  }

  const adminTab = event.target.closest('[data-admin-tab]');
  if (adminTab) {
    ui.adminTab = adminTab.dataset.adminTab;
    ui.adminQuery = '';
    ui.adminStatus = 'All';
    ui.adminCategory = 'All';
    render();
    return;
  }

  const productLink = event.target.closest('[data-product-link]');
  if (productLink) {
    event.preventDefault();
    ui.productId = Number(productLink.dataset.productLink);
    navigate('product');
    return;
  }

  const scrollLink = event.target.closest('[data-scroll]');
  if (scrollLink) {
    event.preventDefault();
    const targetId = scrollLink.dataset.scroll;
    if (ui.route !== 'home') navigate('home', { focusMain: false });
    requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' }));
    return;
  }

  const category = event.target.closest('[data-category]');
  if (category) {
    ui.filter = category.dataset.category;
    navigate('explore');
    return;
  }

  const action = event.target.closest('[data-action]');
  if (!action) return;
  const id = action.dataset.id?.startsWith('booking-') ? action.dataset.id : Number(action.dataset.id);

  if (action.dataset.action === 'wishlist') {
    if (!auth.getUser()) {
      ui.authReturn = 'explore';
      ui.authNotice = 'Sign in to save a wishlist.';
      navigate('auth');
      return;
    }
    customerStore.toggleWishlist(id);
    render();
    toast('Wishlist updated');
  }
  if (action.dataset.action === 'book') {
    const product = store.get().products.find((item) => item.id === id);
    if (product && !auth.getUser()) {
      ui.authReturn = 'product';
      ui.productId = id;
      ui.authNotice = 'Sign in to reserve this item.';
      navigate('auth');
    } else if (product) bookingModal(product, {
      start: document.querySelector('[data-detail-start]')?.value,
      end: document.querySelector('[data-detail-end]')?.value,
      quantity: document.querySelector('[data-detail-quantity]')?.value,
    });
  }
  if (action.dataset.action === 'reset-filters') {
    ui.filter = 'All';
    ui.sort = 'featured';
    ui.query = '';
    ui.maxPrice = 1200;
    ui.availability = 'all';
    render();
    syncHeaderSearch('');
    toast('Filters reset');
  }
  if (action.dataset.action === 'booking-tab') {
    ui.bookingTab = action.dataset.tab;
    render();
  }
  if (action.dataset.action === 'cancel-booking') {
    const booking = customerBookings().find((item) => String(item.id) === String(id) && ['Pending', 'Approved'].includes(item.status));
    if (booking) cancelBookingModal(booking);
  }
  if (action.dataset.action === 'confirm-cancel') {
    const booking = customerBookings().find((item) => String(item.id) === String(id) && ['Pending', 'Approved'].includes(item.status));
    if (booking) {
      store.update((state) => {
        const record = state.bookings.find((item) => String(item.id) === String(id));
        if (record) record.status = 'Cancelled';
      });
      customerStore.addNotification({ type: 'booking', title: 'Booking cancelled', message: `${bookingProduct(booking)?.name || 'Your rental'} was cancelled.` });
      closeModal();
      render();
      toast('Booking cancelled');
    }
  }
  if (action.dataset.action === 'review') {
    const booking = customerBookings().find((item) => String(item.id) === String(id) && bookingBucket(item) === 'completed');
    if (booking) reviewModal(booking);
  }
  if (action.dataset.action === 'edit-review') {
    const booking = customerBookings().find((item) => String(item.id) === String(id));
    const review = booking && customerStore.getReview(id);
    if (booking && review) reviewModal(booking, review);
  }
  if (action.dataset.action === 'delete-review') {
    customerStore.deleteReview(id);
    render();
    toast('Review removed');
  }
  if (action.dataset.action === 'read-notification') {
    customerStore.markNotificationRead(id);
    render();
  }
  if (action.dataset.action === 'read-all-notifications') {
    customerStore.markAllNotificationsRead();
    render();
    toast('Notifications marked as read');
  }
  if (action.dataset.action === 'theme-setting') {
    const current = document.documentElement.dataset.themePreference || 'system';
    applyTheme(current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light');
    toast(`Theme set to ${document.documentElement.dataset.themePreference}`);
  }
  if (action.dataset.action === 'booking-detail-admin') {
    const booking = store.get().bookings.find((item) => item.id === id);
    const product = bookingProduct(booking);
    if (booking) openModal(`<div class="modal-header"><div><p class="eyebrow">Booking detail</p><h2>${escapeHtml(product?.name || 'Rental booking')}</h2></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Close dialog">${icons.close}</button></div><dl class="admin-detail-list"><div><dt>Customer</dt><dd>${escapeHtml(booking.name)} · ${escapeHtml(booking.email)}</dd></div><div><dt>Dates</dt><dd>${escapeHtml(booking.start)} → ${escapeHtml(booking.end)}</dd></div><div><dt>Status</dt><dd>${escapeHtml(booking.status)}</dd></div><div><dt>Total</dt><dd>${money(booking.total)}</dd></div><div><dt>Deposit</dt><dd>${money(product?.deposit || 0)}</dd></div></dl>`);
  }
  if (action.dataset.action === 'customer-detail') {
    const customer = auth.getAccounts().find((account) => account.id === action.dataset.id);
    const bookings = store.get().bookings.filter((booking) => booking.userId === customer?.id || (!booking.userId && booking.email === customer?.email));
    if (customer) openModal(`<div class="modal-header"><div><p class="eyebrow">Customer profile</p><h2>${escapeHtml(customer.name)}</h2></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Close dialog">${icons.close}</button></div><p class="muted-copy">${escapeHtml(customer.email)}</p><h3>Booking history</h3>${bookings.length ? bookings.map((booking) => `<div class="admin-activity"><span class="activity-dot"></span><div><strong>${escapeHtml(booking.start)} · ${escapeHtml(booking.status)}</strong><small>${escapeHtml(bookingProduct(booking)?.name || 'Removed product')} · ${money(booking.total)}</small></div></div>`).join('') : '<p class="muted-copy">No bookings yet.</p>'}`);
  }
  if (action.dataset.action === 'toggle-customer') {
    const active = action.dataset.active === 'true';
    if (auth.setAccountActive(action.dataset.id, active)) {
      render();
      toast(active ? 'Customer activated' : 'Customer deactivated');
    }
  }
  if (action.dataset.action === 'toggle-review') {
    customerStore.setReviewHidden(id, action.dataset.hidden === 'true');
    render();
    toast(action.dataset.hidden === 'true' ? 'Review hidden' : 'Review restored');
  }
  if (action.dataset.action === 'remove-blocked-date') {
    adminStore.removeBlockedDate(id);
    render();
    toast('Blocked dates removed');
  }
  if (action.dataset.action === 'close-modal') closeModal();
  if (action.dataset.action === 'status') {
    const previous = store.get().bookings.find((item) => item.id === id);
    if (!previous || !canTransition(previous.status, action.dataset.status) || !adminBookingStatus(previous).includes(action.dataset.status)) {
      return toast('That booking status transition is not available');
    }
    store.update((state) => {
      const booking = state.bookings.find((item) => item.id === id);
      if (booking) booking.status = action.dataset.status;
    });
    if (previous?.userId) {
      const status = action.dataset.status;
      const labels = { Approved: 'Booking approved', Rejected: 'Booking rejected', Completed: 'Rental completed' };
      customerStore.addNotificationForUser(previous.userId, { type: 'booking', title: labels[status] || `Booking ${status.toLowerCase()}`, message: `${bookingProduct(previous)?.name || 'Your rental'} status is now ${status}.` });
      if (status === 'Completed') customerStore.addNotificationForUser(previous.userId, { type: 'review', title: 'Share your rental feedback', message: `Your review for ${bookingProduct(previous)?.name || 'your rental'} is ready.` });
    }
    render();
    toast(`Booking marked ${action.dataset.status.toLowerCase()}`);
  }
  if (action.dataset.action === 'product-form') {
    productModal(id ? store.get().products.find((item) => item.id === id) : null);
  }
  if (action.dataset.action === 'delete-product') {
    const active = store.get().bookings.some((booking) => booking.productId === id && ['Pending', 'Approved'].includes(booking.status));
    if (active) return toast('Resolve active requests before removing this item');
    if (action.closest('[data-modal-backdrop]')) {
      store.update((state) => { state.products = state.products.filter((item) => item.id !== id); state.wishlist = state.wishlist.filter((savedId) => savedId !== id); });
      closeModal();
      render();
      toast('Equipment archived');
    } else confirmAction('Archive this product?', 'It will disappear from the storefront and remain absent after refresh.', 'delete-product', id);
  }
  if (action.dataset.action === 'reset') {
    if (action.closest('[data-modal-backdrop]')) {
      store.reset();
      adminStore.reset();
      customerStore.reset();
      closeModal();
      render();
      toast('Demo marketplace reset');
    } else confirmAction('Reset the demo marketplace?', 'Products, bookings, inventory blocks and local admin settings will be reset.', 'reset');
  }
});

document.addEventListener('input', (event) => {
  if (event.target.matches('[data-admin-search]')) {
    ui.adminQuery = event.target.value;
    render();
  }
  if (event.target.matches('[data-search]')) {
    ui.query = event.target.value;
    syncHeaderSearch(ui.query);
    updateCatalog();
  }
  if (event.target.matches('[data-auth-form] input[name="password"]')) {
    const strength = document.querySelector('[data-password-strength]');
    if (strength) {
      const value = event.target.value;
      const score = [value.length >= 8, /[A-Z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
      strength.textContent = score < 2 ? 'Password strength: add length or numbers' : score < 4 ? 'Password strength: good' : 'Password strength: strong';
      strength.dataset.level = score < 2 ? 'weak' : score < 4 ? 'good' : 'strong';
    }
  }
});

document.addEventListener('submit', (event) => {
  if (!event.target.matches('[data-header-search]')) return;
  event.preventDefault();
  ui.query = String(new FormData(event.target).get('q') || '').trim();
  navigate('explore');
});

document.addEventListener('change', (event) => {
  if (event.target.matches('[data-admin-category]')) { ui.adminCategory = event.target.value; render(); }
  if (event.target.matches('[data-admin-status]')) { ui.adminStatus = event.target.value; render(); }
  if (event.target.matches('[data-admin-rating]')) {
    const rating = event.target.value;
    document.querySelectorAll('.admin-review').forEach((review) => { review.hidden = rating !== 'All' && !review.querySelector('.review-stars')?.textContent.startsWith('★'.repeat(Number(rating))); });
  }
  if (event.target.matches('[data-notification-setting]')) {
    customerStore.saveProfile({ notifications: event.target.checked });
    toast(event.target.checked ? 'Rental updates enabled' : 'Rental updates paused');
  }
  if (event.target.matches('[data-filter]')) { ui.filter = event.target.value; updateCatalog(); }
  if (event.target.matches('[data-sort]')) { ui.sort = event.target.value; updateCatalog(); }
  if (event.target.matches('[data-availability]')) { ui.availability = event.target.checked ? 'available' : 'all'; updateCatalog(); }
  if (event.target.matches('[data-price-range]')) { ui.maxPrice = Number(event.target.value); updateCatalog(); }
  if (event.target.matches('[data-gallery-image]')) {
    document.querySelector('[data-detail-image]').src = event.target.dataset.galleryImage;
    document.querySelectorAll('[data-gallery-image]').forEach((thumb) => thumb.classList.toggle('is-active', thumb === event.target));
  }
  if (event.target.matches('[data-date-input]')) {
    const start = document.querySelector('#rentalStart');
    const end = document.querySelector('#rentalEnd');
    end.min = start.value || today();
    const product = store.get().products.find((item) => item.id === Number(document.querySelector('[data-booking-form]')?.dataset.id));
    if (product) costBreakdown(product);
  }
  if (event.target.matches('[data-detail-date]')) {
    const start = document.querySelector('[data-detail-start]');
    const end = document.querySelector('[data-detail-end]');
    end.min = start.value || today();
    const product = store.get().products.find(({ id }) => id === ui.productId);
    if (product) detailCostBreakdown(product);
  }
});

document.addEventListener('submit', (event) => {
  if (event.target.matches('[data-auth-form]')) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const mode = form.dataset.mode;
    const values = Object.fromEntries(data.entries());
    const errors = {};
    if (mode === 'register' && String(values.name || '').trim().length < 2) errors.name = 'Enter your name.';
    if (mode === 'register' && !/^\d{10}$/.test(String(values.phone || ''))) errors.phone = 'Enter a valid 10-digit phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email || ''))) errors.email = 'Enter a valid email address.';
    if (String(values.password || '').length < 8) errors.password = 'Use at least 8 characters.';
    if (mode === 'register' && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(String(values.password || ''))) errors.password = 'Use uppercase, lowercase, a number, and a symbol.';
    if (mode === 'register' && values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    form.querySelectorAll('[data-error-for]').forEach((item) => {
      item.textContent = errors[item.dataset.errorFor] || '';
      item.closest('.field')?.classList.toggle('has-error', Boolean(errors[item.dataset.errorFor]));
      item.closest('.field')?.querySelector('input')?.setAttribute('aria-invalid', String(Boolean(errors[item.dataset.errorFor])));
    });
    if (Object.keys(errors).length) return;
    const result = mode === 'register'
      ? auth.register(values.name, values.email, values.password, values.remember === 'on', values.phone)
      : auth.signIn(values.email, values.password, values.remember === 'on');
    if (!result.ok) {
      const emailError = form.querySelector('[data-error-for="email"]');
      emailError.textContent = result.error;
      emailError.closest('.field')?.classList.add('has-error');
      emailError.closest('.field')?.querySelector('input')?.setAttribute('aria-invalid', 'true');
      return;
    }
    const destination = result.user.role === 'admin' ? 'admin' : mode === 'register' || !auth.isOnboardingComplete() ? 'onboarding' : (ui.authReturn || 'explore');
    ui.authReturn = null;
    ui.authNotice = '';
    navigate(destination);
    toast(mode === 'register' ? 'Account created' : 'Welcome back');
    return;
  }
  if (event.target.matches('[data-booking-form]')) {
    event.preventDefault();
    const form = event.target;
    if (form.dataset.submitting === 'true') return;
    const formData = new FormData(form);
    const productId = Number(form.dataset.id);
    const product = store.get().products.find(({ id }) => id === productId);
    const start = String(formData.get('start'));
    const end = String(formData.get('end'));
    const quantity = Number(formData.get('quantity'));
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast('Enter a valid name and email address');
    const availability = checkAvailability({ product, bookings: store.get().bookings, blockedDates: adminStore.getBlockedDates(), start, end, quantity, today: today() });
    const breakdown = product && calculateRental({ start, end, dailyRate: product.price, depositPerUnit: product.deposit, quantity });
    if (!product || !availability.ok || !breakdown?.days) return toast(availability.errors[0] || 'Choose a valid rental date range');

    const button = form.querySelector('[data-submit-button]');
    form.dataset.submitting = 'true';
    button.disabled = true;
    button.classList.add('is-loading');
    window.setTimeout(() => {
      const latestAvailability = checkAvailability({ product: store.get().products.find(({ id }) => id === productId), bookings: store.get().bookings, blockedDates: adminStore.getBlockedDates(), start, end, quantity, today: today() });
      if (!latestAvailability.ok) {
        button.disabled = false;
        button.classList.remove('is-loading');
        return toast(latestAvailability.errors[0]);
      }
      const latestProduct = store.get().products.find(({ id }) => id === productId);
      const latestBreakdown = calculateRental({ start, end, dailyRate: latestProduct.price, depositPerUnit: latestProduct.deposit, quantity });
      const booking = { id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, productId, userId: auth.getUser()?.id, name, email, start, end, quantity, subtotal: latestBreakdown.subtotal, deposit: latestBreakdown.deposit, total: latestBreakdown.total, rentalDays: latestBreakdown.days, status: 'Pending' };
      store.update((state) => {
        if (!state.bookings.some((item) => item.id === booking.id)) state.bookings.push(booking);
      });
      customerStore.addNotification({ type: 'booking', title: 'Booking request placed', message: `${product.name} is waiting for demo approval.` });
      closeModal();
      navigate('bookings');
      toast('Booking request placed');
    }, 450);
  }

  if (event.target.matches('[data-product-form]')) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const id = Number(form.dataset.id) || Date.now();
    const name = String(formData.get('name') || '').trim();
    const brand = String(formData.get('brand') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const image = String(formData.get('image') || '').trim();
    const price = Number(formData.get('price'));
    const deposit = Number(formData.get('deposit'));
    const stock = Number(formData.get('stock'));
    let imageUrl;
    try { imageUrl = new URL(image); } catch (_) { imageUrl = null; }
    const duplicate = store.get().products.some((item) => item.id !== id && item.name.trim().toLowerCase() === name.toLowerCase());
    if (name.length < 2 || brand.length < 2 || description.length < 10 || !imageUrl || !['http:', 'https:'].includes(imageUrl.protocol) || duplicate || !Number.isFinite(price) || price < 1 || !Number.isFinite(deposit) || deposit < 0 || !Number.isInteger(stock) || stock < 0) return toast(duplicate ? 'A product with that name already exists' : 'Check the required product fields');
    if (stock < maxHeldQuantity(id)) return toast(`Stock cannot be lower than ${maxHeldQuantity(id)} units already reserved`);
    const specifications = String(formData.get('specifications') || '').split('\n').map((line) => line.split(':')).filter((parts) => parts.length > 1 && parts[0].trim() && parts.slice(1).join(':').trim()).map((parts) => ({ label: parts[0].trim(), value: parts.slice(1).join(':').trim() }));
    const existing = store.get().products.find((item) => item.id === id);
    const product = { id, name, brand, description, image, category: String(formData.get('category')), condition: String(formData.get('condition')), price, deposit, stock, specifications, included: String(formData.get('included') || '').split('\n').map((item) => item.trim()).filter(Boolean), tag: 'Available', rating: existing?.rating || 0, reviews: existing?.reviews || 0 };
    store.update((state) => {
      const index = state.products.findIndex((item) => item.id === id);
      if (index >= 0) state.products[index] = product; else state.products.push(product);
    });
    closeModal();
    render();
    toast('Equipment saved');
  }
  if (event.target.matches('[data-review-form]')) {
    event.preventDefault();
    const form = event.target;
    const text = String(new FormData(form).get('text') || '').trim();
    const error = form.querySelector('[data-review-error]');
    if (text.length < 10) {
      error.textContent = 'Write at least 10 characters so the feedback is useful.';
      return;
    }
    const bookingId = form.dataset.bookingId;
    const booking = customerBookings().find((item) => String(item.id) === String(bookingId));
    const rating = Number(new FormData(form).get('rating'));
    if (!booking || booking.status !== 'Completed' || !Number.isInteger(rating) || rating < 1 || rating > 5) return toast('Reviews are available after a completed rental.');
    customerStore.saveReview({ bookingId, rating, text });
    closeModal();
    render();
    toast('Review saved');
  }
  if (event.target.matches('[data-profile-form]')) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.target).entries());
    if (String(values.name || '').trim().length < 2) return toast('Enter a name with at least two characters');
    customerStore.saveProfile({ name: String(values.name).trim(), phone: String(values.phone || '').trim(), city: String(values.city || '').trim() });
    render();
    toast('Profile saved');
  }
  if (event.target.matches('[data-inventory-form]')) {
    event.preventDefault();
    const form = event.target;
    const stock = Number(new FormData(form).get('stock'));
    if (!Number.isInteger(stock) || stock < 0) return toast('Enter a valid stock quantity');
    if (stock < maxHeldQuantity(Number(form.dataset.id))) return toast(`Stock cannot be lower than ${maxHeldQuantity(Number(form.dataset.id))} units already reserved`);
    store.update((state) => {
      const product = state.products.find((item) => item.id === Number(form.dataset.id));
      if (product) product.stock = stock;
    });
    render();
    toast('Inventory updated');
  }
  if (event.target.matches('[data-blocked-date-form]')) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.target).entries());
    if (values.end < values.start) return toast('End date must be on or after start date');
    if (adminStore.addBlockedDate(values)) {
      render();
      toast('Maintenance dates blocked');
    }
  }
  if (event.target.matches('[data-admin-profile-form]')) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.target).entries());
    const name = String(values.name || '').trim();
    if (name.length < 2) return toast('Enter a valid admin name');
    auth.updateAccountName(auth.getUser()?.id, name);
    render();
    toast('Admin profile saved');
  }
});

document.querySelector('[data-theme-toggle]').addEventListener('click', () => {
  const current = document.documentElement.dataset.themePreference || 'system';
  const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
  applyTheme(next);
});

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
systemTheme.addEventListener?.('change', () => {
  if ((document.documentElement.dataset.themePreference || 'system') === 'system') applyTheme('system');
});

document.querySelector('[data-menu-toggle]').addEventListener('click', (event) => {
  const menu = document.querySelector('[data-mobile-menu]');
  const open = menu.hidden;
  menu.hidden = !open;
  event.currentTarget.setAttribute('aria-expanded', String(open));
  event.currentTarget.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

modalRoot.addEventListener('click', (event) => {
  if (event.target.matches('[data-modal-backdrop]')) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
  if (event.key === 'Tab' && modalRoot.firstElementChild) {
    const focusable = [...modalRoot.querySelectorAll('button:not([disabled]), input, select, a[href]')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

document.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-password-toggle]');
  if (!toggle) return;
  const input = toggle.closest('.password-control')?.querySelector('input');
  if (!input) return;
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  toggle.textContent = visible ? 'Show' : 'Hide';
  toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
});

document.addEventListener('error', (event) => {
  if (event.target.matches?.('[data-image-fallback]')) {
    event.target.src = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80';
  }
}, true);

window.addEventListener('popstate', () => {
  navigate(routeFromHash(), { updateHash: false });
});

window.addEventListener('hashchange', () => {
  navigate(routeFromHash(), { updateHash: false });
});

applyTheme(localStorage.getItem('rentify_theme_v1') || 'system');
ui.route = routeFromHash();
if (protectedRoutes.has(ui.route) && !auth.getUser()) {
  ui.authReturn = ui.route;
  ui.authNotice = 'Sign in to continue to your RENTIFY account.';
  ui.route = 'auth';
}
if (ui.route === 'onboarding' && auth.isOnboardingComplete()) {
  ui.route = 'explore';
  history.replaceState(null, '', '#explore');
}
render();
syncHeaderSearch(ui.query);
