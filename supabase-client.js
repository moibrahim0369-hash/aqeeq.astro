// Supabase client for Aqeeq Astro
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://trcveoewbxqzhhvzawxy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_48pQKHVWg0AXYDRlcNH-HQ_iRyfDMdC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Return the authenticated Supabase session, or null when signed out. */
export async function getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session ?? null;
}

export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Calls the authenticated report Edge Function.
 * The payload must match the deployed Edge Function's expected request schema.
 */
export async function generateAstroReport(payload) {
    const session = await getCurrentSession();
    if (!session?.access_token) {
        throw new Error('لازم تسجل دخولك الأول لإنشاء تقرير الخريطة.');
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-astro-report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(result?.error || 'تعذر إنشاء تقرير الخريطة.');
    }
    if (!result?.success || !Object.prototype.hasOwnProperty.call(result, 'report')) {
        throw new Error('استجابة تقرير الخريطة غير مكتملة.');
    }

    return {
        report: result.report,
        emailSent: Boolean(result.emailSent)
    };
}

/** Render report data as text, never as HTML. */
export function displayAstroReport(element, report) {
    if (!element) throw new Error('عنصر عرض التقرير غير موجود.');
    element.textContent = typeof report === 'string'
        ? report
        : JSON.stringify(report, null, 2);
}

/**
 * Daily check-in. The database function obtains the user from the auth session,
 * so never send p_user_id from the client.
 */
export async function handleDailyStreak(levelName, frequency, emotion) {
    const session = await getCurrentSession();
    if (!session?.user) {
        throw new Error('سجل دخولك قبل تسجيل الحضور اليومي.');
    }

    const { data, error } = await supabase.rpc('process_daily_check_in', {
        p_level_name: levelName,
        p_frequency: frequency,
        p_emotion: emotion
    });

    if (error) throw error;
    return data;
}
