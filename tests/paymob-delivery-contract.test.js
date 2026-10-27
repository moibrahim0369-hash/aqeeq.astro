'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const webhook = read('supabase/functions/paymob-webhook/index.ts');
const report = read('supabase/functions/generate-astro-report/index.ts');
const auth = read('auth.js');
const html = read('index.html');
const migration = read('supabase/migrations/20261026024522_report_delivery_state.sql');

// Webhook signature and success/failure gates.
assert.ok(webhook.includes('HMAC_FIELDS'), 'Paymob canonical HMAC fields are defined');
assert.ok(/createHmac|subtle\.importKey/.test(webhook), 'HMAC cryptography is used');
assert.ok(webhook.includes('verify(obj, received)'), 'received HMAC is verified');
assert.ok(webhook.includes('obj.success === true'), 'only successful payments proceed');
assert.ok(webhook.includes('obj.pending !== true'), 'pending callbacks are rejected');
assert.ok(webhook.includes('obj.error_occured !== true'), 'failed callbacks are rejected');
assert.ok(webhook.includes('obj.is_refunded !== true'), 'refunded callbacks are rejected');
assert.ok(webhook.includes('fulfill_paid_order'), 'verified event uses atomic fulfillment');
assert.ok(webhook.includes('provider_event_id: `${eventId}:not_paid`'), 'non-paid callbacks use a distinct idempotency key');
assert.ok(webhook.includes('p_event_id: `${eventId}:paid`'), 'a later successful callback is not suppressed by an earlier non-paid callback');
assert.ok(webhook.includes('Repeated successful callbacks still share one stable idempotency key.'), 'repeated successful callbacks remain idempotent');

// Amount/currency validation and idempotency in the fulfillment SQL.
assert.ok(migration.includes('v_order.amount_cents <> p_amount_cents'), 'amount mismatch is rejected');
assert.ok(migration.includes('v_order.currency <> upper(p_currency)'), 'currency mismatch is rejected');
assert.match(migration, /on conflict \(provider, provider_event_id\) do nothing/i);
assert.match(migration, /if v_event is null then\s+return 'duplicate'/);
assert.ok(migration.includes('insert into public.report_deliveries'), 'paid full-report order gets pending delivery state');

// HMAC-SHA512 primitive sanity check: payload tampering changes the digest.
const crypto = require('node:crypto');
const secret = 'unit-test-secret';
const canonical = 'amount_cents123created_at2026-01-01currencyEGPsuccesstrue';
const sign = value => crypto.createHmac('sha512', secret).update(value).digest('hex');
const signature = sign(canonical);
assert.equal(sign(canonical), signature);
assert.notEqual(sign(canonical + 'x'), signature);
assert.equal(signature.length, 128);

// Delivery only follows accepted email and the same user's paid full-report order.
assert.match(report, /\.eq\(["']user_id["'], user\.id\)[\s\S]*?\.eq\(["']status["'], ["']paid["']\)[\s\S]*?\.eq\(["']product_code["'], ["']full_report["']/);
assert.ok(report.includes('if (!orderId) throw new HttpError(400'), 'report endpoint requires an order ID');
assert.ok(report.includes('if (emailSent && orderId)'));
assert.match(report, /\.eq\(["']status["'], ["']pending["']\)/);
assert.match(report, /status: ["']delivered["']/);

// Frontend must verify the paid order and pass its exact orderId to report generation.
assert.ok(auth.includes("sessionStorage.setItem('aq-paid-report-order', data.id)"));
assert.ok(auth.includes("body: { orderId, userName: draft.userName || '', birthData: draft.birthData, chartData: draft.chartData }"));
assert.ok(auth.includes("supabase.functions.invoke('generate-astro-report'"));
assert.ok(auth.includes(".eq('user_id', s.user.id)"));
assert.ok(auth.includes(".eq('orders.status', 'paid')"));
assert.ok(auth.includes(".eq('status', 'delivered')"));
assert.ok(auth.includes('ui.whatsapp.hidden = !delivered'));
assert.match(html, /<a[^>]*hidden[^>]*id="acct-whatsapp-support"|<a[^>]*id="acct-whatsapp-support"[^>]*hidden/);
assert.ok(html.includes('id="acct-generate-report"'));
assert.ok(html.includes('sessionStorage.setItem("aq-report-draft"'));

console.log('Paymob and report-delivery contract checks passed. These are source/logic checks, not live Paymob end-to-end tests.');
