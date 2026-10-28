import { createClient } from "npm:@supabase/supabase-js@2";

const URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ORIGINS = (Deno.env.get("TAROT_ALLOWED_ORIGINS") ?? "https://moibrahim0369-hash.github.io,http://localhost:3000,http://127.0.0.1:5500")
  .split(",").map((item) => item.trim()).filter(Boolean);

function headers(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json",
  };
}
function reply(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headers(req) });
}
function problem(status: number, message: string): never {
  throw Object.assign(new Error(message), { status });
}
function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: headers(req) });
  if (req.method !== "POST") return reply(req, { error: "الطريقة غير مدعومة." }, 405);
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return reply(req, { error: "سجّل الدخول أولًا." }, 401);

  const userClient = createClient(URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const admin = createClient(URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const { data: auth, error: authError } = await userClient.auth.getUser(token);
    if (authError || !auth.user) problem(401, "جلسة الدخول غير صالحة.");
    const role = auth.user.app_metadata?.role;
    if (!["admin", "editor"].includes(role)) problem(403, "العملية متاحة للمحررين المصرح لهم فقط.");
    const actorId = auth.user.id;
    const raw = await req.text();
    if (raw.length > 220000) problem(413, "حجم المادة أكبر من المسموح.");
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { problem(400, "صيغة الطلب غير صحيحة."); }
    const action = clean(body.action, 40);

    if (action === "ingest_raw") {
      const title = clean(body.title, 180);
      const rawText = typeof body.rawText === "string" ? body.rawText.trim() : "";
      const sourceTitle = clean(body.sourceTitle, 180) || "ملاحظة داخلية غير موثقة";
      const cardId = clean(body.cardId, 100) || null;
      if (!title || !rawText) problem(400, "عنوان المادة والنص الخام مطلوبان.");
      if (rawText.length > 200000) problem(413, "النص الخام أطول من المسموح.");
      if (cardId) {
        const { data: card } = await admin.from("tarot_cards").select("id").eq("id", cardId).maybeSingle();
        if (!card) problem(404, "الورقة غير موجودة في فهرس قاعدة المعرفة. طبّق ترحيل الموسوعة أولًا.");
      }
      const { data: source, error: sourceError } = await admin.from("tarot_sources").insert({
        title: sourceTitle, source_type: "personal_note", status: "raw", created_by: actorId,
      }).select("id").single();
      if (sourceError || !source) problem(503, "تعذر حفظ سجل المصدر.");
      const { data: material, error } = await admin.from("tarot_materials").insert({
        title, raw_text: rawText, source_id: source.id, card_id: cardId, status: "raw", created_by: actorId, updated_by: actorId,
      }).select("id,status,created_at").single();
      if (error || !material) problem(503, "تعذر حفظ المادة الخام.");
      return reply(req, { material, sourceId: source.id });
    }

    if (action === "create_draft") {
      const cardId = clean(body.cardId, 100);
      const referenceContent = isObject(body.referenceContent) ? body.referenceContent : {};
      const aqeqContent = isObject(body.aqeqContent) ? body.aqeqContent : {};
      const sourceIds = Array.isArray(body.sourceIds) ? body.sourceIds.filter((id) => typeof id === "string").slice(0, 30) as string[] : [];
      if (!cardId) problem(400, "معرّف الورقة مطلوب.");
      if (!Object.keys(referenceContent).length || !Object.keys(aqeqContent).length) problem(400, "افصل المحتوى المرجعي عن تفسير عقيق أسترو.");
      const { data: card } = await admin.from("tarot_cards").select("id").eq("id", cardId).maybeSingle();
      if (!card) problem(404, "الورقة غير موجودة في فهرس قاعدة المعرفة.");
      const { data: latest } = await admin.from("tarot_content_versions").select("version").eq("card_id", cardId).order("version", { ascending: false }).limit(1).maybeSingle();
      const version = (latest?.version ?? 0) + 1;
      const { data, error } = await admin.from("tarot_content_versions").insert({
        card_id: cardId, version, reference_content: referenceContent, aqeq_content: aqeqContent,
        source_ids: sourceIds, status: "draft", provenance: sourceIds.length ? "mixed" : "aqeq_original",
        created_by: actorId, change_summary: clean(body.changeSummary, 500),
      }).select("id,card_id,version,status,created_at").single();
      if (error || !data) problem(503, "تعذر إنشاء إصدار المسودة.");
      return reply(req, { version: data });
    }

    const versionId = clean(body.versionId, 80);
    if (!versionId) problem(400, "معرّف الإصدار مطلوب لهذه العملية.");
    const { data: versionRow, error: versionError } = await admin.from("tarot_content_versions")
      .select("id,card_id,version,status,source_ids,approved_by,approved_at").eq("id", versionId).maybeSingle();
    if (versionError || !versionRow) problem(404, "الإصدار غير موجود.");

    if (action === "submit_review") {
      if (!["draft", "rejected"].includes(versionRow.status)) problem(409, "لا يمكن إرسال الإصدار للمراجعة من حالته الحالية.");
      const { error } = await admin.from("tarot_content_versions").update({ status: "in_review", reviewed_by: actorId, reviewed_at: new Date().toISOString() }).eq("id", versionId);
      if (error) problem(503, "تعذر إرسال الإصدار للمراجعة.");
      await admin.from("tarot_reviews").insert({ version_id: versionId, reviewer_id: actorId, decision: "submitted", notes: clean(body.notes, 3000) });
      return reply(req, { versionId, status: "in_review" });
    }

    if (action === "approve" || action === "publish") {
      if (role !== "admin") problem(403, "الاعتماد والنشر متاحان للمدير فقط.");
      if (action === "approve") {
        if (versionRow.status !== "in_review") problem(409, "لا يمكن اعتماد إصدار لم يصل إلى مرحلة المراجعة.");
        if (!versionRow.source_ids?.length) problem(422, "لا يمكن اعتماد محتوى بلا مراجع موثقة.");
        const { data: sources } = await admin.from("tarot_sources").select("id,status").in("id", versionRow.source_ids);
        if (!sources || sources.length !== versionRow.source_ids.length || sources.some((source: any) => source.status !== "approved")) {
          problem(422, "يجب اعتماد كل المصادر المرتبطة قبل اعتماد المحتوى.");
        }
        const now = new Date().toISOString();
        const { error } = await admin.from("tarot_content_versions").update({ status: "approved", approved_by: actorId, approved_at: now, reviewed_by: actorId, reviewed_at: now }).eq("id", versionId);
        if (error) problem(503, "تعذر اعتماد الإصدار.");
        await admin.from("tarot_reviews").insert({ version_id: versionId, reviewer_id: actorId, decision: "approved", notes: clean(body.notes, 3000) });
        return reply(req, { versionId, status: "approved" });
      }
      if (versionRow.status !== "approved" || !versionRow.approved_by || !versionRow.approved_at) problem(409, "لا يمكن نشر محتوى غير معتمد.");
      const { error: publishError } = await admin.from("tarot_content_versions").update({ status: "published", published_at: new Date().toISOString() }).eq("id", versionId);
      if (publishError) problem(503, "تعذر نشر الإصدار.");
      const { error: cardError } = await admin.from("tarot_cards").update({ status: "published", updated_by: actorId, updated_at: new Date().toISOString() }).eq("id", versionRow.card_id);
      if (cardError) problem(503, "تم نشر الإصدار لكن تعذر تحديث حالة الورقة؛ راجع سجل الإدارة.");
      return reply(req, { versionId, cardId: versionRow.card_id, status: "published" });
    }

    if (action === "reject") {
      if (role !== "admin") problem(403, "رفض الإصدار متاح للمدير فقط.");
      const { error } = await admin.from("tarot_content_versions").update({ status: "rejected" }).eq("id", versionId);
      if (error) problem(503, "تعذر رفض الإصدار.");
      await admin.from("tarot_reviews").insert({ version_id: versionId, reviewer_id: actorId, decision: "rejected", notes: clean(body.notes, 3000) });
      return reply(req, { versionId, status: "rejected" });
    }

    problem(400, "العملية المطلوبة غير معروفة.");
  } catch (error) {
    const status = Number((error as any)?.status) || 500;
    return reply(req, { error: status < 500 ? String((error as Error).message) : "تعذر إكمال العملية. راجع إعدادات الخادم وسجل الإدارة." }, status);
  }
});
