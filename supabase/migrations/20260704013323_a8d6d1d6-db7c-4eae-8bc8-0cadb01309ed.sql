
-- 1. generated_images: remove permissive policies, allow only service_role
DROP POLICY IF EXISTS "Anyone can view generated images" ON public.generated_images;
DROP POLICY IF EXISTS "Anyone can insert generated images" ON public.generated_images;
DROP POLICY IF EXISTS "Anyone can update generated images" ON public.generated_images;
DROP POLICY IF EXISTS "Anyone can delete generated images" ON public.generated_images;

ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.generated_images FROM anon, authenticated;
GRANT ALL ON public.generated_images TO service_role;

CREATE POLICY "Service role manages generated images"
  ON public.generated_images
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. storage.objects for persona-images: block anon/authenticated writes, deletes, and listing.
--    Public URL reads still work because they don't go through RLS.
DROP POLICY IF EXISTS "Public read persona-images" ON storage.objects;
DROP POLICY IF EXISTS "Public insert persona-images" ON storage.objects;
DROP POLICY IF EXISTS "Public update persona-images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete persona-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view persona-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload persona-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update persona-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete persona-images" ON storage.objects;

CREATE POLICY "Service role manages persona-images objects"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'persona-images')
  WITH CHECK (bucket_id = 'persona-images');
