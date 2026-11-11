# RENTIFY — Rental Marketplace Platform

**Student:** Manish Sharma
**Enrollment number:** 92500120114
**University:** Marwadi University
**Subject:** 01CE1306 - Web Technology

## Project definition

RENTIFY is a responsive web-based rental marketplace for borrowing cameras, gaming equipment, laptops, bikes, audio equipment, projectors, party equipment, and outdoor gear. It includes a customer storefront/account experience and a merchant-style admin workspace.

This is a browser-local academic Web Technology project. It demonstrates marketplace UX, validation, availability rules, role-aware navigation, CRUD interfaces, and persistence without a production backend.

## Abstract

RENTIFY makes short-term access to useful equipment easier than ownership. Customers can discover products, compare rental prices, choose inclusive calendar dates and quantities, submit rental requests, manage their bookings, save wishlist items, and review completed rentals. Administrators can manage catalog data, booking status, customer access, inventory, maintenance blocks, reviews, and stored-data analytics.

## Objectives

- Build a polished, responsive rental marketplace using standard web technologies.
- Demonstrate semantic HTML, reusable CSS design tokens, and modular ES modules.
- Provide separate customer and admin workflows with frontend demo guards.
- Implement local availability validation, inclusive rental pricing, and stock-aware reservations.
- Persist demo data safely in browser localStorage with defensive parsing.
- Provide accessible forms, dialogs, navigation, focus states, reduced-motion support, and responsive layouts.

## Technology stack

- HTML5 semantic markup
- CSS3 custom properties, Grid, Flexbox, responsive media queries, and reduced-motion rules
- Bootstrap 5.3.3 CDN for responsive/table primitives and familiar utility components
- Tailwind CSS CDN with the `tw-` prefix and preflight disabled
- Vanilla JavaScript ES6 modules
- Browser localStorage/sessionStorage
- Unsplash remote product photography and Google Fonts

Bootstrap and Tailwind coexist without reset conflicts: Tailwind is configured with the `tw-` prefix and `corePlugins.preflight: false`, so it does not overwrite the project’s Bootstrap or custom CSS baseline. The primary visual system is maintained in `assets/css/styles.css`; Tailwind is used only for explicitly prefixed utilities.

No React, Vue, Angular, TypeScript, Node backend, database, API server, or build step is required.

## Features

- Editorial homepage with category tiles, collections, trending products, trust content, FAQ, and responsive navigation.
- Catalog with 24 seeded products across eight rental categories.
- Search by product name, description, and category.
- Category, price, availability, and sort controls.
- Product galleries, specifications, included accessories, reviews, and related products.
- Inclusive calendar-day rental calculation: `end date - start date + 1`.
- Quantity-aware subtotal, refundable deposit, and total payable in INR.
- Stock-aware overlap validation and admin maintenance blocks.
- Pending requests use a conservative inventory hold policy.
- Cancelled and rejected bookings release held inventory.
- Frontend-only demo authentication, registration, sessions, onboarding, and account activation.
- Customer dashboard, bookings, booking details, wishlist, reviews, profile, preferences, and notifications.
- Admin overview, product CRUD, booking workflow, customer controls, availability, review moderation, analytics, and settings.
- Light, dark, and system theme persistence with no-flash initialization.
- Escaped user content before HTML rendering, inline validation, loading states, toasts, accessible dialogs, focus indicators, and reduced-motion support.

## Customer module

Customers can:

1. Register or use the seeded customer demo.
2. Complete or skip onboarding and save preferred categories.
3. Browse, search, filter, sort, save wishlist items, and open product details.
4. Choose start date, end date, and quantity.
5. View rental days, subtotal, refundable deposit, and total payable.
6. Submit a browser-local booking request.
7. View booking status and timeline.
8. Cancel pending or approved demo bookings where permitted.
9. Review only their own completed bookings, once per booking.
10. Update profile details, theme preference, notification preference, and sign out.

## Admin module

The admin demo provides:

- Overview metrics and booking trend visualization from stored data.
- Product search, category filtering, add, edit, validation, and archive.
- Booking search, status filtering, detail views, and legal status transitions:
  - Requested/Pending → Approved, Rejected, or Cancelled
  - Approved → Active or Cancelled
  - Active → Completed or Cancelled
- Customer search, profile/booking history, and activate/deactivate controls.
- Inventory quantity editing and blocked maintenance date ranges.
- Review filtering and hide/restore moderation.
- Category distribution, popular products, booking trends, and revenue estimates.
- Admin profile, theme preferences, demo reset, and limitations information.

## Folder structure

