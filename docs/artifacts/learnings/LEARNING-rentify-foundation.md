# Rentify foundation learning

- 2026-11-11: The existing application is a vanilla ES module storefront with the primary behavior concentrated in `assets/js/app.js`; preserve its route, store, and modal contracts when extending the shell.
- 2026-11-11: Bootstrap and Tailwind are loaded at the document level, so custom design tokens and components belong in `assets/css/styles.css`; Tailwind is configured with the `tw-` prefix and preflight disabled to avoid reset conflicts.
- 2026-11-11: Theme preference is persisted under `rentify_theme_v1`; the value must remain one of `light`, `dark`, or `system`, with the resolved theme applied before first paint.
- 2026-11-11: Demo authentication is isolated in `assets/js/auth.js`; account records retain only a lightweight demo hash, sessions respect the Remember me choice, and onboarding completion is keyed by account id.
- 2026-11-11: Customer-owned wishlist, profile, review and notification data belongs in `assets/js/customerStore.js`, keyed by authenticated user id; marketplace bookings retain an email fallback only for legacy records and new bookings must write `userId`.
- 2026-11-11: Admin-only persistence belongs in `assets/js/adminStore.js`; booking status changes must follow the explicit transition map and stock checks must count overlapping non-cancelled reservations against product inventory.
