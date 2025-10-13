-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create membership tier enum
CREATE TYPE public.membership_tier AS ENUM ('basic', 'professional', 'enterprise');

-- Create profiles table
CREATE TABLE public.aesc_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.aesc_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.aesc_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.aesc_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create user roles table
CREATE TABLE public.aesc_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.aesc_user_roles ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.aesc_user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.aesc_user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create membership plans table
CREATE TABLE public.aesc_membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier membership_tier NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  billing_period TEXT NOT NULL DEFAULT 'monthly',
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.aesc_membership_plans ENABLE ROW LEVEL SECURITY;

-- Membership plans policies (public read)
CREATE POLICY "Anyone can view active membership plans"
  ON public.aesc_membership_plans FOR SELECT
  USING (is_active = true);

-- Create user memberships table
CREATE TABLE public.aesc_user_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.aesc_membership_plans(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, plan_id)
);

ALTER TABLE public.aesc_user_memberships ENABLE ROW LEVEL SECURITY;

-- User memberships policies
CREATE POLICY "Users can view their own memberships"
  ON public.aesc_user_memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memberships"
  ON public.aesc_user_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.aesc_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default 'user' role
  INSERT INTO public.aesc_user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_aesc_profiles_updated_at
  BEFORE UPDATE ON public.aesc_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aesc_membership_plans_updated_at
  BEFORE UPDATE ON public.aesc_membership_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aesc_user_memberships_updated_at
  BEFORE UPDATE ON public.aesc_user_memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample membership plans
INSERT INTO public.aesc_membership_plans (name, tier, description, price, features) VALUES
  ('Basic Plan', 'basic', 'Perfect for individuals getting started', 9.99, 
   '["Access to basic features", "Email support", "Community forum access"]'::jsonb),
  ('Professional Plan', 'professional', 'For professionals and small teams', 29.99,
   '["All basic features", "Priority email support", "Advanced analytics", "API access", "Team collaboration tools"]'::jsonb),
  ('Enterprise Plan', 'enterprise', 'For large organizations with custom needs', 99.99,
   '["All professional features", "24/7 phone support", "Custom integrations", "Dedicated account manager", "SLA guarantee", "Advanced security features"]'::jsonb);