```text
RENTIFY/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       ├── auth.js
│       ├── adminStore.js
│       ├── bookingRules.js
│       ├── customerStore.js
│       ├── data.js
│       ├── store.js
│       └── utils.js
├── tests/
│   ├── README.md
│   └── booking-rules.test.mjs
└── .gitignore
```

## How to run

### Option 1: open directly

Open `index.html` in a modern browser. ES modules work most reliably when served over HTTP.

### Option 2: local server

From the extracted project folder:

```bash
python3 -m http.server 3000
```

Open <http://localhost:3000>.

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Customer | `customer@rentify.demo` | `rentify123` |
| Admin | `admin@rentify.demo` | `admin1234` |

These are demonstration credentials only. Do not use real personal passwords.

The seeded demo workspace also includes `priya@rentify.demo` / `priya1234` and
`arjun@rentify.demo` / `arjun1234` for customer-ownership and admin customer
management demonstrations. A fresh browser state includes twelve clearly
marked demo bookings: seven records populate each day of the admin trend chart,
while the remaining records cover Pending, Approved, Active, Completed,
Rejected, and Cancelled statuses. It also includes one completed demo review,
notifications, and a demo maintenance window. User-created local records are
preserved and the seeded records are restored by the demo reset action.

## Data persistence

| Data | Storage key |
|---|---|
| Marketplace products, bookings, legacy wishlist | `rentify_marketplace_v2` |
| Demo accounts and sessions | `rentify_accounts_v1`, `rentify_session_v1` |
| Onboarding | `rentify_onboarding_v1` |
| Customer profiles, wishlists, reviews, notifications | `rentify_customer_data_v1` |
| Admin blocked dates and settings | `rentify_admin_data_v1` |
| Theme preference | `rentify_theme_v1` |

The admin Settings screen provides a demo reset. Browser storage is isolated to the current browser profile and is not shared between users or devices.

## Known limitations

- This is not production authentication or authorization; route guards are frontend UX demonstrations.
- There is no backend, database, payment gateway, email delivery, real notification service, or multi-user synchronization.
- Availability is browser-local simulated availability, not real-time inventory locking.
- Product photos, fonts, Bootstrap, and Tailwind load from CDNs and require network access.
- Demo review content and seeded ratings are illustrative.
- LocalStorage can be edited by the user and must not be trusted for real security or business enforcement.

## Requirement and QA summary

| Area | Status | Evidence |
|---|---|---|
| Homepage navigation and responsive layout | PASS | Browser route and mobile navigation sweep |
| Catalog search, category filter, price filter, availability, sorting | PASS | 24 products; camera search returned 6, category filter returned 5 |
| Product details and booking price breakdown | PASS | Browser verified inclusive days, quantity, subtotal, deposit, total |
| Registration, login, logout, onboarding | PASS | Clean-browser demo login, invalid password, registration, onboarding skip |
| Booking validation and persistence | PASS | `tests/booking-rules.test.mjs`; browser invalid-date feedback and refresh checks |
| Overlap, stock capacity, maintenance blocks, hold policy | PASS | Five automated business-rule tests and documented policy |
| Wishlist, customer profile, reviews, notifications | PASS | Implemented and route/ownership checks completed; completed-review fixture requires admin transition |
| Admin product CRUD and booking controls | PASS | Admin tabs and controls verified; legal transition rules unit-tested |
| Customer management, inventory, moderation, analytics, settings | PASS | All admin sections rendered and browser smoke-tested |
| Theme switching and reduced motion | PASS | Light/dark/system persistence and CSS media rule verified |
| Accessibility foundations | PASS | Semantic landmarks, skip link, labels, focus styles, modal Escape handling, reduced motion |
| Automated browser axe scan | NOT TESTED | No axe runner was available in the provided browser tooling |
| Screen-reader announcement test with assistive technology | NOT TESTED | Manual assistive technology was not available in this environment |
| Production security, backend authorization, real-time inventory | NOT APPLICABLE | Explicitly outside this frontend-only academic scope |

## Testing summary

Run the business-logic suite from the project root:

```bash
node --test tests/booking-rules.test.mjs
```

Latest result: **5 tests passed, 0 failed**.

Additional validation performed:

- JavaScript syntax checks for all application modules.
- Native `alert()`/`confirm()` placeholder scan.
- Browser route checks for storefront, authentication, customer, and all eight admin sections.
- Catalog search, category filter, and price sorting.
- Invalid registration password and successful registration.
- Customer onboarding skip.
- Mobile navigation at 320px and no horizontal overflow.
- Responsive viewport checks at 320px, 375px, 768px, 1024px, and 1440px.
- Light/dark/system theme persistence.
- Product detail and booking form labels, modal open/close, and keyboard focus.

The source is ready to run directly from a clone; generated screenshots and
submission archives are intentionally excluded from this repository.
# RENTIFY
