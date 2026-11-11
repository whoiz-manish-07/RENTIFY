const STORAGE_KEY = 'rentify_admin_data_v1';
const demoBlockedDates = [{ id: 4001, start: '2026-12-01', end: '2026-12-03', reason: 'Demo equipment maintenance', demo: true }];

const read = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      blockedDates: Array.isArray(saved.blockedDates) && saved.blockedDates.length
        ? [...demoBlockedDates.filter((item) => !saved.blockedDates.some((savedItem) => savedItem.id === item.id)), ...saved.blockedDates]
        : demoBlockedDates,
      settings: saved.settings && typeof saved.settings === 'object' ? saved.settings : {},
    };
  } catch (error) {
    console.warn('RENTIFY could not read admin data.', error);
    return { blockedDates: [], settings: {} };
  }
};

let data = read();

const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('RENTIFY could not save admin data.', error);
  }
};

export const adminStore = {
  getBlockedDates() {
    return data.blockedDates;
  },
  addBlockedDate(record) {
    if (!record.start || !record.end || record.end < record.start) return false;
    data.blockedDates = [...data.blockedDates, { id: Date.now(), ...record }];
    save();
    return true;
  },
  removeBlockedDate(id) {
    data.blockedDates = data.blockedDates.filter((record) => record.id !== id);
    save();
  },
  getSettings() {
    return { ...data.settings };
  },
  saveSettings(settings) {
    data.settings = { ...data.settings, ...settings };
    save();
  },
  reset() {
    data = { blockedDates: demoBlockedDates, settings: {} };
    save();
  },
};
