'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const webhook = fs.readFileSync(path.join(root, 'supabase/functions/paymob-webhook/index.ts'), 'utf8');
const report = fs.readFileSync(path.join(root, 'supabase/functions/generate-astro-report/index.ts'), 'utf8');
const auth = fs.readFileSync(path.join(root, 'auth.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20261026030000_report_delivery_state.sql'), 'utf8');

// Static contract checks for the actual checked-in webhook and fulfillment RPC.
assert.match(webhook, /HMAC_FIELDS\s*=\s*\[/);
assert.match(webhook, /createHmac|subtle\.importKey/);
assert.match(webhook, /if \(!\(await verify\(obj, received\)\)\)/);
assert.match(webhook, /obj\.success === true/);
assert.match(webhook, /obj\.pending !== true/);
assert.match(webhook, /obj\.error_occured !== true/);
assert.match(webhook, /obj\.is_refunded !== true/);
assert.match(webhook, /fulfill_paid_order/);
assert.match(migration, /v_order\.amount_cents <> p_amount_cents/);
assert.match(migration, /v_order\.currency <> upper\(p_currency\)/);
assert.match(migration, /on conflict \(provider, provider_event_id\) do nothing/i);
assert.match(migration, /if v_event is null then\s+return 'duplicate'/);
assert.match(migration, /insert into public\.report_deliveries/i);

// Actual HMAC primitive sanity check: a changed payload must never validate against the old signature.
const crypto = require('node:crypto');
const secret = 'unit-test-secret';
const canonical = 'amount_cents123created_at2026-01-01currencyEGPsuccesstrue';
const sign = value => crypto.createHmac('sha512', secret).update(value).digest('hex');
const signature = sign(canonical);
assert.equal(sign(canonical), signature, 'valid HMAC must be deterministic');
assert.notEqual(sign(canonical + 'x'), signature, 'tampered payload must change HMAC');
assert.equal(signature.length, 128, 'Paymob HMAC SHA-512 hex digest is 128 chars');

// Report is only marked delivered after provider accepts email, and only for the paid owner order.
assert.match(report, /\\.eq\\(["']user_id["'], user\\.id\\)[\\s\\S]*?\\.eq\\(["']status["'], ["']paid["']\\)[\\s\\S]*?\\.eq\\(["']product_code["'], ["']full_report["']/);
assert.match(report, /if \\(emailSent && orderId\\)/);
assert.match(report, /\\.eq\\(["']status["'], ["']pending["']\\)/);
assert.match(report, /status: ["']delivered["']/);
assert.match(auth, /\\.eq\\('status', 'delivered'\\)/);
assert.match(auth, /\\.eq\\('orders\\.status', 'paid'\\)/);
assert.match(auth, /ui\\.whatsapp\\.hidden = !delivered/);
assert.match(html, /id="acct-whatsapp-support"[^>]*hidden/);
console.log('Paymob webhook/report-delivery contract checks passed. These are source/logic checks, not live provider end-to-end tests.');
