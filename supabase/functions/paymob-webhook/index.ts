import { createClient } from "npm:@supabase/supabase-js@2";

// Paymob "Transaction processed" callback. Public endpoint (verify_jwt = false): the ONLY trust anchor is the HMAC.
const HMAC_SECRET = Deno.env.get("PAYMOB_HMAC_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const HMAC_FIELDS = [
  "amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction", "id",
  "integration_id", "is_3d_secure", "is_auth", "is_capture", "is_refunded", "is_standalone_payment",
  "is_voided", "order.id", "owner", "pending", "source_data.pan", "source_data.sub_type",
  "source_data.type", "success",
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const enc = new TextEncoder();

// deno-lint-ignore no-explicit-any
const pick = (obj: any, path: string) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

// deno-lint-ignore no-explicit-any
function concat(obj: any, nullAs: string): string {
  return HMAC_FIELDS.map((p) => {
    const v = pick(obj, p);
    return v === null || v === undefined ? nullAs : String(v);
  }).join("");
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// deno-lint-ignore no-explicit-any
async function verify(obj: any, received: string): Promise<boolean> {
  if (!HMAC_SECRET || !/^[0-9a-f]{128}$/i.test(received)) return false;
  const want = received.toLowerCase();
  for (const nullAs of ["", "null"]) {
    if (safeEqual(await hmacHex(HMAC_SECRET, concat(obj, nullAs)), want)) return true;
  }
  return false;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!HMAC_SECRET) {
    console.error("PAYMOB_HMAC_SECRET is not set; refusing callbacks");
    return json({ error: "not_configured" }, 503);
  }

  const received = new URL(req.url).searchParams.get("hmac") ?? "";
  // deno-lint-ignore no-explicit-any
  let body: any;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return json({ error: "bad_json" }, 400);
  }
  const obj = body?.obj;
  if (!obj || typeof obj !== "object") return json({ error: "bad_payload" }, 400);

  if (!(await verify(obj, received))) {
    console.error("HMAC mismatch for callback id", String(obj?.id ?? "?").slice(0, 40));
    return json({ error: "invalid_hmac" }, 401);
  }
  if (body.type !== "TRANSACTION") return json({ ok: true, ignored: body.type ?? "unknown" });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const eventId = String(obj.id);
  const orderRef = String(obj.order?.merchant_order_id ?? "");
  const paid = obj.success === true && obj.pending !== true && obj.error_occured !== true &&
    obj.is_voided !== true && obj.is_refunded !== true && !(obj.is_auth === true && obj.is_capture !== true);

  if (!paid) {
    const { error } = await admin.from("payment_events").upsert(
      {
        // A transaction can notify us while pending/failed and later succeed.
        // Keep non-paid and paid states on distinct idempotency keys.
        provider: "paymob", provider_event_id: `${eventId}:not_paid`, outcome: "not_paid",
        order_id: UUID_RE.test(orderRef) ? orderRef : null, amount_cents: Number.isFinite(Number(obj.amount_cents)) ? Number(obj.amount_cents) : null,
      },
      { onConflict: "provider,provider_event_id", ignoreDuplicates: true },
    );
    if (error) {
      console.error("payment_events insert failed:", error.message);
      return json({ error: "db_error" }, 500);
    }
    return json({ ok: true, result: "not_paid" });
  }

  if (!UUID_RE.test(orderRef)) {
    console.error("paid callback without a valid merchant_order_id, event", eventId);
    return json({ ok: true, result: "no_reference" });
  }

  const { data, error } = await admin.rpc("fulfill_paid_order", {
    p_order_id: orderRef,
    // Do not let an earlier non-paid callback suppress a later successful callback.
    // Repeated successful callbacks still share one stable idempotency key.
    p_event_id: `${eventId}:paid`,
    p_paymob_order_id: Number.isFinite(Number(obj.order?.id)) ? Number(obj.order.id) : null,
    p_amount_cents: Number(obj.amount_cents),
    p_currency: String(obj.currency ?? ""),
  });
  if (error) {
    console.error("fulfill_paid_order failed:", error.message);
    return json({ error: "db_error" }, 500);
  }
  if (data === "amount_mismatch" || data === "unknown_order") {
    console.error("ATTENTION paid callback not applied:", data, "event", eventId);
  }
  return json({ ok: true, result: data });
});
