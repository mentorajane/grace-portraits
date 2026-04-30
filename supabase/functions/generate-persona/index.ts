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
    let imageData: string | undefined;
    let requestedStyles: string[] | undefined;
    try {
      const bodyText = await req.text();
      if (!bodyText) {
        return new Response(
          JSON.stringify({ error: 'Request body is empty' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const parsed = JSON.parse(bodyText);
      imageData = parsed.imageData;
      requestedStyles = Array.isArray(parsed.styles) ? parsed.styles : undefined;
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'A imagem é muito grande ou está corrompida. Tente uma imagem menor (até 4MB).' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Reject oversized payloads early (base64 ~ 1.37x raw size)
    const approxBytes = (imageData.length * 3) / 4;
    if (approxBytes > 5 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Imagem maior que 5MB. Por favor, envie uma imagem menor.' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // IDENTITY-LOCK PREFIX: applied to every style to force exact facial preservation
    const IDENTITY_LOCK = "CRITICAL IDENTITY PRESERVATION TASK: This is a photo edit, NOT a new person generation. You MUST preserve the EXACT same person from the reference photo with 100% facial fidelity. DO NOT alter, stylize, beautify, age, slim, or modify ANY facial feature. Keep IDENTICAL: face shape and proportions, jawline, cheekbones, forehead, eye shape and color, eyebrow shape, nose shape and size, lip shape, mouth, chin, ears, skin tone and texture, freckles/marks/moles, hair color/texture/length/style, facial hair, body type, height proportions, and overall silhouette. The output face must be recognizable as THE SAME PERSON — a friend should instantly identify them. Treat the original face as a locked reference; only the clothing, background, and lighting may change. ";

    const styles = [
      {
        name: "Visão Empresarial",
        prompt: IDENTITY_LOCK + "SCENE CHANGE ONLY: Dress the same person in elegant business attire (well-tailored suit or blazer). Place them in a modern corporate office background with soft professional lighting. Keep the same pose and framing as the original photo whenever possible."
      },
      {
        name: "Alma Criativa",
        prompt: IDENTITY_LOCK + "SCENE CHANGE ONLY: Dress the same person in bohemian artistic clothing. Place them in an artistic setting with colorful murals or an art studio background, with moody warm lighting. Keep the same pose and framing as the original photo whenever possible."
      },
      {
        name: "Vibração Urbana",
        prompt: IDENTITY_LOCK + "SCENE CHANGE ONLY: Dress the same person in trendy streetwear (leather jacket or modern urban casual). Place them in a vibrant city street with neon lights or tasteful graffiti in the background. Keep the same pose and framing as the original photo whenever possible. Do NOT change the face — only wardrobe and environment."
      },
      {
        name: "Essência Natural",
        prompt: IDENTITY_LOCK + "SCENE CHANGE ONLY: Dress the same person in comfortable casual clothing. Place them in a beautiful natural environment with soft natural lighting (beach, forest, or garden). Keep the same pose and framing as the original photo whenever possible."
      },
      {
        name: "Glamour Fashion",
        prompt: IDENTITY_LOCK + "SCENE CHANGE ONLY: Dress the same person in elegant haute couture fashion. Place them in a sophisticated studio setting with dramatic fashion lighting. Keep the same pose and framing as the original photo whenever possible."
      },
      {
        name: "Home Office",
        prompt: IDENTITY_LOCK + "SCENE CHANGE ONLY: Dress the same person in smart casual clothing (button-down shirt or blouse). Place them in a modern home office with bookshelf, plants, and natural window lighting. Keep the same pose and framing as the original photo whenever possible."
      },
      {
        name: "Estilo de Vida",
        prompt: IDENTITY_LOCK + "SCENE CHANGE ONLY: Dress the same person in relaxed casual clothing. Place them in a cozy lifestyle setting like a cafe, living room, or outdoor leisure space with warm natural lighting. Keep the same pose and framing as the original photo whenever possible. Do NOT change the face — only wardrobe and environment."
      },
      // Poses & Expressões — fundo verde (chroma key)
      {
        name: "Sorriso — Fundo Verde",
        prompt: IDENTITY_LOCK + "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the expression to a warm, natural smile showing genuine happiness, looking directly at the camera. Place them on a SOLID CHROMA KEY GREEN background (#00B140), evenly lit, no shadows on background, ready for compositing. Studio softbox lighting on the subject. Half-body framing."
      },
      {
        name: "Sério Profissional — Fundo Verde",
        prompt: IDENTITY_LOCK + "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the expression to a serious, confident, professional look with neutral mouth and focused eyes toward the camera. Place them on a SOLID CHROMA KEY GREEN background (#00B140), evenly lit, no shadows on background, ready for compositing. Clean studio lighting. Half-body framing."
      },
      {
        name: "Olhar Lateral — Fundo Verde",
        prompt: IDENTITY_LOCK + "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the pose to a 3/4 side view, looking off-camera with a thoughtful, contemplative expression. Place them on a SOLID CHROMA KEY GREEN background (#00B140), evenly lit, no shadows on background, ready for compositing. Soft studio lighting. Half-body framing."
      },
      {
        name: "Braços Cruzados — Fundo Verde",
        prompt: IDENTITY_LOCK + "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the pose to arms crossed in front of the chest with a confident, slight smile, body angled slightly to the side. Place them on a SOLID CHROMA KEY GREEN background (#00B140), evenly lit, no shadows on background, ready for compositing. Clean studio lighting. Three-quarter body framing."
      },
      // Poses & Expressões — ambiente real
      {
        name: "Sorriso — Ambiente",
        prompt: IDENTITY_LOCK + "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the expression to a warm, genuine smile, looking at the camera. Place them in a beautiful real environment (sunlit park, modern cafe interior, or urban plaza) with soft natural lighting and pleasant bokeh background. Half-body framing."
      },
      {
        name: "Sério Profissional — Ambiente",
        prompt: IDENTITY_LOCK + "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the expression to a serious, confident professional look. Place them in a modern office or studio environment with soft, natural window lighting and shallow depth of field. Half-body framing."
      },
      {
        name: "Mão no Rosto — Ambiente",
        prompt: IDENTITY_LOCK + "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the pose to one hand lightly touching the chin or cheek, with a soft, thoughtful expression and gentle smile. Place them in a warm real environment (cafe near a window, library, or sunlit room) with cinematic natural lighting and bokeh. Half-body framing."
      },
      {
        name: "Olhar Lateral — Ambiente",
        prompt: IDENTITY_LOCK + "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the pose to a 3/4 angle, looking off-camera with a calm, contemplative expression. Place them in a beautiful real outdoor environment (golden-hour street, park, or rooftop) with cinematic natural lighting and creamy bokeh. Half-body framing."
      }
    ];

    // Filter by user-requested styles if provided; otherwise default to first N
    let selectedStyles = styles;
    if (requestedStyles && requestedStyles.length > 0) {
      const requestedSet = new Set(requestedStyles);
      selectedStyles = styles.filter((s) => requestedSet.has(s.name));
    }
    selectedStyles = selectedStyles.slice(0, MAX_STYLES_PER_REQUEST);

    if (selectedStyles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Nenhum estilo válido foi selecionado.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
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
