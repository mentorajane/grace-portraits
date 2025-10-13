import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log('Starting image generation...');

    // Generate 4 different styles
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
      }
    ];

    const generatedImages = await Promise.all(
      styles.map(async (style) => {
        console.log(`Generating ${style.name}...`);
        
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
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
          if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          }
          if (response.status === 402) {
            throw new Error('Payment required. Please add credits to your workspace.');
          }
          const errorText = await response.text();
          console.error(`AI gateway error for ${style.name}:`, response.status, errorText);
          throw new Error(`Failed to generate ${style.name}`);
        }

        const data = await response.json();
        const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (!generatedImageUrl) {
          throw new Error(`No image generated for ${style.name}`);
        }

        console.log(`Successfully generated ${style.name}`);
        
        return {
          style: style.name,
          url: generatedImageUrl
        };
      })
    );

    return new Response(
      JSON.stringify({ images: generatedImages }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-persona function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate images';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
