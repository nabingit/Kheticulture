/*
  # Custom Domains with Entri Integration
  
  1. New Tables
    - `custom_domains`: Stores custom domain records for users
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `domain` (text, unique)
      - `entri_domain_id` (text)
      - `status` (text)
      - `verification_code` (text)
      - `verified_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `domain_settings`: Stores settings for custom domains
      - `domain_id` (uuid, references custom_domains)
      - `show_branding` (boolean)
      - `primary_color` (text)
      - `theme` (text)
      - `custom_css` (text)
  
  2. Security
    - Enable RLS on both tables
    - Add appropriate policies for domain management
    - Add trigger for updating timestamps
    
  3. Functions
    - Add helper function for domain verification
*/

-- Create custom domains table
CREATE TABLE IF NOT EXISTS custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  entri_domain_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  verification_code TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

COMMENT ON TABLE custom_domains IS 'Stores custom domain records for farmers on the platform';
COMMENT ON COLUMN custom_domains.entri_domain_id IS 'Reference ID from Entri domain service';
COMMENT ON COLUMN custom_domains.status IS 'Status of domain verification: pending, verified, failed, or active';
COMMENT ON COLUMN custom_domains.verification_code IS 'Code used for DNS TXT record verification';

-- Create domain settings table
CREATE TABLE IF NOT EXISTS domain_settings (
  domain_id UUID PRIMARY KEY REFERENCES custom_domains(id) ON DELETE CASCADE,
  show_branding BOOLEAN NOT NULL DEFAULT true,
  primary_color TEXT NOT NULL DEFAULT '#22C55E',
  theme TEXT NOT NULL DEFAULT 'light',
  custom_css TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

COMMENT ON TABLE domain_settings IS 'Stores appearance settings for custom domains';

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_domain_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for custom_domains
CREATE TRIGGER update_custom_domains_timestamp
BEFORE UPDATE ON custom_domains
FOR EACH ROW
EXECUTE FUNCTION update_domain_timestamp();

-- Create trigger for domain_settings
CREATE TRIGGER update_domain_settings_timestamp
BEFORE UPDATE ON domain_settings
FOR EACH ROW
EXECUTE FUNCTION update_domain_timestamp();

-- Enable Row Level Security on the tables
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for domain insertion
CREATE POLICY "Users can create their own domains"
ON custom_domains
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND EXISTS (
  SELECT 1 FROM profiles
  WHERE id = auth.uid()
  AND user_type = 'farmer'
));

-- Create policy for domain reading by owner
CREATE POLICY "Users can read their own domains"
ON custom_domains
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for domain updating by owner
CREATE POLICY "Users can update their own domains"
ON custom_domains
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for domain deletion by owner
CREATE POLICY "Users can delete their own domains"
ON custom_domains
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create policies for domain_settings
CREATE POLICY "Users can manage settings for their own domains"
ON domain_settings
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM custom_domains
  WHERE custom_domains.id = domain_id
  AND custom_domains.user_id = auth.uid()
));

-- Create a function to verify domain ownership
CREATE OR REPLACE FUNCTION verify_domain(p_domain_id UUID, p_verification_status BOOLEAN)
RETURNS BOOLEAN AS $$
DECLARE
  v_domain_record custom_domains;
BEGIN
  -- Get the domain record
  SELECT * INTO v_domain_record
  FROM custom_domains
  WHERE id = p_domain_id
  AND user_id = auth.uid();
  
  -- Check if domain exists and belongs to user
  IF v_domain_record.id IS NULL THEN
    RAISE EXCEPTION 'Domain not found or not owned by user';
  END IF;
  
  -- Update verification status
  IF p_verification_status THEN
    UPDATE custom_domains
    SET 
      status = 'verified',
      verified_at = now()
    WHERE id = p_domain_id;
    
    -- Insert default settings if not exist
    INSERT INTO domain_settings (domain_id)
    VALUES (p_domain_id)
    ON CONFLICT (domain_id) DO NOTHING;
    
    RETURN TRUE;
  ELSE
    UPDATE custom_domains
    SET status = 'failed'
    WHERE id = p_domain_id;
    
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to activate a verified domain
CREATE OR REPLACE FUNCTION activate_domain(p_domain_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_domain_record custom_domains;
BEGIN
  -- Get the domain record
  SELECT * INTO v_domain_record
  FROM custom_domains
  WHERE id = p_domain_id
  AND user_id = auth.uid()
  AND status = 'verified';
  
  -- Check if domain exists and is verified
  IF v_domain_record.id IS NULL THEN
    RAISE EXCEPTION 'Domain not found, not owned by user, or not verified';
  END IF;
  
  -- Activate domain
  UPDATE custom_domains
  SET status = 'active'
  WHERE id = p_domain_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to generate a verification code
CREATE OR REPLACE FUNCTION generate_domain_verification_code(p_domain_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_domain_record custom_domains;
  v_verification_code TEXT;
BEGIN
  -- Get the domain record
  SELECT * INTO v_domain_record
  FROM custom_domains
  WHERE id = p_domain_id
  AND user_id = auth.uid();
  
  -- Check if domain exists and belongs to user
  IF v_domain_record.id IS NULL THEN
    RAISE EXCEPTION 'Domain not found or not owned by user';
  END IF;
  
  -- Generate a random verification code (16 characters)
  v_verification_code := encode(gen_random_bytes(8), 'hex');
  
  -- Update the domain with the new verification code
  UPDATE custom_domains
  SET 
    verification_code = v_verification_code,
    status = 'pending'
  WHERE id = p_domain_id;
  
  RETURN v_verification_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add count limit function to check number of domains per farmer
CREATE OR REPLACE FUNCTION check_domain_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_domain_count INTEGER;
  v_max_domains INTEGER := 3; -- Default limit of 3 domains per farmer
BEGIN
  -- Count existing domains for this user
  SELECT COUNT(*) INTO v_domain_count
  FROM custom_domains
  WHERE user_id = p_user_id;
  
  -- Return true if under limit, false if at or over limit
  RETURN v_domain_count < v_max_domains;
END;
$$ LANGUAGE plpgsql;

-- Create a domain limit policy for insertion
CREATE POLICY "Users can only create domains up to their limit"
ON custom_domains
FOR INSERT
TO authenticated
WITH CHECK (check_domain_limit(auth.uid()));

-- Create a view to get domains with their settings
CREATE OR REPLACE VIEW domain_details AS
SELECT
  d.id,
  d.user_id,
  d.domain,
  d.entri_domain_id,
  d.status,
  d.verification_code,
  d.verified_at,
  d.created_at,
  s.show_branding,
  s.primary_color,
  s.theme,
  s.custom_css,
  p.name as farmer_name
FROM
  custom_domains d
LEFT JOIN
  domain_settings s ON d.id = s.domain_id
LEFT JOIN
  profiles p ON d.user_id = p.id;

-- Grant access to the view
GRANT SELECT ON domain_details TO authenticated;