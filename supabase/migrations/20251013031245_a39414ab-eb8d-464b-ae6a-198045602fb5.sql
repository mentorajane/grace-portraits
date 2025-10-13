-- Create storage bucket for generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('persona-images', 'persona-images', true);

-- Create table for storing generated images metadata
CREATE TABLE public.generated_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_image_url TEXT NOT NULL,
  style_name TEXT NOT NULL,
  generated_image_url TEXT NOT NULL,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since we don't have auth)
CREATE POLICY "Anyone can view generated images"
ON public.generated_images
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert generated images"
ON public.generated_images
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update generated images"
ON public.generated_images
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete generated images"
ON public.generated_images
FOR DELETE
USING (true);

-- Create policy for storage bucket
CREATE POLICY "Public access to persona images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'persona-images');

CREATE POLICY "Anyone can upload persona images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'persona-images');

CREATE POLICY "Anyone can update persona images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'persona-images');

CREATE POLICY "Anyone can delete persona images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'persona-images');