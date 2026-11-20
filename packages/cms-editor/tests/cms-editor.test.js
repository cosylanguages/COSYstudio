'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const SRC = fs.readFileSync(path.join(__dirname, '..', 'cms-editor.js'), 'utf8');

function load(html) {
  const dom = new JSDOM('<!doctype html><body>' + (html || '') + '</body>', { url: 'https://cosylanguages.github.io/COSYtools/page.html', runScripts: 'outside-only' });
  dom.window.COSY_CMS_NO_AUTOINIT = true;
  dom.window.eval(SRC);
  return dom.window;
}

// A tiny in-memory Supabase stand-in covering what the editor uses.
function fakeClient({ user, profileRole, rows = {}, upsertError = null }) {
  const upserts = [];
  const client = {
    upserts, rows,
    auth: { getSession: async () => ({ data: { session: user ? { user } : null } }) },
    from(table) {
      return {
        select: () => ({
          eq: (col, val) => ({
            maybeSingle: async () => {
              if (table === 'profiles') return profileRole === undefined ? { data: null, error: null } : { data: { role: profileRole }, error: null };
              return { data: rows[val] ? { content: rows[val] } : null, error: null };
            }
          })
        }),
        upsert: async (row) => { upserts.push(row); if (!upsertError) rows[row.page_path] = row.content; return { error: upsertError }; }
      };
    }
  };
  return client;
}

const PAYLOADS = [
  ['<script>alert(1)</script>ok', 'ok'],
  ['<img src=x onerror=alert(1)>', '<img src="x">'],
  ['<img src="data:image/svg+xml,<svg onload=alert(1)>">', ''],
  ['<a href="javascript:alert(1)">x</a>', '<a>x</a>'],
  ['<a href="java\tscript:alert(1)">x</a>', '<a>x</a>'],
  ['<a href="https://ok.example/p" onclick="x()">x</a>', '<a href="https://ok.example/p" rel="noopener noreferrer">x</a>'],
  ['<svg><script>alert(1)</script></svg>t', 't'],
  ['<p style="x" id="y">hi</p>', '<p>hi</p>'],
  ['<iframe src="https://e.example"></iframe>t', 't'],
  ['<table><tbody><tr><td colspan="2" onclick="x()">c</td></tr></tbody></table>', '<table><tbody><tr><td colspan="2">c</td></tr></tbody></table>'],
  ['<form action="x"><input></form>t', 't'],
  ['<b>bold</b> <em>it</em>', '<b>bold</b> <em>it</em>'],
  ['<a href="https://ok.example" target="_blank" onclick="x()">x</a>', '<a href="https://ok.example" rel="noopener noreferrer" target="_blank">x</a>'],
  ['<a href="https://ok.example" target="evil">x</a>', '<a href="https://ok.example" rel="noopener noreferrer">x</a>'],
  ['<a target="_blank">x</a>', '<a>x</a>'],
  [null, ''], [42, '']
];

test('sanitizer', () => {
  const w = load();
  for (const [i, e] of PAYLOADS) assert.equal(w.CosyCms.sanitizeHTML(i), e, JSON.stringify(i));
});

test('keys, paths and roles', () => {
  const C = load().CosyCms;
  assert.ok(C.isValidKey('hero-title_1'));
  for (const k of ['', 'a b', 'a"]', '#x', '.x', 'x'.repeat(81), null]) assert.equal(C.isValidKey(k), false, String(k));
  assert.ok(C.isValidPagePath('/COSYtools/tools/fr/index.html'));
  for (const p of ['/a b', '/a?x=1', '/é', '/' + 'a'.repeat(200)]) assert.equal(C.isValidPagePath(p), false, p);
  assert.ok(C.isFounderRole(' Founder ') && C.isFounderRole('admin') && C.isFounderRole('owner'));
  for (const r of ['editor', 'student', '', null, undefined]) assert.equal(C.isFounderRole(r), false);
});

test('role comes from the database profile only', async () => {
  const w = load();
  w.COSY_USER = { role: 'founder' };
  w.localStorage.setItem('cosy_role', 'founder');
  const user = { id: 'u1', role: 'founder', user_metadata: { role: 'founder' }, app_metadata: { role: 'founder' } };
  assert.equal((await w.CosyCms.resolveVerifiedUser(fakeClient({ user, profileRole: 'student' }))).role, 'student');
  assert.equal(await w.CosyCms.resolveVerifiedUser(fakeClient({ user, profileRole: undefined })), null);
  assert.equal(await w.CosyCms.resolveVerifiedUser(fakeClient({ user: null, profileRole: 'founder' })), null);
  assert.equal(await w.CosyCms.resolveVerifiedUser(null), null);
});

