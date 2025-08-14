-- Add payment_status to people_management table
ALTER TABLE public.people_management 
ADD COLUMN payment_status text DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending'));

-- Add priority field for donor ordering
ALTER TABLE public.people_management 
ADD COLUMN priority_order integer DEFAULT 0;

-- Add payment_status to people_tracker table as well
ALTER TABLE public.people_tracker 
ADD COLUMN payment_status text DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending'));

-- Add priority field for donor ordering in people_tracker
ALTER TABLE public.people_tracker 
ADD COLUMN priority_order integer DEFAULT 0;