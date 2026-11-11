import { auth } from './auth.js';

const STORAGE_KEY = 'rentify_customer_data_v1';
const demoReviews = [
  { id: 2001, bookingId: 1001, userId: 'demo-customer', rating: 5, text: 'The camera kit was clean, complete, and easy to use for our weekend project.', hidden: false, updatedAt: '2026-11-01T10:00:00.000Z', demo: true },
];
const demoNotifications = {
  'demo-customer': [
    { id: 3001, read: false, createdAt: '2026-11-11T09:00:00.000Z', type: 'booking', title: 'Booking approved', message: 'Your Mirrorless Camera Kit rental has been completed in the demo history.', demo: true },
    { id: 3002, read: false, createdAt: '2026-11-10T09:00:00.000Z', type: 'review', title: 'Share your rental feedback', message: 'Your completed camera rental is ready for a demo review.', demo: true },
  ],
  'demo-customer-2': [
    { id: 3003, read: false, createdAt: '2026-11-11T08:30:00.000Z', type: 'booking', title: 'Rental started', message: 'The PlayStation Gaming Console demo rental is active today.', demo: true },
  ],
  'demo-customer-3': [
    { id: 3004, read: false, createdAt: '2026-11-10T08:00:00.000Z', type: 'booking', title: 'Booking approved', message: 'Your Premium Laptop request is approved in the demo marketplace.', demo: true },
  ],
};

const read = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const savedReviews = Array.isArray(saved.reviews) ? saved.reviews : [];
    const savedNotifications = saved.notifications && typeof saved.notifications === 'object' ? saved.notifications : {};
    const notifications = { ...demoNotifications };
    Object.entries(savedNotifications).forEach(([id, items]) => {
      const safeItems = Array.isArray(items) ? items : [];
      notifications[id] = [
        ...(demoNotifications[id] || []).filter((item) => !safeItems.some((savedItem) => savedItem?.id === item.id)),
        ...safeItems,
      ];
    });
    return {
      profiles: saved.profiles && typeof saved.profiles === 'object' ? saved.profiles : {},
      wishlists: saved.wishlists && typeof saved.wishlists === 'object' ? saved.wishlists : {},
      reviews: [...savedReviews, ...demoReviews.filter((review) => !savedReviews.some((item) => item?.id === review.id))],
      notifications,
    };
  } catch (error) {
    console.warn('RENTIFY could not read customer data.', error);
    return { profiles: {}, wishlists: {}, reviews: [], notifications: {} };
  }
};

let data = read();

const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('RENTIFY could not save customer data.', error);
  }
};

const userId = () => auth.getUser()?.id;
const userWishlist = () => data.wishlists[userId()] || [];

export const customerStore = {
  getProfile() {
    const user = auth.getUser();
    return { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', city: '', preferences: [], notifications: true, ...data.profiles[user?.id] };
  },
  saveProfile(profile) {
    if (!userId()) return;
    data.profiles[userId()] = { ...this.getProfile(), ...profile };
    save();
  },
  getWishlist() {
    return userWishlist();
  },
  toggleWishlist(productId) {
    if (!userId()) return false;
    const wishlist = userWishlist();
    data.wishlists[userId()] = wishlist.includes(productId) ? wishlist.filter((id) => id !== productId) : [...wishlist, productId];
    save();
    return data.wishlists[userId()].includes(productId);
  },
  getReviews() {
    return data.reviews.filter((review) => review.userId === userId());
  },
  getAllReviews() {
    return [...data.reviews];
  },
  setReviewHidden(reviewId, hidden) {
    data.reviews = data.reviews.map((review) => review.id === reviewId ? { ...review, hidden: Boolean(hidden) } : review);
    save();
  },
  getReview(bookingId) {
    return data.reviews.find((review) => review.userId === userId() && String(review.bookingId) === String(bookingId));
  },
  saveReview(review) {
    if (!userId()) return;
    const bookingId = String(review.bookingId);
    const existing = data.reviews.findIndex((item) => item.userId === userId() && String(item.bookingId) === bookingId);
    const record = { ...review, bookingId, userId: userId(), updatedAt: new Date().toISOString() };
    if (existing >= 0) data.reviews[existing] = record; else data.reviews.push({ ...record, id: Date.now() });
    save();
  },
  deleteReview(reviewId) {
    data.reviews = data.reviews.filter((review) => !(review.id === reviewId && review.userId === userId()));
    save();
  },
  getNotifications() {
    return data.notifications[userId()] || [];
  },
  addNotification(notification) {
    if (!userId()) return;
    this.addNotificationForUser(userId(), notification);
  },
  addNotificationForUser(targetUserId, notification) {
    if (!targetUserId) return;
    const notifications = data.notifications[targetUserId] || [];
    data.notifications[targetUserId] = [{ id: Date.now(), read: false, createdAt: new Date().toISOString(), ...notification }, ...notifications].slice(0, 30);
    save();
  },
  markNotificationRead(notificationId) {
    data.notifications[userId()] = this.getNotifications().map((notification) => notification.id === notificationId ? { ...notification, read: true } : notification);
    save();
  },
  markAllNotificationsRead() {
    data.notifications[userId()] = this.getNotifications().map((notification) => ({ ...notification, read: true }));
    save();
  },
  getUnreadCount() {
    return this.getNotifications().filter((notification) => !notification.read).length;
  },
  reset() {
    data = { profiles: {}, wishlists: {}, reviews: demoReviews, notifications: demoNotifications };
    save();
  },
};