test('applyOverrides cleans HTML, targets data-cms-id and id only, rejects bad keys', () => {
  const w = load('<h1 data-cms-id="title">old</h1><p id="intro" class="lead">old</p><p class="lead2">keep</p><div id="other">keep</div>');
  const applied = w.CosyCms.applyOverrides({
    title: '<b>New</b><script>alert(1)</script>',
    intro: '<img src=x onerror=alert(1)>hi',
    lead2: 'class keys are not addressed',
    'bad key': 'x', '.lead': 'x', '#other': 'x', n: 5
  });
  const d = w.document;
  assert.equal(d.querySelector('[data-cms-id=title]').innerHTML, '<b>New</b>');
  assert.equal(d.getElementById('intro').innerHTML, '<img src="x">hi');
  assert.equal(d.querySelector('.lead2').textContent, 'keep');
  assert.equal(d.getElementById('other').textContent, 'keep');
  assert.deepEqual(Array.from(applied).sort(), ['intro', 'lead2', 'title']);
});

test('only elements marked editable are collected; toolbar and ignored areas are skipped', () => {
  const w = load('<h1 data-cms-id="a">A</h1><p id="b">B</p><p id="c" data-cms-editable="true">C</p><div data-cms-ignore="true"><p data-cms-id="d">D</p></div>');
  assert.deepEqual(JSON.parse(JSON.stringify(w.CosyCms.collectEdits())), { a: 'A', c: 'C' });
});

test('save merges into stored content, cleans it, records the user, and keeps other keys', async () => {
  const w = load();
  const c = fakeClient({ rows: { '/COSYtools/page.html': { keep: 'old', title: 'old' } } });
  const merged = await w.CosyCms.saveOverrides(c, '/COSYtools/page.html', { title: '<b>x</b><script>1</script>', 'bad key': 'z' }, 'u1');
  assert.deepEqual(JSON.parse(JSON.stringify(merged)), { keep: 'old', title: '<b>x</b>' });
  assert.equal(c.upserts.length, 1);
  assert.equal(c.upserts[0].updated_by, 'u1');
  assert.equal(c.upserts[0].page_path, '/COSYtools/page.html');
});

test('save refuses paths the database would reject, oversize content, and surfaces errors', async () => {
  const w = load();
  await assert.rejects(w.CosyCms.saveOverrides(fakeClient({}), '/a b.html', { x: 'y' }), /not allowed/);
  await assert.rejects(w.CosyCms.saveOverrides(fakeClient({}), '/p.html', { x: 'a'.repeat(200001) }), /too large/);
  await assert.rejects(w.CosyCms.saveOverrides(fakeClient({ upsertError: { message: 'denied' } }), '/p.html', { x: 'y' }), /denied/);
});

test('toolbar appears only for a founder profile, and saving works end to end', async () => {
  const user = { id: 'u1' };
  const w1 = load('<h1 data-cms-id="t">Old</h1>');
  const r1 = await w1.CosyCms.init({ getClient: () => fakeClient({ user, profileRole: 'student', rows: { '/COSYtools/page.html': { t: 'Live' } } }) });
  assert.equal(r1.toolbar, false);
  assert.equal(w1.document.getElementById('cosy-founder-cms-toolbar'), null);
  assert.equal(w1.document.querySelector('h1').textContent, 'Live', 'visitors still see published overrides');

  const w2 = load('<h1 data-cms-id="t">Old</h1>');
  const client = fakeClient({ user, profileRole: 'founder' });
  const r2 = await w2.CosyCms.init({ getClient: () => client });
  assert.equal(r2.toolbar, true);
  const d = w2.document;
  d.getElementById('cms-edit-btn').click();
  assert.equal(d.querySelector('h1').getAttribute('contenteditable'), 'true');
  d.querySelector('h1').innerHTML = 'New <script>x</script>';
  d.getElementById('cms-save-btn').click();
  await new Promise(r => setTimeout(r, 20));
  assert.deepEqual(JSON.parse(JSON.stringify(client.upserts[0].content)), { t: 'New ' });
  assert.equal(d.querySelector('h1').hasAttribute('contenteditable'), false);
});
