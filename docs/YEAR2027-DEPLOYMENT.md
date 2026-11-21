# Annual report release and private editorial workflow

## Current model

A report for one set of birth inputs, purchased once. No monthly plan and no automatic renewal. The existing generic `full_report` product is separate and unchanged.

Default prices:

| Market | Local display | Manual settlement |
| --- | --- | --- |
| Egypt | 299 EGP | 299 EGP, Etisalat wallet |
| Saudi Arabia | 39 SAR | 10.40 USD, PayPal |
| UAE | 39 AED | 10.62 USD, PayPal |
| Kuwait | 3.5 KWD | 11.33 USD, PayPal |
| Qatar | 39 QAR | 10.71 USD, PayPal |
| Bahrain | 4 BHD | 10.64 USD, PayPal |
| Oman | 4 OMR | 10.40 USD, PayPal |
| International | 14.99 USD | 14.99 USD, PayPal |

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

Egypt defaults to 299 EGP. The optional 249-versus-299 test is OFF. Enable only after a deliberate owner decision by setting `year2027_settings.eg_price_test=true`. The server assigns stable account cohorts. It does not accept an arbitrary amount from the browser. The quote is bound to the account and expires after 24 hours. Existing fixed quotes preserve their exact amount until expiration, unless a product price changes, in which case submission fails closed.

## Payment and access

The customer sees the exact settlement amount and currency before any transfer. The server records that amount from the quote, not from user input. A submitted transfer reference is pending, not paid. The existing owner-only review screen confirms receipt. Full report access requires the same account, normalized birth inputs, approved manual payment, paid matching order and active entitlement. Revoked entitlement removes access on the next fetch.

Test a signed-in quote for each market. Tests of real database quotes use a transaction that is rolled back. No real payment or financial approval was fabricated by the build tests. A real end-to-end payment and owner confirmation must be checked separately with the owner before treating the financial flow as proven.

Journal notes stay on that device. Saving report inputs uses the site's existing account store where available. Story exports omit name, birth date, time and city. PDF is generated from the purchased report already delivered to that user.
