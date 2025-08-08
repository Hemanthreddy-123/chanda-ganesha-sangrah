-- Create the four admin accounts as pre-approved profiles
-- These will be ready for the actual users to sign up with these specific emails
INSERT INTO public.profiles (
  user_id,
  name,
  email,
  role,
  status,
  approved_at,
  created_at,
  updated_at
) VALUES 
(gen_random_uuid(), 'Mukkamalla Manohar Reddy', 'manoharreddy.mukkamalla@temple-admin.com', 'admin', 'approved', now(), now(), now()),
(gen_random_uuid(), 'Ravilla Balaji', 'balaji.ravilla@temple-admin.com', 'admin', 'approved', now(), now(), now()),
(gen_random_uuid(), 'Siddavatam Harsha', 'harsha.siddavatam@temple-admin.com', 'admin', 'approved', now(), now(), now()),
(gen_random_uuid(), 'Chagam Madhu Reddy', 'madhu.chagam@temple-admin.com', 'admin', 'approved', now(), now(), now());

-- Create a reference table for admin credentials (for your records)
CREATE TABLE IF NOT EXISTS public.admin_credentials_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  temp_password text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  notes text DEFAULT 'Initial admin setup - these users need to sign up with these exact credentials'
);

-- Insert the credentials for reference
INSERT INTO public.admin_credentials_reference (name, email, temp_password) VALUES
('Mukkamalla Manohar Reddy', 'manoharreddy.mukkamalla@temple-admin.com', 'MR_Temple_2024!@#'),
('Ravilla Balaji', 'balaji.ravilla@temple-admin.com', 'RB_Admin_Secure$567'),
('Siddavatam Harsha', 'harsha.siddavatam@temple-admin.com', 'SH_Temple_Pass&890'),
('Chagam Madhu Reddy', 'madhu.chagam@temple-admin.com', 'CM_Reddy_Key%123');

-- Enable RLS on the credentials reference table
ALTER TABLE public.admin_credentials_reference ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view credentials
CREATE POLICY "Only authenticated users can view admin credentials"
ON public.admin_credentials_reference
FOR SELECT
TO authenticated
USING (true);