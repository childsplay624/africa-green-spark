-- Create audit log table for payment status changes
CREATE TABLE IF NOT EXISTS public.payment_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT NOT NULL,
  changed_by TEXT NOT NULL, -- 'system', 'edge_function', etc.
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on audit log
ALTER TABLE public.payment_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view payment audit logs"
ON public.payment_audit_log
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop existing profile update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.aesc_profiles;

-- Create new policy that excludes payment_status from user updates
CREATE POLICY "Users can update own profile except payment status"
ON public.aesc_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Ensure payment_status hasn't changed from current value
  payment_status IS NOT DISTINCT FROM (
    SELECT payment_status FROM aesc_profiles WHERE id = auth.uid()
  )
);

-- Drop existing policy on payment_records if it exists
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payment_records;

-- Only service role can insert payment records (enforced via edge functions)
CREATE POLICY "Only service role can insert payment records"
ON public.payment_records
FOR INSERT
TO service_role
WITH CHECK (true);

-- Add index for faster audit log queries
CREATE INDEX IF NOT EXISTS idx_payment_audit_user_id ON public.payment_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_created_at ON public.payment_audit_log(created_at DESC);