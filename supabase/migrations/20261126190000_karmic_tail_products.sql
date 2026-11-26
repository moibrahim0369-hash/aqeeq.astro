-- Karmic tail purchase: two product rows only. Egypt 199 EGP (wallet), other countries 7 USD (PayPal).
-- Orders use the existing submit_manual_payment and admin_review_manual_payment; no function changes.
-- Not applied until approved.
begin;
insert into public.products(code,name_ar,amount_cents,currency,active,access_days) values
 ('karmic_tail_egp_199','الذيل الكارمي',19900,'EGP',true,null),
 ('karmic_tail_usd_7','الذيل الكارمي',700,'USD',true,null)
on conflict(code) do nothing;
commit;
