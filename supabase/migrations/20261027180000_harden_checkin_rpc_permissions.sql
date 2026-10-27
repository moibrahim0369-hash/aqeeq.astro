-- Harden daily check-in RPC permissions and reduce avoidable FK lookup costs.
-- Keep compatibility for clients that still call the UUID overload, but bind the
-- requested user to auth.uid() so SECURITY DEFINER cannot be used to impersonate users.
CREATE OR REPLACE FUNCTION public.process_daily_check_in(
  p_user_id uuid,
  p_level_name text,
  p_frequency integer,
  p_emotion text DEFAULT NULL
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_today date := (now() at time zone 'Africa/Cairo')::date;
    v_last_date date;
    v_curr_streak int := 0;
    v_long_streak int := 0;
BEGIN
    IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
        RAISE EXCEPTION 'not_authorized' USING ERRCODE = '42501';
    END IF;

    IF p_level_name IS NULL OR length(btrim(p_level_name)) = 0 OR length(p_level_name) > 100 THEN
        RAISE EXCEPTION 'invalid_level_name' USING ERRCODE = '22023';
    END IF;
    IF p_frequency IS NULL OR p_frequency < 1 OR p_frequency > 1000 THEN
        RAISE EXCEPTION 'invalid_frequency' USING ERRCODE = '22023';
    END IF;
    IF p_emotion IS NOT NULL AND length(p_emotion) > 500 THEN
        RAISE EXCEPTION 'emotion_too_long' USING ERRCODE = '22023';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'profile_missing' USING ERRCODE = '23503';
    END IF;

    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, total_check_ins)
    VALUES (p_user_id, 0, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    SELECT last_check_in_date, COALESCE(current_streak, 0), COALESCE(longest_streak, 0)
      INTO v_last_date, v_curr_streak, v_long_streak
    FROM public.user_streaks
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF v_last_date = v_today THEN
        RETURN json_build_object('status', 'already_checked_in', 'streak', v_curr_streak);
    END IF;

    INSERT INTO public.hawkins_daily_checkins (user_id, check_in_date, level_name, frequency_hz, emotion_logged)
    VALUES (p_user_id, v_today, btrim(p_level_name), p_frequency, NULLIF(btrim(p_emotion), ''))
    ON CONFLICT (user_id, check_in_date) DO NOTHING;

    IF NOT FOUND THEN
        RETURN json_build_object('status', 'already_checked_in', 'streak', v_curr_streak);
    END IF;

    IF v_last_date = v_today - 1 THEN
        v_curr_streak := v_curr_streak + 1;
    ELSE
        v_curr_streak := 1;
    END IF;
    IF v_curr_streak > v_long_streak THEN
        v_long_streak := v_curr_streak;
    END IF;

    UPDATE public.user_streaks
       SET current_streak = v_curr_streak,
           longest_streak = v_long_streak,
           last_check_in_date = v_today,
           total_check_ins = COALESCE(total_check_ins, 0) + 1,
           updated_at = now()
     WHERE user_id = p_user_id;

    RETURN json_build_object('status', 'success', 'current_streak', v_curr_streak, 'longest_streak', v_long_streak);
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.process_daily_check_in(uuid, text, integer, text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.process_daily_check_in(uuid, text, integer, text)
  TO authenticated, service_role;

-- The text overload derives the user ID from auth.uid(); allow signed-in users only.
ALTER FUNCTION public.process_daily_check_in(text, integer, text)
  SET search_path = '';
REVOKE EXECUTE ON FUNCTION public.process_daily_check_in(text, integer, text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.process_daily_check_in(text, integer, text)
  TO authenticated, service_role;

-- Cover the foreign keys flagged by the database performance advisor.
CREATE INDEX IF NOT EXISTS orders_product_code_idx
  ON public.orders (product_code);
CREATE INDEX IF NOT EXISTS payment_events_order_id_idx
  ON public.payment_events (order_id);
