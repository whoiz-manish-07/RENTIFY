import { createInitialState } from './data.js?seed=20261113';

const STORAGE_KEY = 'rentify_marketplace_v2';
const LEGACY_KEY = 'rentify_simple_v1';

const normalise = (candidate) => {
  const fallback = createInitialState();
  if (!candidate || typeof candidate !== 'object') return fallback;
  const savedBookings = Array.isArray(candidate.bookings)
    ? candidate.bookings.filter((item) => item && item.id != null && item.productId != null)
    : [];
  const customBookings = savedBookings.filter((item) => !item.demo);
  return {
    products: Array.isArray(candidate.products) ? candidate.products.filter((item) => item && item.id != null && typeof item.name === 'string') : fallback.products,
    bookings: Array.isArray(candidate.bookings)
      ? [...fallback.bookings, ...customBookings]
      : fallback.bookings,
    wishlist: Array.isArray(candidate.wishlist) ? candidate.wishlist : [],
  };
};

const read = () => {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      const normalized = normalise(JSON.parse(current));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }

    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = normalise(JSON.parse(legacy));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch (error) {
    console.warn('RENTIFY could not read local data.', error);
  }
  const initial = createInitialState();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (error) {
    console.warn('RENTIFY could not initialise local data.', error);
  }
  return initial;
};

let state = read();

export const store = {
  get: () => state,
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('RENTIFY could not save local data.', error);
    }
  },
  update(mutator) {
    mutator(state);
    this.save();
    return state;
  },
  reset() {
    state = createInitialState();
    this.save();
    return state;
  },
};
