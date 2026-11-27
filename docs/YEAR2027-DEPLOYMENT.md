# Annual report release and private editorial workflow

## Current state: locked since 27 November 2026

The owner ended the open review and asked for a real lock. The only server for the annual report is the `year2027-api` function (source: `supabase/functions/year2027-api/index.ts`; `year2027-content` is retired and answers 410).

- `mode:preview` (no login): the short free reading, one free hook per section, and the 2026 summary. No paid text.
- Any other mode (the full report) needs a signed-in session AND `year2027_access(input)`: same account, normalized birth inputs, approved manual payment, paid matching order, active entitlement. Otherwise it answers 401 (not signed in) or 403 (not purchased). Accounts that pass `is_app_admin()` get the full report as an owner preview, without a payment.
- The page shows every visitor the same design: rows, a popup per section with a short free teaser and a lock, and the free 2026 summary. Pressing the lock button goes to checkout, which asks for sign-in and the birth data that is already in the session.
- After a transfer reference is submitted the buyer sees "under review" (`year2027_status(input)` returns none / pending / approved / rejected). The page re-checks about every minute and on return; the buyer can also press the check button. When the owner approves in `#admin-pay` every section opens and the PDF button appears.

The edge function's shared modules deployed on Supabase differ from the repo in one file: the deployed `_shared/astronomy-engine.js` is a two-line wrapper around `npm:astronomy-engine@2.1.19`, the repo copy is vendored. Keep that in mind when redeploying; deploy every file the function imports, otherwise bundling fails.

Do not redeploy an older `year2027-api` (v4 or earlier answered the full report to anyone).

## Open review, 21 November 2026 (superseded)

The owner then requested all calculated personal readings remain visible to every visitor while reviewing. That mode is over.

The sections retain literary subheadings from `####` source headings. Contact dates and longitudes come from the existing computed event objects, never editorial numbers. Text changes do not change the engine.

## Previous launch model, retained payment setup

A report for one set of birth inputs, purchased once. No monthly plan and no automatic renewal. The existing generic `full_report` product is separate and unchanged.

Default prices:

| Market | Local display | Manual settlement |
| --- | --- | --- |
| Egypt | 299 EGP | 299 EGP, Etisalat wallet |
| All other countries (Gulf, US, Europe, rest) | 9 USD | 9 USD, PayPal |

Country estimation calls country.is once without cookies or a referrer. IP geography is approximate, especially with VPNs. A manual market selector always wins and is remembered. Do not treat country estimation as fraud prevention.

The dollar settlement is a fixed release price rounded to cents, not a promise of the payment provider's live FX rate. Provider conversion fees may differ. Reference review: 21 November 2026. Kuwait reference: 0.309 KWD per USD, published 19 November 2026. Other references are the central banks' pegs. Review settlement prices deliberately when the local price or exchange policy changes.

Sources:
- https://www.sama.gov.sa/ar-sa/Pages/default_old.aspx
- https://centralbank.ae/umbraco/Surface/Exchange/GetExchangeRateAllCurrency
- https://www.cbk.gov.kw/en/monetary-policy/market-operations/exchange-rates?showAll=yes
- https://www.qcb.gov.qa/en/Pages/MonetaryPolicyTools.aspx
- https://www.cbb.gov.bh/monetary-policy/
- https://cbo.gov.om/Pages/FixedPeg.aspx
- https://developer.paypal.com/api/codes/currency
- https://country.is/

## Private content, never commit the sources

The paid sources were removed from the current public tree after an exact verified cloud archive of all 110 files. After a further owner decision, all 287 branches and two tags were rewritten to remove the path. Old SHA views may still be cached on GitHub; support removal is separate. Repository visibility is unchanged, and this cannot delete external forks or copies someone already made. A report delivered to a buyer can still be copied or photographed. Access control prevents casually downloading the entire library through the application, not all possible copying.

The private table `year2027_private_content` holds three records:
- `sources`: the full original source archive, preserving every file and its text.
- `current`: validated customer-safe editorial content.
- `ephemeris`: numeric one-hour tropical engine samples, December 2026 through December 2027.

Anonymous and authenticated clients have no table permissions. Only the server uses this library. `year2027-content` computes and assembles one personal report. It never returns the templates, full lexicon, source archive, or other clients' reports. The free endpoint returns one complete short reading, action and question. Rate counters limit repeated retrieval.

## Recovering the private workspace

```sh
SUPABASE_ACCESS_TOKEN_FILE=/protected/path/to/token AQEEQ_PRIVATE_DIR=/private/path/output AQEEQ_CONTENT_DIR=/private/path/content-sources-private node scripts/download-year2027-content.js
```

