-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cat images table
CREATE TABLE cat_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  source TEXT,
  breed TEXT,
  color TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  width INT,
  height INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Swipes table
CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cat_image_id UUID REFERENCES cat_images(id) ON DELETE CASCADE NOT NULL,
  direction TEXT CHECK (direction IN ('like', 'nope')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibility checks table
CREATE TABLE compatibility_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL,
  user_b_id UUID NOT NULL,
  score NUMERIC NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cat_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cat_images
-- Everyone can read cat images
CREATE POLICY "Cat images are readable by everyone"
  ON cat_images FOR SELECT
  TO public
  USING (true);

-- Only service role can insert cat images
CREATE POLICY "Only service role can insert cat images"
  ON cat_images FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Only service role can update cat images
CREATE POLICY "Only service role can update cat images"
  ON cat_images FOR UPDATE
  TO service_role
  WITH CHECK (true);

-- Only service role can delete cat images
CREATE POLICY "Only service role can delete cat images"
  ON cat_images FOR DELETE
  TO service_role
  USING (true);

-- RLS Policies for swipes
-- Authenticated users can insert their own swipes
CREATE POLICY "Users can insert their own swipes"
  ON swipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can select only their own swipes
CREATE POLICY "Users can select their own swipes"
  ON swipes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for compatibility_checks
-- All authenticated users can read compatibility checks
CREATE POLICY "Authenticated users can read compatibility checks"
  ON compatibility_checks FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert compatibility checks
CREATE POLICY "Only service role can insert compatibility checks"
  ON compatibility_checks FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_swipes_user_id ON swipes(user_id);
CREATE INDEX idx_swipes_cat_image_id ON swipes(cat_image_id);
CREATE INDEX idx_compatibility_checks_user_a ON compatibility_checks(user_a_id);
CREATE INDEX idx_compatibility_checks_user_b ON compatibility_checks(user_b_id);
CREATE INDEX idx_cat_images_source ON cat_images(source);
