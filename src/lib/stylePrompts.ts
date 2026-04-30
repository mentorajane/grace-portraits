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

export type StyleCategory = "Estilos" | "Poses & Expressões";

export type StyleDefinition = {
  name: string;
  category: StyleCategory;
  prompt: string;
  description: string;
};

export const STYLE_DEFINITIONS: StyleDefinition[] = [
  // ===== Estilos / Cenários =====
  {
    name: "Visão Empresarial",
    category: "Estilos",
    description: "Terno elegante em escritório corporativo",
    prompt:
      "SCENE CHANGE ONLY: Dress the same person in elegant business attire (well-tailored suit or blazer). Place them in a modern corporate office background with soft professional lighting. Keep the same pose and framing as the original photo whenever possible.",
  },
  {
    name: "Alma Criativa",
    category: "Estilos",
    description: "Look boêmio em estúdio de arte",
    prompt:
      "SCENE CHANGE ONLY: Dress the same person in bohemian artistic clothing. Place them in an artistic setting with colorful murals or an art studio background, with moody warm lighting. Keep the same pose and framing as the original photo whenever possible.",
  },
  {
    name: "Vibração Urbana",
    category: "Estilos",
    description: "Streetwear em cidade com neon",
    prompt:
      "SCENE CHANGE ONLY: Dress the same person in trendy streetwear (leather jacket or modern urban casual). Place them in a vibrant city street with neon lights or tasteful graffiti in the background. Keep the same pose and framing as the original photo whenever possible. Do NOT change the face — only wardrobe and environment.",
  },
  {
    name: "Essência Natural",
    category: "Estilos",
    description: "Casual em ambiente natural",
    prompt:
      "SCENE CHANGE ONLY: Dress the same person in comfortable casual clothing. Place them in a beautiful natural environment with soft natural lighting (beach, forest, or garden). Keep the same pose and framing as the original photo whenever possible.",
  },
  {
    name: "Glamour Fashion",
    category: "Estilos",
    description: "Alta-costura em estúdio dramático",
    prompt:
      "SCENE CHANGE ONLY: Dress the same person in elegant haute couture fashion. Place them in a sophisticated studio setting with dramatic fashion lighting. Keep the same pose and framing as the original photo whenever possible.",
  },
  {
    name: "Home Office",
    category: "Estilos",
    description: "Smart casual em escritório em casa",
    prompt:
      "SCENE CHANGE ONLY: Dress the same person in smart casual clothing (button-down shirt or blouse). Place them in a modern home office with bookshelf, plants, and natural window lighting. Keep the same pose and framing as the original photo whenever possible.",
  },
  {
    name: "Estilo de Vida",
    category: "Estilos",
    description: "Cena cotidiana acolhedora",
    prompt:
      "SCENE CHANGE ONLY: Dress the same person in relaxed casual clothing. Place them in a cozy lifestyle setting like a cafe, living room, or outdoor leisure space with warm natural lighting. Keep the same pose and framing as the original photo whenever possible. Do NOT change the face — only wardrobe and environment.",
  },

  // ===== Poses & Expressões — fundo verde (chroma key) =====
  {
    name: "Sorriso — Fundo Verde",
    category: "Poses & Expressões",
    description: "Sorriso natural em chroma key",
    prompt:
      "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the expression to a warm, natural smile showing genuine happiness, looking directly at the camera. Place them on a SOLID CHROMA KEY GREEN background (#00B140), evenly lit, no shadows on background, ready for compositing. Studio softbox lighting on the subject. Half-body framing.",
  },
  {
    name: "Sério Profissional — Fundo Verde",
    category: "Poses & Expressões",
    description: "Olhar sério e confiante em chroma",
    prompt:
      "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the expression to a serious, confident, professional look with neutral mouth and focused eyes toward the camera. Place them on a SOLID CHROMA KEY GREEN background (#00B140), evenly lit, no shadows on background, ready for compositing. Clean studio lighting. Half-body framing.",
  },
  {
    name: "Olhar Lateral — Fundo Verde",
    category: "Poses & Expressões",
    description: "Perfil 3/4 contemplativo em chroma",
    prompt:
      "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the pose to a 3/4 side view, looking off-camera with a thoughtful, contemplative expression. Place them on a SOLID CHROMA KEY GREEN background (#00B140), evenly lit, no shadows on background, ready for compositing. Soft studio lighting. Half-body framing.",
  },
  {
    name: "Braços Cruzados — Fundo Verde",
    category: "Poses & Expressões",
    description: "Pose poderosa em chroma",
    prompt:
      "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the pose to arms crossed in front of the chest with a confident, slight smile, body angled slightly to the side. Place them on a SOLID CHROMA KEY GREEN background (#00B140), evenly lit, no shadows on background, ready for compositing. Clean studio lighting. Three-quarter body framing.",
  },

  // ===== Poses & Expressões — fundo ambiente =====
  {
    name: "Sorriso — Ambiente",
    category: "Poses & Expressões",
    description: "Sorriso natural em ambiente real",
    prompt:
      "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the expression to a warm, genuine smile, looking at the camera. Place them in a beautiful real environment (sunlit park, modern cafe interior, or urban plaza) with soft natural lighting and pleasant bokeh background. Half-body framing.",
  },
  {
    name: "Sério Profissional — Ambiente",
    category: "Poses & Expressões",
    description: "Pose séria em escritório real",
    prompt:
      "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the expression to a serious, confident professional look. Place them in a modern office or studio environment with soft, natural window lighting and shallow depth of field. Half-body framing.",
  },
  {
    name: "Mão no Rosto — Ambiente",
    category: "Poses & Expressões",
    description: "Pose pensativa em ambiente real",
    prompt:
      "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the pose to one hand lightly touching the chin or cheek, with a soft, thoughtful expression and gentle smile. Place them in a warm real environment (cafe near a window, library, or sunlit room) with cinematic natural lighting and bokeh. Half-body framing.",
  },
  {
    name: "Olhar Lateral — Ambiente",
    category: "Poses & Expressões",
    description: "Perfil 3/4 em ambiente real",
    prompt:
      "POSE & EXPRESSION CHANGE: Keep the same person and their current outfit. Change the pose to a 3/4 angle, looking off-camera with a calm, contemplative expression. Place them in a beautiful real outdoor environment (golden-hour street, park, or rooftop) with cinematic natural lighting and creamy bokeh. Half-body framing.",
  },
];

// Backward-compat map (name -> scene prompt only, no IDENTITY_LOCK)
export const STYLE_PROMPTS: Record<string, string> = STYLE_DEFINITIONS.reduce(
  (acc, s) => {
    acc[s.name] = s.prompt;
    return acc;
  },
  {} as Record<string, string>,
);

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

export const MAX_STYLES_PER_REQUEST = 3;
