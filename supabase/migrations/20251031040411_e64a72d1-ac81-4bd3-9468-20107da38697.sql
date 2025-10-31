-- Add RLS policies for admins to manage user roles
CREATE POLICY "Admins can insert user roles"
ON public.aesc_user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
ON public.aesc_user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
ON public.aesc_user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));