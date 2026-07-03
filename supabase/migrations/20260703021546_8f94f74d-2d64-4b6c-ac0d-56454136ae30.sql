GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_images TO authenticated;
GRANT ALL ON public.generated_images TO service_role;