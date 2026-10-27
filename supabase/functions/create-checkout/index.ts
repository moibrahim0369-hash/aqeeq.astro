import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SECRET_KEY = Deno.env.get("PAYMOB_SECRET_KEY") ?? "";
const PUBLIC_KEY = Deno.env.get("PAYMOB_PUBLIC_KEY") ?? "";
const INTEGRATION_IDS = (Deno.env.get("PAYMOB_INTEGRATION_IDS") ?? "").split(",").map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0);
const SITE_URL = (Deno.env.get("SITE_URL") ?? "").replace(/#.*$/, "").replace(/\?.*$/, "");
const BASE_ALLOW = ["https://accept.paymob.com", "https://uae.paymob.com", "https://ksa.paymob.com", "https://oman.paymob.com"];
const BASE = (Deno.env.get("PAYMOB_BASE_URL") ?? "https://accept.paymob.com").replace(/\/+$/, "");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  if (!SECRET_KEY || !PUBLIC_KEY || !INTEGRATION_IDS.length || !SITE_URL.startsWith("https://") || !BASE_ALLOW.includes(BASE)) {
    return json({ error: "الدفع غير مفعّل بعد." }, 503);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: u, error: uErr } = await admin.auth.getUser(token);
  if (uErr || !u?.user) return json({ error: "سجّل الدخول أولاً." }, 401);
  const user = u.user;

  // deno-lint-ignore no-explicit-any
  let body: any = {};
  try { body = await req.json(); } catch { /* empty body ok */ }
  const code = typeof body?.product === "string" ? body.product : "full_report";
  const phone = typeof body?.phone === "string" && /^\+?[0-9]{8,15}$/.test(body.phone) ? body.phone : "NA";

  const { data: product } = await admin.from("products").select("code,name_ar,amount_cents,currency,active").eq("code", code).maybeSingle();
  if (!product || !product.active || !product.amount_cents || product.amount_cents <= 0) {
    return json({ error: "هذا المنتج غير متاح للشراء حالياً." }, 409);
  }

  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await admin.from("orders").select("id", { count: "exact", head: true })
    .eq("user_id", user.id).eq("status", "pending").gte("created_at", since);
  if ((count ?? 0) >= 5) return json({ error: "محاولات كثيرة. حاول بعد قليل." }, 429);

  const { data: order, error: oErr } = await admin.from("orders").insert({
    user_id: user.id, product_code: product.code, amount_cents: product.amount_cents, currency: product.currency,
  }).select("id").single();
  if (oErr || !order) {
    console.error("order insert failed:", oErr?.message);
    return json({ error: "تعذّر إنشاء الطلب." }, 500);
  }

  const fail = async (msg: string, status = 502) => {
    await admin.from("orders").update({ status: "cancelled" }).eq("id", order.id).eq("status", "pending");
    return json({ error: msg }, status);
  };

  const email = user.email ?? "NA";
  const intention = {
    amount: product.amount_cents,
    currency: product.currency,
    payment_methods: INTEGRATION_IDS,
    items: [{ name: product.name_ar.slice(0, 50), amount: product.amount_cents, description: product.name_ar.slice(0, 100), quantity: 1 }],
    billing_data: {
      first_name: "Akeek", last_name: "Customer", email, phone_number: phone,
      apartment: "NA", floor: "NA", street: "NA", building: "NA", shipping_method: "NA",
      postal_code: "NA", city: "NA", country: "NA", state: "NA",
    },
    special_reference: order.id,
    notification_url: `${SUPABASE_URL}/functions/v1/paymob-webhook`,
    redirection_url: `${SITE_URL}?order=${order.id}#account`,
    extras: { user_id: user.id },
  };

  let res: Response;
  try {
    res = await fetch(`${BASE}/v1/intention/`, {
      method: "POST",
      headers: { Authorization: `Token ${SECRET_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(intention),
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {
    console.error("paymob fetch failed:", (e as Error).message);
    return await fail("تعذّر الاتصال ببوابة الدفع.");
  }
  // deno-lint-ignore no-explicit-any
  const out: any = await res.json().catch(() => ({}));
  if (!res.ok || typeof out?.client_secret !== "string") {
    console.error("paymob intention rejected:", res.status, JSON.stringify(out).slice(0, 300));
    return await fail("رفضت بوابة الدفع الطلب.");
  }

  await admin.from("orders").update({ paymob_intention_id: out.id ? String(out.id) : null }).eq("id", order.id);
  const checkoutUrl = `${BASE}/unifiedcheckout/?publicKey=${encodeURIComponent(PUBLIC_KEY)}&clientSecret=${encodeURIComponent(out.client_secret)}`;
  return json({ checkoutUrl, orderId: order.id });
});
