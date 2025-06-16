
-- Create a new storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Grant public access to view images in the bucket
-- This policy allows anyone to view the images, which is needed to display them in the app.
CREATE POLICY "Product images are publicly accessible."
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'product-images' );

-- Grant public access to upload images to the bucket
-- This policy allows any user to upload an image for a product.
CREATE POLICY "Anyone can upload a product image."
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'product-images' );

-- Add a column to store the custom product image URL in the transfers table
-- This will only run if the column does not already exist.
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='transfers' AND column_name='product_image_url') THEN
    ALTER TABLE public.transfers ADD COLUMN product_image_url TEXT;
  END IF;
END $$;
