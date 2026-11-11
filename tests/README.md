# RENTIFY JavaScript validation checklist

The pure booking-rule suite is executable with `node --test tests/booking-rules.test.mjs`.

- [x] Inclusive calendar-day calculation and INR breakdown inputs
- [x] Quantity-scaled subtotal, refundable deposit, and total
- [x] Invalid, past, and reversed dates
- [x] Inclusive overlap boundaries
- [x] Approved, active, and requested inventory holds
- [x] Rejected and cancelled inventory release
- [x] Stock capacity and maintenance blocks
- [x] Requested → approved → active → completed transitions
- [x] Requested → rejected and requested/approved → cancelled transitions
- [x] Revalidation immediately before booking persistence
- [x] Duplicate-submit lock and stable booking IDs
- [x] Customer ownership and completed-booking review eligibility
- [x] Product required fields, URL, numeric values, and duplicate-name validation
- [ ] Browser-only exploratory checks: auth, profile, filters, admin CRUD, refresh persistence, and native browser validation

Pending booking requests follow a conservative hold policy: requested, approved, and active bookings reserve their requested quantity. Rejected and cancelled bookings release inventory. This is simulated in the current browser only; it is not multi-user real-time availability.
