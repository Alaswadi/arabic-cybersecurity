-- Add image column to services table if it doesn't exist
DO $$
BEGIN
  -- Check if the column already exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'services'
    AND column_name = 'image'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE services ADD COLUMN image VARCHAR(255);

    -- Add comment
    COMMENT ON COLUMN services.image IS 'URL path to the service image';

    RAISE NOTICE 'Added image column to services table';
  ELSE
    RAISE NOTICE 'Image column already exists in services table';
  END IF;
END
$$;
