-- Harden daily check-in RPC permissions and reduce avoidable FK lookup costs.
-- The UUID overload accepts a caller-supplied user ID and does not validate auth.uid(),
-- so it must not be callable by public/anon/authenticated clients.
REVOKE EXECUTE ON FUNCTION public.process_daily_check_in(uuid, text, integer, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_daily_check_in(uuid, text, integer, text)
  TO service_role;
ALTER FUNCTION public.process_daily_check_in(uuid, text, integer, text)
  SET search_path = '';

-- The safe overload derives the user ID from auth.uid(); allow signed-in users only.
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
