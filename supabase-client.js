// استيراد مكتبة Supabase الرسمية عبر CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://trcveoewbxqzhhvzawxy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_48pQKHVWg0AXYDRlcNH-HQ_iRyfDMdC';

// إنشاء كائن الاتصال المتاح للموقع بالكامل
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// دالة فحص وتحديث الـ Streak اليومي
export async function handleDailyStreak(userId, consciousnessLevel, frequency, sephirah) {
    try {
        const { data, error } = await supabase.rpc('process_daily_check_in', {
            p_user_id: userId,
            p_level_name: consciousnessLevel,
            p_frequency: frequency,
            p_sephirah: sephirah
        });

        if (error) throw error;
        return data;
    } catch (err) {
        console.error('خطأ في تسجيل الـ Streak:', err.message);
        return null;
    }
}
