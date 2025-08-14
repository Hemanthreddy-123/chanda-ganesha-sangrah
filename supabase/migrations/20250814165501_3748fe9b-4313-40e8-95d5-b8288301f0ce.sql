-- Add priority_order column to donations table for donor priority management
ALTER TABLE public.donations 
ADD COLUMN priority_order integer DEFAULT 1;

-- Create index for better performance
CREATE INDEX idx_donations_priority_order ON public.donations(priority_order);

-- Update existing records to have default priority
UPDATE public.donations 
SET priority_order = 1 
WHERE priority_order IS NULL;