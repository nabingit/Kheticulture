/*
  # Domain Lookup Function

  1. Functions
    - Create lookup_domain function for public domain access
  
  2. Security
    - Add policy to allow reading active domains publicly
*/

-- Create a domain lookup function that can be called from the client
CREATE OR REPLACE FUNCTION lookup_domain(domain_name TEXT)
RETURNS JSONB AS $$
DECLARE
  domain_result JSONB;
BEGIN
  SELECT 
    jsonb_build_object(
      'domain', d.domain,
      'farmer_id', d.user_id,
      'farmer_name', p.name,
      'primary_color', COALESCE(s.primary_color, '#22C55E'),
      'theme', COALESCE(s.theme, 'light'),
      'show_branding', COALESCE(s.show_branding, true),
      'custom_css', s.custom_css
    ) INTO domain_result
  FROM 
    custom_domains d
  JOIN
    profiles p ON d.user_id = p.id
  LEFT JOIN
    domain_settings s ON d.id = s.domain_id
  WHERE 
    d.domain = domain_name
    AND d.status = 'active';
  
  RETURN COALESCE(domain_result, '{}');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION lookup_domain(TEXT) TO authenticated;

-- Additional policy to allow reading active domains
-- This allows the frontend to check domain availability and load public domain info
CREATE POLICY "Public can read active domain info"
ON custom_domains
FOR SELECT
TO authenticated
USING (status = 'active');