-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.aesc_profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to update all profiles (for payment status management)
CREATE POLICY "Admins can update all profiles"
ON public.aesc_profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));