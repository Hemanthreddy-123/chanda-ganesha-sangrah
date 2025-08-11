-- Create bookcash table for written entries
CREATE TABLE public.bookcash (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  admin_name TEXT NOT NULL,
  person_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookcash ENABLE ROW LEVEL SECURITY;

-- Create policies for bookcash
CREATE POLICY "Authenticated admins can manage bookcash entries" 
ON public.bookcash 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Public can view bookcash entries" 
ON public.bookcash 
FOR SELECT 
USING (true);

-- Simplify persons table - remove unnecessary fields
ALTER TABLE public.persons DROP COLUMN IF EXISTS address;
ALTER TABLE public.persons DROP COLUMN IF EXISTS phone_number;

-- Update payment_method to be more specific
ALTER TABLE public.persons ALTER COLUMN payment_method SET DEFAULT 'cash';

-- Add trigger for updated_at
CREATE TRIGGER update_bookcash_updated_at
BEFORE UPDATE ON public.bookcash
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();