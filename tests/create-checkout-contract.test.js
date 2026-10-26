'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('supabase/functions/create-checkout/index.ts', 'utf8');

assert.ok(source.includes('admin.auth.getUser(token)'), 'checkout authenticates the caller token');
assert.ok(source.includes('if (uErr || !u?.user)'), 'checkout fails closed for invalid sessions');
assert.ok(source.includes('.from("products").select("code,name_ar,amount_cents,currency,active")'), 'price and currency come from the products table');
assert.ok(source.includes('!product.active') && source.includes('product.amount_cents <= 0'), 'inactive or invalid products cannot be purchased');
assert.ok(source.includes('user_id: user.id') && source.includes('amount_cents: product.amount_cents') && source.includes('currency: product.currency'), 'pending order is bound to the authenticated user and server-side price');
assert.ok(!/body\?\.amount(_cents)?|body\?\.currency/.test(source), 'client cannot choose amount or currency');
assert.ok(source.includes('special_reference: order.id'), 'Paymob merchant reference uses the exact local order UUID');
assert.ok(source.includes('notification_url: `${SUPABASE_URL}/functions/v1/paymob-webhook`'), 'checkout points to the HMAC webhook');
assert.ok(source.includes('redirection_url: `${SITE_URL}?order=${order.id}#account`'), 'return URL carries the same order UUID');
assert.ok(source.includes('typeof out?.client_secret !== "string"'), 'checkout rejects responses without a provider client secret');
assert.ok(source.includes('PAYMOB_SECRET_KEY') && source.includes('PAYMOB_PUBLIC_KEY'), 'Paymob credentials are loaded from server environment');
assert.ok(source.includes('BASE_ALLOW.includes(BASE)'), 'provider host is allowlisted');
assert.ok(source.includes('return json({ checkoutUrl, orderId: order.id });'), 'response returns the checkout URL and matching order ID');

console.log('Create-checkout source contract checks passed. No payment was initiated.');
