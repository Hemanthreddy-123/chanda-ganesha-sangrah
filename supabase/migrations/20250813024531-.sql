-- Update people_management table to include UPI ID
ALTER TABLE people_management 
ADD COLUMN upi_id TEXT,
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS emergency_contact,
DROP COLUMN IF EXISTS emergency_phone,
DROP COLUMN IF EXISTS notes,
DROP COLUMN IF EXISTS registration_date,
DROP COLUMN IF EXISTS last_donation_date;

-- Update donations table to include items donated
ALTER TABLE donations 
ADD COLUMN items_donated TEXT;

-- Update financial_transactions table to include items donated for consistency
ALTER TABLE financial_transactions 
ADD COLUMN items_donated TEXT;