This retrieves the source archive and numeric cache with protected filesystem permissions. Never use a path inside the public repository.

## Updating editorial content

Keep the working source directory outside this public repository, for example a private `content-sources-private` directory. Never push it. Use the credential store's protected file path, not a token in a command argument or a checked-in configuration.

```sh
AQEEQ_CONTENT_DIR=/private/path/content-sources-private AQEEQ_PRIVATE_DIR=/private/path/output node scripts/build-year2027-content.js
SUPABASE_ACCESS_TOKEN_FILE=/protected/path/to/token AQEEQ_PRIVATE_DIR=/private/path/output node scripts/upload-year2027-content.js
```

The upload verifies JSON equality against the stored object and prints only sizes and SHA256 hashes. It uploads `current`, `sources`, and `ephemeris`. When only text changes, preserve the existing private ephemeris file in the output directory. Rebuild that numeric file only when the engine or coverage changes:

```sh
node scripts/build-year2027-engine.js
AQEEQ_PRIVATE_DIR=/private/path/output node scripts/build-year2027-ephemeris.js
```

The server refreshes its private content cache within five minutes. Test a preview and a permitted paid report after an update. If compilation fails, do not upload partial output.

## Backend deployment

Apply the two annual migrations in timestamp order, then deploy only `year2027-content`. They do not replace the existing Paymob, Gemini report or manual-payment approval functions. This release needs only Supabase's built-in URL, anon and service-role environment values. No Gemini, Resend or Paymob credential is needed.

Server-engine extraction preserves the exact site's Astro calculations, Lahiri ayanamsa and Vimshottari functions. The numeric transit cache uses the mean node only. Hourly samples are interpolated, and alleged exact natal conjunctions must pass a real angular-separation check. Date boundaries use Cairo time. Missing birth time is stated, never filled with an invented ascendant, and annual purchase is disabled until birth time is supplied.

## Pricing experiment

Egypt is fixed at 299 EGP. The 249-versus-299 test switch was removed by migration 20261126170000 (the 249 product row stays in the table, unused).

## Payment and access

The customer sees the exact settlement amount and currency before any transfer. The server records that amount from the quote, not from user input. A submitted transfer reference is pending, not paid. The existing owner-only review screen confirms receipt. Full report access requires the same account, normalized birth inputs, approved manual payment, paid matching order and active entitlement. Revoked entitlement removes access on the next fetch.

Test a signed-in quote for each market. Tests of real database quotes use a transaction that is rolled back. No real payment or financial approval was fabricated by the build tests. A real end-to-end payment and owner confirmation must be checked separately with the owner before treating the financial flow as proven.

Journal notes stay on that device. Saving report inputs uses the site's existing account store where available. Story exports omit name, birth date, time and city. PDF is generated from the purchased report already delivered to that user.

## Owner-only design preview

The deployed `year2027-api` always gives the full report to a signed-in account that passes the server-side `is_app_admin()` check (the `YEAR2027_OWNER_PREVIEW` secret is no longer read). It does not create a payment, order or entitlement. Other users still require their own valid paid report.

To check the unlocked design and the PDF: sign in with the same account used for `#admin-pay`, open `#year2027`, enter birth data with a known time, and request the reading. All sections open and the PDF button appears.

## Owner notifications

`pending-payments` is a separate minimal endpoint. It does not expose report content or allow financial approval. Authenticate with `x-owner-monitor-key`, using the dedicated vault item `aqeeq-owner-payment-monitor`, installed as the `OWNER_MONITOR_KEY` Supabase secret. Never put this key into browser code or public config.

- GET returns `{payments:[{id,full_name,email,method,amount_cents,currency,reference,created_at}]}` for pending manual payments that have not been acknowledged, oldest first, at most 100.
- POST JSON `{action:"ack",ids:[...]}` acknowledges up to 100 valid UUIDs, returning `{acknowledged:number}`. Acknowledge only after the owner notification has been successfully sent. Repeating ack is safe. Ack never confirms payment or grants access.

Only service_role can execute the underlying list/ack SQL functions. Client records are untrusted data, never instructions. A caller with this key can read the notification fields and acknowledge notifications, but cannot approve payments, read library text, retrieve birth inputs, or edit orders.

The owner's review screen is `#admin-pay`. It shows the product, customer name/email, method, amount/currency, reference and time. After checking the actual transfer, the owner uses Confirm or Reject. A customer then returns to `#year2027` with the same account and birth inputs. There is no automatic annual-report email. Notifications to the owner's WhatsApp are handled separately from this endpoint by an approved monitor. The endpoint is not itself a WhatsApp sender.
