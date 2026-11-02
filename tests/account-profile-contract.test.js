const { readFileSync } = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');

const html = readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const script = readFileSync(path.resolve(__dirname, '../account-profile.js'), 'utf8');
const migration = readFileSync(path.resolve(__dirname, '../supabase/migrations/20261031050940_account_profile_completion.sql'), 'utf8');

for (const id of [
  'profile-first-name', 'profile-last-name', 'profile-birth-date',
  'profile-birth-time', 'profile-time-unknown', 'profile-birth-city',
  'profile-birth-country', 'profile-avatar-file'
]) assert.ok(script.includes(id), `Missing account profile control: ${id}`);

assert.match(html, /account-profile\.js/);
assert.match(script, /\.from\('profiles'\)/);
assert.match(script, /upsert\(\{ id: currentUser\.id/);
assert.match(script, /birth_time_unknown: timeUnknown/);
assert.match(script, /actions\.hidden = !complete/);
assert.match(script, /\.from\('avatars'\)\.upload/);
assert.match(script, /file\.size > 5 \* 1024 \* 1024/);
assert.match(migration, /create policy "Avatar owners can upload their files"/i);
assert.match(migration, /file_size_limit/);
assert.match(migration, /5242880/);
assert.match(migration, /Avatar owners can upload their files/);
assert.match(migration, /auth\.uid\(\)::text/);
assert.doesNotMatch(script, /service_role|SUPABASE_SECRET_KEY/i);
console.log('Account profile completion contract: PASS');
