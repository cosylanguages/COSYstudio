'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../studio-core.js');

function memStorage() {
  const m = new Map();
  return { get length() { return m.size; }, key: i => [...m.keys()][i] ?? null,
    getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
}

test('roles: founder aliases rank highest, unknown roles rank nowhere', () => {
  assert.ok(Core.roleAtLeast('owner', 'editor'));
  assert.ok(Core.roleAtLeast('editor', 'contributor'));
  assert.equal(Core.roleAtLeast('student', 'editor'), false);
  assert.equal(Core.roleAtLeast('hacker', 'student'), false);
});

test('founder aliases and role normalisation', () => {
  for (const r of ['founder', 'admin', 'owner', ' Founder ']) assert.equal(Core.isFounderRole(r), true);
  for (const r of ['editor', '', null, undefined, 42]) assert.equal(Core.isFounderRole(r), false);
});

test('verified user: ignores localStorage, needs a real session', async () => {
  globalThis.window = { localStorage: { getItem: () => 'founder' } };
  assert.equal(await Core.resolveVerifiedUser(null), null);
  const noSession = { auth: { getSession: async () => ({ data: { session: null }, error: null }) } };
  assert.equal(await Core.resolveVerifiedUser(noSession), null);
  const client = (role) => ({
    auth: { getSession: async () => ({ data: { session: { user: { id: 'u1', email: 'a@b.c' } } }, error: null }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: role ? { role } : null }) }) }) })
  });
  assert.equal((await Core.resolveVerifiedUser(client('Founder'))).isFounder, true);
  assert.equal((await Core.resolveVerifiedUser(client(null))).role, 'student');
  delete globalThis.window;
});

test('draft store: save, load, list, remove, and survives missing storage', () => {
  const d = Core.createDraftStore({ prefix: 't:', storage: memStorage() });
  assert.ok(d.save('a', { x: 1 }));
  assert.deepEqual(d.load('a').value, { x: 1 });
  assert.equal(d.list().length, 1);
  d.remove('a');
  assert.equal(d.load('a'), null);
  const none = Core.createDraftStore({ storage: null });
  assert.equal(none.save('a', 1), false);
  assert.deepEqual(none.list(), []);
});

test('summarizeChecks: errors block publishing, warnings do not', () => {
  const ok = Core.summarizeChecks([Core.makeCheck('a', 'ok', 'A'), Core.makeCheck('b', 'warn', 'B')]);
  assert.equal(ok.canPublish, true);
  assert.equal(Core.summarizeChecks([Core.makeCheck('a', 'error', 'A')]).canPublish, false);
  assert.equal(Core.summarizeChecks([]).canPublish, false);
});
