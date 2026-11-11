const DAY_MS = 86400000;

export const BOOKING_STATUS = Object.freeze({
  REQUESTED: 'Pending',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
});

export const HELD_STATUSES = Object.freeze([
  BOOKING_STATUS.REQUESTED,
  BOOKING_STATUS.APPROVED,
  BOOKING_STATUS.ACTIVE,
]);

const statusAliases = {
  requested: BOOKING_STATUS.REQUESTED,
  pending: BOOKING_STATUS.REQUESTED,
  approved: BOOKING_STATUS.APPROVED,
  active: BOOKING_STATUS.ACTIVE,
  completed: BOOKING_STATUS.COMPLETED,
  rejected: BOOKING_STATUS.REJECTED,
  cancelled: BOOKING_STATUS.CANCELLED,
};

export const canonicalStatus = (status) => statusAliases[String(status || '').trim().toLowerCase()] || null;

export const isDateString = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
  const [year, month, day] = String(value).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

export const datesOverlap = (startA, endA, startB, endB) => (
  isDateString(startA) && isDateString(endA) && isDateString(startB) && isDateString(endB)
  && startA <= endB && endA >= startB
);

export const rentalDays = (start, end) => {
  if (!isDateString(start) || !isDateString(end)) return 0;
  const startUtc = Date.parse(`${start}T00:00:00Z`);
  const endUtc = Date.parse(`${end}T00:00:00Z`);
  const days = Math.round((endUtc - startUtc) / DAY_MS) + 1;
  return days > 0 ? days : 0;
};

export const calculateRental = ({ start, end, dailyRate, depositPerUnit, quantity = 1 }) => {
  const days = rentalDays(start, end);
  const units = Number(quantity);
  const price = Number(dailyRate);
  const deposit = Number(depositPerUnit);
  if (!days || !Number.isInteger(units) || units < 1 || !Number.isFinite(price) || price < 0 || !Number.isFinite(deposit) || deposit < 0) {
    return { days: 0, quantity: units, subtotal: 0, deposit: 0, total: 0 };
  }
  const subtotal = price * days * units;
  const refundableDeposit = deposit * units;
  return { days, quantity: units, subtotal, deposit: refundableDeposit, total: subtotal + refundableDeposit };
};

export const getReservedQuantity = (bookings, productId, start, end) => bookings
  .filter((booking) => Number(booking.productId) === Number(productId))
  .filter((booking) => HELD_STATUSES.includes(canonicalStatus(booking.status)))
  .filter((booking) => datesOverlap(start, end, booking.start, booking.end))
  .reduce((total, booking) => total + Math.max(1, Number(booking.quantity) || 1), 0);

export const checkAvailability = ({ product, bookings = [], blockedDates = [], start, end, quantity = 1, today }) => {
  const units = Number(quantity);
  const errors = [];
  if (!isDateString(start) || !isDateString(end)) errors.push('Choose valid calendar dates.');
  if (today && isDateString(start) && start < today) errors.push('Start date cannot be in the past.');
  if (isDateString(start) && isDateString(end) && end < start) errors.push('Return date must be on or after the start date.');
  if (!Number.isInteger(units) || units < 1) errors.push('Choose at least one unit.');
  if (product && Number.isInteger(units) && units > Number(product.stock || 0)) errors.push('The requested quantity exceeds available stock.');
  if (blockedDates.some((block) => datesOverlap(start, end, block.start, block.end))) errors.push('Those dates are blocked for maintenance.');
  const reserved = getReservedQuantity(bookings, product?.id, start, end);
  if (product && Number.isInteger(units) && reserved + units > Number(product.stock || 0)) errors.push('Not enough stock is available for those dates.');
  return { ok: errors.length === 0, errors, reserved, available: Math.max(0, Number(product?.stock || 0) - reserved) };
};

export const allowedTransitions = (status) => ({
  [BOOKING_STATUS.REQUESTED]: [BOOKING_STATUS.APPROVED, BOOKING_STATUS.REJECTED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.APPROVED]: [BOOKING_STATUS.ACTIVE, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.ACTIVE]: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.COMPLETED]: [],
  [BOOKING_STATUS.REJECTED]: [],
  [BOOKING_STATUS.CANCELLED]: [],
}[canonicalStatus(status)] || []);

export const canTransition = (from, to) => allowedTransitions(from).includes(canonicalStatus(to));
