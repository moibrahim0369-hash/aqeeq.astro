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
    if (!["admin", "editor", "writer", "reviewer"].includes(role)) problem(403, "العملية متاحة لأدوار الموسوعة المصرح لها فقط.");
    const actorId = auth.user.id;
    const raw = await req.text();
    if (raw.length > 220000) problem(413, "حجم المادة أكبر من المسموح.");
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { problem(400, "صيغة الطلب غير صحيحة."); }
    const action = clean(body.action, 40);

    if (action === "list_queue") {
      let sourceQuery = admin.from("tarot_sources").select("id,title,source_url,status,created_at,created_by").in("status", ["raw","in_review","approved"]).order("created_at", { ascending: false }).limit(50);
      let materialQuery = admin.from("tarot_materials").select("id,title,card_id,source_id,status,created_at,created_by").in("status", ["raw","organized","drafted"]).order("created_at", { ascending: false }).limit(50);
      let versionQuery = admin.from("tarot_content_versions").select("id,card_id,version,status,source_ids,material_ids,created_at,created_by,tarot_cards!inner(name_ar,name_en)").in("status", ["draft","in_review","approved"]).order("created_at", { ascending: false }).limit(50);
      if (role === "writer") {
        sourceQuery = sourceQuery.eq("created_by", actorId);
        materialQuery = materialQuery.eq("created_by", actorId);
        versionQuery = versionQuery.eq("created_by", actorId);
      }
      const [sourcesResult, materialsResult, versionsResult] = await Promise.all([sourceQuery, materialQuery, versionQuery]);
      if (sourcesResult.error || materialsResult.error || versionsResult.error) problem(503, "تعذر تحميل قائمة المراجعة.");
      return reply(req, { sources: sourcesResult.data ?? [], materials: materialsResult.data ?? [], versions: versionsResult.data ?? [] });
    }

    if (action === "ingest_raw") {
      const title = clean(body.title, 180);
      const rawText = typeof body.rawText === "string" ? body.rawText.trim() : "";
      const sourceTitle = clean(body.sourceTitle, 180) || "ملاحظة داخلية غير موثقة";
      const sourceUrl = clean(body.sourceUrl, 1000);
      const cardId = clean(body.cardId, 100) || null;
      if (!title || !rawText) problem(400, "عنوان المادة والنص الخام مطلوبان.");
      if (rawText.length > 200000) problem(413, "النص الخام أطول من المسموح.");
      if (cardId) {
        const { data: card } = await admin.from("tarot_cards").select("id").eq("id", cardId).maybeSingle();
        if (!card) problem(404, "الورقة غير موجودة في فهرس قاعدة المعرفة. طبّق ترحيل الموسوعة أولًا.");
      }
      const { data: source, error: sourceError } = await admin.from("tarot_sources").insert({
        title: sourceTitle, source_type: sourceUrl ? "website" : "personal_note", source_url: sourceUrl || null, citation: clean(body.citation, 2000) || null, status: "raw", created_by: actorId,
      }).select("id").single();
      if (sourceError || !source) problem(503, "تعذر حفظ سجل المصدر.");
      const { data: material, error } = await admin.from("tarot_materials").insert({
        title, raw_text: rawText, source_id: source.id, card_id: cardId, status: "raw", created_by: actorId, updated_by: actorId,
      }).select("id,status,created_at").single();
      if (error || !material) problem(503, "تعذر حفظ المادة الخام.");
      return reply(req, { material, sourceId: source.id });
    }

    if (action === "get_material") {
      const materialId = clean(body.materialId, 80);
      if (!materialId) problem(400, "معرّف المادة مطلوب.");
      const { data: material, error } = await admin.from("tarot_materials")
        .select("id,title,raw_text,normalized_notes,card_id,source_id,status,created_at")
        .eq("id", materialId).maybeSingle();
      if (error || !material) problem(404, "المادة الخام غير موجودة.");
      const { data: source } = material.source_id
        ? await admin.from("tarot_sources").select("id,title,source_url,citation,status").eq("id", material.source_id).maybeSingle()
        : { data: null };
      return reply(req, { material, source });
    }

    if (action === "organize_material") {
      const materialId = clean(body.materialId, 80);
      const cardId = clean(body.cardId, 100);
      const normalizedNotes = clean(body.normalizedNotes, 12000);
      if (!materialId || !cardId) problem(400, "معرّف المادة والورقة مطلوبان.");
      const { data: card } = await admin.from("tarot_cards").select("id").eq("id", cardId).maybeSingle();
      if (!card) problem(404, "الورقة غير موجودة في فهرس قاعدة المعرفة.");
      const { data, error } = await admin.from("tarot_materials").update({
        card_id: cardId, normalized_notes: normalizedNotes || null, status: "organized",
        updated_by: actorId, updated_at: new Date().toISOString(),
      }).eq("id", materialId).select("id,card_id,status,updated_at").single();
      if (error || !data) problem(503, "تعذر تنظيم المادة وربطها بالورقة.");
      return reply(req, { material: data });
    }

    if (action === "create_draft") {
      const cardId = clean(body.cardId, 100);
      const referenceContent = isObject(body.referenceContent) ? body.referenceContent : {};
      const aqeqContent = isObject(body.aqeqContent) ? body.aqeqContent : {};
      const sourceIds = Array.isArray(body.sourceIds) ? body.sourceIds.filter((id) => typeof id === "string").slice(0, 30) as string[] : [];
      const materialIds = Array.isArray(body.materialIds) ? body.materialIds.filter((id) => typeof id === "string").slice(0, 30) as string[] : [];
      if (!cardId) problem(400, "معرّف الورقة مطلوب.");
      if (!Object.keys(referenceContent).length || !Object.keys(aqeqContent).length) problem(400, "افصل المحتوى المرجعي عن تفسير عقيق أسترو.");
      const { data: card } = await admin.from("tarot_cards").select("id").eq("id", cardId).maybeSingle();
      if (!card) problem(404, "الورقة غير موجودة في فهرس قاعدة المعرفة.");
      if (materialIds.length) {
        const { data: materials } = await admin.from("tarot_materials").select("id,card_id,status").in("id", materialIds);
        if (!materials || materials.length !== materialIds.length || materials.some((item: any) => item.card_id !== cardId || !["organized","drafted"].includes(item.status))) {
          problem(422, "نظّم المواد الخام واربطها بالورقة المختارة قبل إضافتها إلى المسودة.");
        }
      }
      const { data: latest } = await admin.from("tarot_content_versions").select("version").eq("card_id", cardId).order("version", { ascending: false }).limit(1).maybeSingle();
      const version = (latest?.version ?? 0) + 1;
      const { data, error } = await admin.from("tarot_content_versions").insert({
        card_id: cardId, version, reference_content: referenceContent, aqeq_content: aqeqContent,
        source_ids: sourceIds, material_ids: materialIds, status: "draft", provenance: sourceIds.length ? "mixed" : "aqeq_original",
        created_by: actorId, change_summary: clean(body.changeSummary, 500),
      }).select("id,card_id,version,status,created_at").single();
      if (error || !data) problem(503, "تعذر إنشاء إصدار المسودة.");
      return reply(req, { version: data });
    }

    if (action === "approve_source") {
      if (role !== "admin") problem(403, "اعتماد المصدر متاح للمدير فقط.");
      const sourceId = clean(body.sourceId, 80);
      if (!sourceId) problem(400, "معرّف المصدر مطلوب.");
      const { data: source, error: sourceReadError } = await admin.from("tarot_sources").select("id,source_url,citation,status").eq("id", sourceId).maybeSingle();
      if (sourceReadError || !source) problem(404, "المصدر غير موجود.");
      if (!source.source_url && !source.citation) problem(422, "أضف رابطًا أو توثيقًا ببليوغرافيًا قبل اعتماد المصدر.");
      const { error } = await admin.from("tarot_sources").update({ status: "approved", updated_at: new Date().toISOString() }).eq("id", sourceId);
      if (error) problem(503, "تعذر اعتماد المصدر.");
      return reply(req, { sourceId, status: "approved" });
    }

    const versionId = clean(body.versionId, 80);
    if (!versionId) problem(400, "معرّف الإصدار مطلوب لهذه العملية.");
    const { data: versionRow, error: versionError } = await admin.from("tarot_content_versions")
      .select("id,card_id,version,status,source_ids,material_ids,approved_by,approved_at,reference_content,aqeq_content,change_summary").eq("id", versionId).maybeSingle();
    if (versionError || !versionRow) problem(404, "الإصدار غير موجود.");

    if (action === "get_version") {
      return reply(req, { version: versionRow });
    }

    if (action === "update_draft") {
      if (!["draft", "rejected"].includes(versionRow.status)) problem(409, "يمكن تعديل المسودة قبل المراجعة أو بعد إعادتها للتعديل فقط.");
      const referenceContent = isObject(body.referenceContent) ? body.referenceContent : {};
      const aqeqContent = isObject(body.aqeqContent) ? body.aqeqContent : {};
      const sourceIds = Array.isArray(body.sourceIds) ? body.sourceIds.filter((id) => typeof id === "string").slice(0, 30) as string[] : [];
      const materialIds = Array.isArray(body.materialIds) ? body.materialIds.filter((id) => typeof id === "string").slice(0, 30) as string[] : [];
      if (!Object.keys(referenceContent).length || !Object.keys(aqeqContent).length) problem(400, "افصل المحتوى المرجعي عن تفسير عقيق أسترو.");
      if (materialIds.length) {
        const { data: materials } = await admin.from("tarot_materials").select("id,card_id,status").in("id", materialIds);
        if (!materials || materials.length !== materialIds.length || materials.some((item: any) => item.card_id !== versionRow.card_id || !["organized","drafted"].includes(item.status))) {
          problem(422, "نظّم المواد الخام واربطها بالورقة المختارة قبل إضافتها إلى المسودة.");
        }
      }
      const { data, error } = await admin.from("tarot_content_versions").update({
        reference_content: referenceContent, aqeq_content: aqeqContent, source_ids: sourceIds, material_ids: materialIds,
        provenance: sourceIds.length ? "mixed" : "aqeq_original", status: "draft",
        change_summary: clean(body.changeSummary, 500),
      }).eq("id", versionId).select("id,card_id,version,status,created_at").single();
      if (error || !data) problem(503, "تعذر تحديث المسودة.");
      return reply(req, { version: data });
    }

    if (action === "submit_review") {
      if (!["draft", "rejected"].includes(versionRow.status)) problem(409, "لا يمكن إرسال الإصدار للمراجعة من حالته الحالية.");
      const { error } = await admin.from("tarot_content_versions").update({ status: "in_review", reviewed_by: actorId, reviewed_at: new Date().toISOString() }).eq("id", versionId);
      if (error) problem(503, "تعذر إرسال الإصدار للمراجعة.");
      const { error: auditError } = await admin.from("tarot_reviews").insert({ version_id: versionId, reviewer_id: actorId, decision: "submitted", notes: clean(body.notes, 3000) });
      if (auditError) {
        await admin.from("tarot_content_versions").update({ status: versionRow.status, reviewed_by: null, reviewed_at: null }).eq("id", versionId);
        problem(503, "تعذر حفظ سجل المراجعة؛ أُعيد الإصدار إلى حالته السابقة.");
      }
      return reply(req, { versionId, status: "in_review" });
    }

    if (action === "approve" || action === "publish") {
      if (action === "approve" && !["reviewer", "admin"].includes(role)) problem(403, "اعتماد المحتوى متاح للمراجع أو المدير فقط.");
      if (action === "publish" && role !== "admin") problem(403, "نشر المحتوى متاح للمدير فقط.");
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
        const { error: auditError } = await admin.from("tarot_reviews").insert({ version_id: versionId, reviewer_id: actorId, decision: "approved", notes: clean(body.notes, 3000) });
        if (auditError) {
          await admin.from("tarot_content_versions").update({ status: "in_review", approved_by: null, approved_at: null }).eq("id", versionId);
          problem(503, "تعذر حفظ سجل الاعتماد؛ أُعيد الإصدار للمراجعة.");
        }
        return reply(req, { versionId, status: "approved" });
      }
      if (versionRow.status !== "approved" || !versionRow.approved_by || !versionRow.approved_at) problem(409, "لا يمكن نشر محتوى غير معتمد.");
      const { data: publishSources } = await admin.from("tarot_sources").select("id,status").in("id", versionRow.source_ids ?? []);
      if (!publishSources || publishSources.length !== versionRow.source_ids?.length || publishSources.some((source: any) => source.status !== "approved")) {
        problem(422, "كل المصادر يجب أن تظل معتمدة وقت النشر.");
      }
      const { error: publishError } = await admin.from("tarot_content_versions").update({ status: "published", published_at: new Date().toISOString() }).eq("id", versionId);
      if (publishError) problem(503, "تعذر نشر الإصدار.");
      const { error: cardError } = await admin.from("tarot_cards").update({ status: "published", updated_by: actorId, updated_at: new Date().toISOString() }).eq("id", versionRow.card_id);
      if (cardError) {
        await admin.from("tarot_content_versions").update({ status: "approved", published_at: null }).eq("id", versionId);
        problem(503, "تعذر تحديث حالة الورقة؛ أُعيد الإصدار إلى حالة الاعتماد.");
      }
      return reply(req, { versionId, cardId: versionRow.card_id, status: "published" });
    }

    if (action === "reject") {
      if (!["reviewer", "admin"].includes(role)) problem(403, "رفض الإصدار متاح للمراجع أو المدير فقط.");
      const { error } = await admin.from("tarot_content_versions").update({ status: "rejected" }).eq("id", versionId);
      if (error) problem(503, "تعذر رفض الإصدار.");
      const { error: auditError } = await admin.from("tarot_reviews").insert({ version_id: versionId, reviewer_id: actorId, decision: "rejected", notes: clean(body.notes, 3000) });
      if (auditError) {
        await admin.from("tarot_content_versions").update({ status: versionRow.status }).eq("id", versionId);
        problem(503, "تعذر حفظ سجل الرفض؛ أُعيد الإصدار إلى حالته السابقة.");
      }
      return reply(req, { versionId, status: "rejected" });
    }

    problem(400, "العملية المطلوبة غير معروفة.");
  } catch (error) {
    const status = Number((error as any)?.status) || 500;
    return reply(req, { error: status < 500 ? String((error as Error).message) : "تعذر إكمال العملية. راجع إعدادات الخادم وسجل الإدارة." }, status);
  }
});
