// Professional prompts (with parameters) per style — kept in sync with the
// edge function `supabase/functions/generate-persona/index.ts`.
// Used to display & copy the prompt that produced each generated image.

export const IDENTITY_LOCK =
  "CRITICAL IDENTITY PRESERVATION TASK: This is a photo edit, NOT a new person generation. You MUST preserve the EXACT same person from the reference photo with 100% facial fidelity. DO NOT alter, stylize, beautify, age, slim, or modify ANY facial feature. Keep IDENTICAL: face shape and proportions, jawline, cheekbones, forehead, eye shape and color, eyebrow shape, nose shape and size, lip shape, mouth, chin, ears, skin tone and texture, freckles/marks/moles, hair color/texture/length/style, facial hair, body type, height proportions, and overall silhouette. The output face must be recognizable as THE SAME PERSON — a friend should instantly identify them. Treat the original face as a locked reference; only the clothing, background, and lighting may change.";

export const AI_PARAMETERS = {
  model: "google/gemini-2.5-flash-image",
  modalities: ["image", "text"],
  temperature: "default",
  reference: "input photo (locked identity)",
};

export const STYLE_PROMPTS: Record<string, string> = {
  "Visão Empresarial":
    "SCENE CHANGE ONLY: Dress the same person in elegant business attire (well-tailored suit or blazer). Place them in a modern corporate office background with soft professional lighting. Keep the same pose and framing as the original photo whenever possible.",
  "Alma Criativa":
    "SCENE CHANGE ONLY: Dress the same person in bohemian artistic clothing. Place them in an artistic setting with colorful murals or an art studio background, with moody warm lighting. Keep the same pose and framing as the original photo whenever possible.",
  "Vibração Urbana":
    "SCENE CHANGE ONLY: Dress the same person in trendy streetwear (leather jacket or modern urban casual). Place them in a vibrant city street with neon lights or tasteful graffiti in the background. Keep the same pose and framing as the original photo whenever possible. Do NOT change the face — only wardrobe and environment.",
  "Essência Natural":
    "SCENE CHANGE ONLY: Dress the same person in comfortable casual clothing. Place them in a beautiful natural environment with soft natural lighting (beach, forest, or garden). Keep the same pose and framing as the original photo whenever possible.",
  "Glamour Fashion":
    "SCENE CHANGE ONLY: Dress the same person in elegant haute couture fashion. Place them in a sophisticated studio setting with dramatic fashion lighting. Keep the same pose and framing as the original photo whenever possible.",
  "Home Office":
    "SCENE CHANGE ONLY: Dress the same person in smart casual clothing (button-down shirt or blouse). Place them in a modern home office with bookshelf, plants, and natural window lighting. Keep the same pose and framing as the original photo whenever possible.",
  "Estilo de Vida":
    "SCENE CHANGE ONLY: Dress the same person in relaxed casual clothing. Place them in a cozy lifestyle setting like a cafe, living room, or outdoor leisure space with warm natural lighting. Keep the same pose and framing as the original photo whenever possible. Do NOT change the face — only wardrobe and environment.",
};

export const buildFullPrompt = (styleName: string): string => {
  const scene = STYLE_PROMPTS[styleName] ?? "";
  const params = [
    `Model: ${AI_PARAMETERS.model}`,
    `Modalities: ${AI_PARAMETERS.modalities.join(", ")}`,
    `Reference: ${AI_PARAMETERS.reference}`,
    `Style: ${styleName}`,
  ].join("\n");

  return `# Persona — ${styleName}\n\n## Parameters\n${params}\n\n## Identity Lock\n${IDENTITY_LOCK}\n\n## Scene\n${scene}`;
};
