-- Create the four admin accounts with unique credentials
-- Generate UUIDs for each admin
WITH admin_users AS (
  SELECT 
    gen_random_uuid() as user_id,
    'manoharreddy.mukkamalla@temple-admin.com' as email,
    'Mukkamalla Manohar Reddy' as name,
    'MR_Temple_2024!@#' as temp_password
  UNION ALL
  SELECT 
    gen_random_uuid() as user_id,
    'balaji.ravilla@temple-admin.com' as email,
    'Ravilla Balaji' as name,
    'RB_Admin_Secure$567'
  UNION ALL
  SELECT 
    gen_random_uuid() as user_id,
    'harsha.siddavatam@temple-admin.com' as email,
    'Siddavatam Harsha' as name,
    'SH_Temple_Pass&890'
  UNION ALL
  SELECT 
    gen_random_uuid() as user_id,
    'madhu.chagam@temple-admin.com' as email,
    'Chagam Madhu Reddy' as name,
    'CM_Reddy_Key%123'
)
INSERT INTO public.profiles (
  user_id,
  name,
  email,
  role,
  status,
  approved_at,
  approved_by,
  created_at,
  updated_at
)
SELECT 
  user_id,
  name,
  email,
  'admin',
  'approved',
  now(),
  user_id, -- Self-approved for initial setup
  now(),
  now()
FROM admin_users;

-- Create a reference table for admin credentials (for your records)
CREATE TABLE IF NOT EXISTS public.admin_credentials_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  temp_password text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  notes text DEFAULT 'Initial admin setup - password must be changed on first login'
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