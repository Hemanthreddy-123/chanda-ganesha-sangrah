-- Add payment_status and priority_order to people_tracker table
ALTER TABLE people_tracker 
ADD COLUMN payment_status text DEFAULT 'pending'::text,
ADD COLUMN priority_order integer DEFAULT 0;

-- Add payment_status and priority_order to people_management table  
ALTER TABLE people_management
ADD COLUMN payment_status text DEFAULT 'pending'::text,
ADD COLUMN priority_order integer DEFAULT 0;

-- Update existing records to have default priority_order based on amount
UPDATE people_tracker SET priority_order = 
  CASE 
    WHEN amount >= 1000 THEN 1
    WHEN amount >= 500 THEN 2  
    WHEN amount >= 200 THEN 3
    ELSE 4
  END;

UPDATE people_management SET priority_order = 
  CASE 
    WHEN total_donations >= 1000 THEN 1
    WHEN total_donations >= 500 THEN 2
    WHEN total_donations >= 200 THEN 3  
    ELSE 4
  END;