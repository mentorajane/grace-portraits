import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AI_MODEL = 'google/gemini-2.5-flash-image';
const MAX_STYLES_PER_REQUEST = 3;

const sanitizeStyleName = (styleName: string) =>
  styleName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

const extractBase64Image = (imageUrl: string) => {
  const base64Data = imageUrl.split(',')[1];

  if (!base64Data) {
    throw new Error('Invalid generated image payload');
  }

  return Uint8Array.from(atob(base64Data), (char) => char.charCodeAt(0));
};

const normalizeQuotaError = (status: number) => {
  if (status === 402) {
    return 'PAYMENT_REQUIRED:Payment required. Please add credits to your workspace.';
  }

  if (status === 429) {
    return 'RATE_LIMIT_EXCEEDED:Rate limit exceeded. Please try again later.';
  }

  return null;
};

const isQuotaError = (message: string) =>
  message.startsWith('PAYMENT_REQUIRED:') || message.startsWith('RATE_LIMIT_EXCEEDED:');

const getReadableError = (message: string) =>
  message
    .replace('PAYMENT_REQUIRED:', '')
    .replace('RATE_LIMIT_EXCEEDED:', '')
    .replace('AI_GATEWAY_ERROR:', '');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting image generation...');

    // Reduced batch size for lower AI usage and more reliable free-tier behavior
    const styles = [
      {
        name: "Visão Empresarial",
        prompt: "Create a professional corporate portrait maintaining EXACTLY the same face, facial features, body proportions, and silhouette from the original photo. Keep the person's exact likeness, face shape, eyes, nose, mouth, skin tone, hair, body type and posture. Only change: elegant business attire (suit or blazer), modern corporate office background with professional lighting. The face and body MUST look identical to the original person."
      },
      {
        name: "Alma Criativa",
        prompt: "Create an artistic portrait maintaining EXACTLY the same face, facial features, body proportions, and silhouette from the original photo. Keep the person's exact likeness, face shape, eyes, nose, mouth, skin tone, hair, body type and posture. Only change: bohemian artistic clothing, artistic urban setting with colorful murals or art studio background, moody lighting. The face and body MUST look identical to the original person."
      },
      {
        name: "Vibração Urbana",
        prompt: "Create an urban street style portrait maintaining EXACTLY the same face, facial features, body proportions, and silhouette from the original photo. Keep the person's exact likeness, face shape, eyes, nose, mouth, skin tone, hair, body type and posture. Only change: trendy streetwear fashion (leather jacket or urban casual), vibrant city street with neon lights or graffiti background. The face and body MUST look identical to the original person."
      },
      {
        name: "Essência Natural",
        prompt: "Create a natural outdoor portrait maintaining EXACTLY the same face, facial features, body proportions, and silhouette from the original photo. Keep the person's exact likeness, face shape, eyes, nose, mouth, skin tone, hair, body type and posture. Only change: casual comfortable clothing, beautiful natural environment with soft natural lighting (beach, forest, or garden). The face and body MUST look identical to the original person."
      },
      {
        name: "Glamour Fashion",
        prompt: "Create a high fashion glamour portrait maintaining EXACTLY the same face, facial features, body proportions, and silhouette from the original photo. Keep the person's exact likeness, face shape, eyes, nose, mouth, skin tone, hair, body type and posture. Only change: elegant haute couture fashion clothing, sophisticated studio setting with dramatic fashion lighting. The face and body MUST look identical to the original person."
      },
      {
        name: "Home Office",
        prompt: "Create a home office portrait maintaining EXACTLY the same face, facial features, body proportions, and silhouette from the original photo. Keep the person's exact likeness, face shape, eyes, nose, mouth, skin tone, hair, body type and posture. Only change: smart casual clothing (button-down shirt or blouse), modern home office setting with bookshelf, plants, and natural window lighting. The face and body MUST look identical to the original person."
      },
      {
        name: "Estilo de Vida",
        prompt: "Create a lifestyle portrait maintaining EXACTLY the same face, facial features, body proportions, and silhouette from the original photo. Keep the person's exact likeness, face shape, eyes, nose, mouth, skin tone, hair, body type and posture. Only change: relaxed casual clothing, cozy lifestyle setting like a cafe, living room, or outdoor leisure space with warm natural lighting. The face and body MUST look identical to the original person."
      }
    ];

    const selectedStyles = styles.slice(0, MAX_STYLES_PER_REQUEST);
    const generatedImages: Array<{ style: string; url: string }> = [];
    let warningMessage: string | null = null;

    for (const style of selectedStyles) {
      try {
        console.log(`Generating ${style.name}...`);

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: style.prompt
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: imageData
                    }
                  }
                ]
              }
            ],
            modalities: ['image', 'text']
          }),
        });

        if (!response.ok) {
          const quotaError = normalizeQuotaError(response.status);

          if (quotaError) {
            throw new Error(quotaError);
          }

          const errorText = await response.text();
          console.error(`AI gateway error for ${style.name}:`, response.status, errorText);
          throw new Error(`AI_GATEWAY_ERROR:Failed to generate ${style.name}`);
        }

        const data = await response.json();
        const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!generatedImageUrl) {
          throw new Error(`No image generated for ${style.name}`);
        }

        console.log(`Successfully generated ${style.name}`);

        const binaryData = extractBase64Image(generatedImageUrl);
        const fileName = `${crypto.randomUUID()}-${sanitizeStyleName(style.name)}.png`;
        const { error: uploadError } = await supabase.storage
          .from('persona-images')
          .upload(fileName, binaryData, {
            contentType: 'image/png',
            upsert: false
          });

        if (uploadError) {
          console.error(`Upload error for ${style.name}:`, uploadError);
          throw new Error(`Failed to upload ${style.name}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('persona-images')
          .getPublicUrl(fileName);

        console.log(`Uploaded ${style.name} to storage: ${publicUrl}`);

        generatedImages.push({
          style: style.name,
          url: publicUrl
        });
      } catch (error) {
        const rawMessage = error instanceof Error ? error.message : 'Failed to generate images';

        if (generatedImages.length > 0 && isQuotaError(rawMessage)) {
          warningMessage = getReadableError(rawMessage);
          console.warn(`Generation stopped early after partial success: ${warningMessage}`);
          break;
        }

        throw error;
      }
    }

    if (generatedImages.length === 0) {
      throw new Error('AI_GATEWAY_ERROR:No images were generated');
    }

    // Save to database
    const { data: insertData, error: insertError } = await supabase
      .from('generated_images')
      .insert(
        generatedImages.map(img => ({
          original_image_url: imageData.substring(0, 100) + '...', // Store truncated version
          style_name: img.style,
          generated_image_url: img.url,
          is_favorite: false
        }))
      )
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save images to database');
    }

    console.log('Successfully saved all images to database');

    return new Response(
      JSON.stringify({
        images: insertData,
        partial: Boolean(warningMessage),
        warning: warningMessage
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-persona function:', error);

    const rawMessage = error instanceof Error ? error.message : 'Failed to generate images';

    if (rawMessage.startsWith('PAYMENT_REQUIRED:')) {
      return new Response(
        JSON.stringify({ error: rawMessage.replace('PAYMENT_REQUIRED:', '') }),
        {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (rawMessage.startsWith('RATE_LIMIT_EXCEEDED:')) {
      return new Response(
        JSON.stringify({ error: rawMessage.replace('RATE_LIMIT_EXCEEDED:', '') }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const errorMessage = getReadableError(rawMessage);

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
