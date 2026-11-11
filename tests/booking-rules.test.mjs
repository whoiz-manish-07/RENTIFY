import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOOKING_STATUS,
  calculateRental,
  checkAvailability,
  datesOverlap,
  isDateString,
  rentalDays,
  canTransition,
} from '../assets/js/bookingRules.js';

const product = { id: 1, stock: 3 };

test('uses inclusive local calendar rental days and scales subtotal and deposit by quantity', () => {
  assert.equal(isDateString('2026-02-28'), true);
  assert.equal(isDateString('2026-02-30'), false);
  assert.equal(rentalDays('2026-03-01', '2026-03-03'), 3);
  assert.deepEqual(calculateRental({ start: '2026-03-01', end: '2026-03-03', dailyRate: 500, depositPerUnit: 1000, quantity: 2 }), {
    days: 3, quantity: 2, subtotal: 3000, deposit: 2000, total: 5000,
  });
});

test('treats both endpoints as overlapping calendar dates', () => {
  assert.equal(datesOverlap('2026-03-02', '2026-03-04', '2026-03-04', '2026-03-06'), true);
  assert.equal(datesOverlap('2026-03-02', '2026-03-04', '2026-03-05', '2026-03-06'), false);
});

test('counts held quantities and allows rejected/cancelled inventory to be reused', () => {
  const bookings = [
    { productId: 1, start: '2026-04-01', end: '2026-04-03', quantity: 2, status: 'Approved' },
    { productId: 1, start: '2026-04-02', end: '2026-04-02', quantity: 3, status: 'Rejected' },
  ];
  assert.equal(checkAvailability({ product, bookings, start: '2026-04-03', end: '2026-04-03', quantity: 2 }).ok, false);
  assert.equal(checkAvailability({ product, bookings, start: '2026-04-04', end: '2026-04-04', quantity: 3 }).ok, true);
});

test('rejects past, reversed, blocked, and over-capacity requests', () => {
  const common = { product, bookings: [], today: '2026-05-10' };
  assert.equal(checkAvailability({ ...common, start: '2026-05-09', end: '2026-05-10', quantity: 1 }).ok, false);
  assert.equal(checkAvailability({ ...common, start: '2026-05-12', end: '2026-05-11', quantity: 1 }).ok, false);
  assert.equal(checkAvailability({ ...common, start: '2026-05-12', end: '2026-05-12', quantity: 4 }).ok, false);
  assert.equal(checkAvailability({ ...common, blockedDates: [{ start: '2026-05-12', end: '2026-05-14' }], start: '2026-05-13', end: '2026-05-13', quantity: 1 }).ok, false);
});

test('enforces the documented booking status flow', () => {
  assert.equal(canTransition(BOOKING_STATUS.REQUESTED, BOOKING_STATUS.APPROVED), true);
  assert.equal(canTransition(BOOKING_STATUS.REQUESTED, BOOKING_STATUS.ACTIVE), false);
  assert.equal(canTransition(BOOKING_STATUS.APPROVED, BOOKING_STATUS.CANCELLED), true);
  assert.equal(canTransition(BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED), false);
});
