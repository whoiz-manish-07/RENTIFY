const ACCOUNT_KEY = 'rentify_accounts_v1';
const SESSION_KEY = 'rentify_session_v1';
const ONBOARDING_KEY = 'rentify_onboarding_v1';

const demoAccounts = [
  { id: 'demo-customer', name: 'Demo customer', email: 'customer@rentify.demo', role: 'customer', password: 'rentify123', phone: '9876543210' },
  { id: 'demo-customer-2', name: 'Priya Demo', email: 'priya@rentify.demo', role: 'customer', password: 'priya1234', phone: '9876543211' },
  { id: 'demo-customer-3', name: 'Arjun Demo', email: 'arjun@rentify.demo', role: 'customer', password: 'arjun1234', phone: '9876543212' },
  { id: 'demo-admin', name: 'Demo admin', email: 'admin@rentify.demo', role: 'admin', password: 'admin1234' },
];

const hash = (value) => Array.from(String(value)).reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 7).toString(16);
const normaliseEmail = (value) => String(value || '').trim().toLowerCase();

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`RENTIFY could not read ${key}.`, error);
    return fallback;
  }
};

const saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`RENTIFY could not save ${key}.`, error);
  }
};

const seededAccounts = () => demoAccounts.map(({ password, ...account }) => ({ ...account, passwordHash: hash(password), demo: true }));

const readAccounts = () => {
  const accounts = readJson(ACCOUNT_KEY, null);
  const seeded = seededAccounts();
  if (!Array.isArray(accounts) || !accounts.length) {
    saveJson(ACCOUNT_KEY, seeded);
    return seeded;
  }
  const existingEmails = new Set(accounts.map((account) => account.email));
  const merged = [...accounts, ...seeded.filter((account) => !existingEmails.has(account.email))];
  if (merged.length !== accounts.length) saveJson(ACCOUNT_KEY, merged);
  return merged;
};

const readSession = () => {
  const persisted = readJson(SESSION_KEY, null);
  if (persisted?.email) return persisted;
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  } catch (_) {
    return null;
  }
};

let accounts = readAccounts();
let session = readSession();

const persistSession = (value, remember) => {
  session = value;
  if (remember) {
    saveJson(SESSION_KEY, value);
    sessionStorage.removeItem(SESSION_KEY);
  } else {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
  }
};

export const auth = {
  getUser: () => session,
  getAccounts: () => accounts.map(({ passwordHash, ...account }) => account),
  signIn(email, password, remember = true) {
    const account = accounts.find((item) => item.email === normaliseEmail(email) && item.passwordHash === hash(password));
    if (!account) return { ok: false, error: 'Email or password does not match our demo accounts.' };
    if (account.active === false) return { ok: false, error: 'This demo account is deactivated. Contact the admin demo to restore access.' };
    const user = { id: account.id, name: account.name, email: account.email, role: account.role };
    persistSession(user, remember);
    return { ok: true, user };
  },
  register(name, email, password, remember = true, phone = '') {
    const cleanEmail = normaliseEmail(email);
    if (accounts.some((account) => account.email === cleanEmail)) return { ok: false, error: 'An account with this email already exists.' };
    const user = { id: `customer-${Date.now()}`, name: String(name).trim(), email: cleanEmail, phone: String(phone).trim(), role: 'customer' };
    accounts = [...accounts, { ...user, active: true, passwordHash: hash(password), demo: false }];
    saveJson(ACCOUNT_KEY, accounts);
    persistSession(user, remember);
    return { ok: true, user };
  },
  setAccountActive(id, active) {
    const account = accounts.find((item) => item.id === id);
    if (!account || account.role === 'admin') return false;
    accounts = accounts.map((item) => item.id === id ? { ...item, active } : item);
    saveJson(ACCOUNT_KEY, accounts);
    if (!active && session?.id === id) this.signOut();
    return true;
  },
  updateAccountName(id, name) {
    const account = accounts.find((item) => item.id === id);
    if (!account || !name) return false;
    accounts = accounts.map((item) => item.id === id ? { ...item, name } : item);
    saveJson(ACCOUNT_KEY, accounts);
    if (session?.id === id) {
      session = { ...session, name };
      persistSession(session, true);
    }
    return true;
  },
  signOut() {
    session = null;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  },
  isOnboardingComplete() {
    return Boolean(readJson(ONBOARDING_KEY, {})[session?.id]?.complete);
  },
  completeOnboarding(preferences = []) {
    const state = readJson(ONBOARDING_KEY, {});
    state[session.id] = { complete: true, preferences, completedAt: new Date().toISOString() };
    saveJson(ONBOARDING_KEY, state);
  },
  resetDemo() {
    accounts = seededAccounts();
    saveJson(ACCOUNT_KEY, accounts);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    session = null;
  },
  demoCredentials: demoAccounts.map(({ email, password, role }) => ({ email, password, role })),
};
