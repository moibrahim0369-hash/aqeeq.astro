// عقيق أسترو — اتصال Supabase للموقع (مفتاح publishable فقط، آمن للظهور في المتصفح)
// ملاحظة: الإصدار مثبّت عمداً حتى لا يتغير سلوك الموقع بدون علمك.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

const SUPABASE_URL = 'https://trcveoewbxqzhhvzawxy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_48pQKHVWg0AXYDRlcNH-HQ_iRyfDMdC';

// PKCE: روابط التأكيد وإعادة التعيين ترجع بـ ?code= (وليس #access_token)،
// فلا تتعارض مع تنقل الموقع المبني على #hash.
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// تسجيل الحضور اليومي (Streak).
// الهوية تُؤخذ من جلسة الدخول داخل قاعدة البيانات، فلا نرسل user id أبداً.
// يرجع { status: 'success' | 'already_checked_in', ... } أو null عند الفشل / عدم تسجيل الدخول.
export async function handleDailyStreak(levelName, frequency, emotion = null) {
  try {
    const { data, error } = await supabase.rpc('process_daily_check_in', {
      p_level_name: levelName,
      p_frequency: frequency,
      p_emotion: emotion,
    });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('خطأ في تسجيل الـ Streak:', err.message);
    return null;
  }
}
