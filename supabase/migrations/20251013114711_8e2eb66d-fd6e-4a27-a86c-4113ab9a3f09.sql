-- Add INSERT policy for aesc_profiles to allow users to create their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.aesc_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);