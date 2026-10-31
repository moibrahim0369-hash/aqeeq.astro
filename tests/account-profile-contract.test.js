import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../account-profile.js', import.meta.url), 'utf8');
const migration = readFileSync(new URL('../supabase/migrations/20261031070400_account_profile_completion.sql', import.meta.url), 'utf8');

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
assert.match(migration, /enable row level security/i.test(migration) ? /storage\.objects/i : /storage\.objects/i);
assert.match(migration, /Avatar owners can upload their files/);
assert.match(migration, /auth\.uid\(\)::text/);
assert.doesNotMatch(script, /service_role|SUPABASE_SECRET_KEY/i);
console.log('Account profile completion contract: PASS');
