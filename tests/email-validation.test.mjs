import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

const { getEmailValidationError, isValidEmail } = await import('../assets/js/auth.js');

test('accepts well-formed addresses and seeded demo accounts', () => {
  assert.equal(isValidEmail('real.person+rent@gmail.com'), true);
  assert.equal(isValidEmail('REAL.PERSON@OUTLOOK.COM'), true);
  assert.equal(isValidEmail('customer@rentify.demo'), true);
});

test('rejects malformed, placeholder, disposable, and mistyped domains', () => {
  const invalidEmails = [
    ' user@gmail.com',
    'user..name@gmail.com',
    'user@example.com',
    'user@mailinator.com',
    'user@sub.yopmail.com',
    'user@-domain.com',
    'user@domain',
    'user name@gmail.com',
  ];
  invalidEmails.forEach((email) => assert.equal(isValidEmail(email), false, email));
  assert.match(getEmailValidationError('user@gmial.com'), /Did you mean gmail\.com/);
});
