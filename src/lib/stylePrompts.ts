// Professional prompts (with parameters) per style — kept in sync with the
// edge function `supabase/functions/generate-persona/index.ts`.
// Used to display & copy the prompt that produced each generated image.

export const IDENTITY_LOCK =
  "ABSOLUTE IDENTITY LOCK — HIGHEST PRIORITY: This is a photo EDIT of the reference image, NOT the creation of a new person. The output MUST be the SAME HUMAN BEING from the reference photo, pixel-faithful to their real face and body. STRICTLY FORBIDDEN: do NOT beautify, slim, thicken, age, de-age, smooth skin, remove blemishes, whiten teeth, enlarge eyes, reshape nose, sharpen jaw, alter ethnicity, alter gender expression, change body proportions, change height, change weight, change muscle tone, change breast/chest size, change hip size, change hand/finger shape, change tattoos or scars, change eye color, change hair color/length/texture/hairline, add or remove facial hair, or apply any 'AI beauty filter'. PRESERVE EXACTLY (100% fidelity): face shape, skull proportions, forehead, jawline, chin, cheekbones, nose shape/size/nostrils, lip shape and thickness, philtrum, mouth width, teeth, ear shape and position, eye shape/spacing/color/eyelids/eyebrows, every freckle/mole/scar/wrinkle/birthmark, skin tone and texture, hair (color, length, style, hairline, parting), facial hair, neck, shoulders, torso, arms, hands, waist, hips, legs, overall body type and silhouette. A close friend or family member must instantly recognize the person in the output as the exact same individual from the reference. Only the clothing, pose (when specified), background, and lighting may change. If in doubt, err on the side of copying the original face and body IDENTICALLY.";

export const IDENTITY_LOCK_PT =
  "TRAVA ABSOLUTA DE IDENTIDADE — PRIORIDADE MÁXIMA: Esta é uma EDIÇÃO da foto de referência, NÃO a criação de uma nova pessoa. O resultado DEVE ser o MESMO SER HUMANO da foto original, fiel em pixels ao rosto e corpo reais. TERMINANTEMENTE PROIBIDO: NÃO embeleze, afine, engrosse, envelheça, rejuvenesça, alise a pele, remova imperfeições, clareie dentes, aumente olhos, remodele nariz, afine mandíbula, altere etnia, altere expressão de gênero, mude proporções do corpo, altere altura, peso, tônus muscular, tamanho do busto/peito, tamanho do quadril, formato das mãos/dedos, tatuagens ou cicatrizes, cor dos olhos, cor/comprimento/textura/linha do cabelo, adicione ou remova pelos faciais, ou aplique qualquer 'filtro de beleza IA'. PRESERVE EXATAMENTE (100% de fidelidade): formato do rosto, proporções do crânio, testa, mandíbula, queixo, maçãs do rosto, formato/tamanho do nariz e narinas, formato e espessura dos lábios, filtro, largura da boca, dentes, formato e posição das orelhas, formato/espaçamento/cor dos olhos, pálpebras, sobrancelhas, cada sarda/pinta/cicatriz/ruga/marca de nascença, tom e textura da pele, cabelo (cor, comprimento, estilo, linha capilar, repartição), pelos faciais, pescoço, ombros, tronco, braços, mãos, cintura, quadril, pernas, tipo de corpo e silhueta geral. Um amigo próximo ou familiar deve reconhecer instantaneamente a pessoa como o MESMO indivíduo da foto original. Apenas roupa, pose (quando especificada), cenário e iluminação podem mudar. Na dúvida, copie o rosto e o corpo IDENTICAMENTE ao original.";

// Tradução PT-BR dos prompts de cena por nome de estilo
export const STYLE_PROMPTS_PT: Record<string, string> = {
  "Visão Empresarial":
    "MUDANÇA DE CENA APENAS: Vista a mesma pessoa com um traje executivo elegante (terno ou blazer bem cortado). Coloque-a em um escritório corporativo moderno ao fundo, com iluminação profissional suave. Mantenha a mesma pose e enquadramento da foto original sempre que possível.",
  "Alma Criativa":
    "MUDANÇA DE CENA APENAS: Vista a mesma pessoa com roupas artísticas boêmias. Coloque-a em um cenário artístico com murais coloridos ou em um ateliê de arte ao fundo, com iluminação quente e atmosférica. Mantenha a mesma pose e enquadramento da foto original sempre que possível.",
  "Vibração Urbana":
    "MUDANÇA DE CENA APENAS: Vista a mesma pessoa com streetwear moderno (jaqueta de couro ou casual urbano contemporâneo). Coloque-a em uma rua vibrante da cidade com luzes de neon ou grafite tasteful ao fundo. Mantenha a mesma pose e enquadramento da foto original sempre que possível. NÃO altere o rosto — apenas o figurino e o ambiente.",
  "Essência Natural":
    "MUDANÇA DE CENA APENAS: Vista a mesma pessoa com roupas casuais confortáveis. Coloque-a em um belo ambiente natural com luz natural suave (praia, floresta ou jardim). Mantenha a mesma pose e enquadramento da foto original sempre que possível.",
  "Glamour Fashion":
    "MUDANÇA DE CENA APENAS: Vista a mesma pessoa com alta-costura elegante. Coloque-a em um estúdio sofisticado com iluminação fashion dramática. Mantenha a mesma pose e enquadramento da foto original sempre que possível.",
  "Home Office":
    "MUDANÇA DE CENA APENAS: Vista a mesma pessoa com roupa smart casual (camisa social ou blusa). Coloque-a em um home office moderno com estante de livros, plantas e luz natural vinda da janela. Mantenha a mesma pose e enquadramento da foto original sempre que possível.",
  "Estilo de Vida":
    "MUDANÇA DE CENA APENAS: Vista a mesma pessoa com roupa casual relaxada. Coloque-a em um cenário lifestyle aconchegante como um café, sala de estar ou área de lazer ao ar livre, com luz natural quente. Mantenha a mesma pose e enquadramento da foto original sempre que possível. NÃO altere o rosto — apenas o figurino e o ambiente.",
  "Sorriso — Fundo Verde":
    "MUDANÇA DE POSE E EXPRESSÃO: Mantenha a mesma pessoa e o figurino atual. Mude a expressão para um sorriso natural e caloroso, demonstrando alegria genuína, olhando diretamente para a câmera. Coloque-a sobre um fundo SÓLIDO CHROMA KEY VERDE (#00B140), iluminado de forma uniforme, sem sombras no fundo, pronto para composição. Iluminação de estúdio com softbox no rosto. Enquadramento de meio corpo.",
  "Sério Profissional — Fundo Verde":
    "MUDANÇA DE POSE E EXPRESSÃO: Mantenha a mesma pessoa e o figurino atual. Mude a expressão para um olhar sério, confiante e profissional, com boca neutra e olhos focados na câmera. Coloque-a sobre fundo SÓLIDO CHROMA KEY VERDE (#00B140), iluminado de forma uniforme, sem sombras no fundo. Iluminação de estúdio limpa. Enquadramento de meio corpo.",
  "Olhar Lateral — Fundo Verde":
    "MUDANÇA DE POSE E EXPRESSÃO: Mantenha a mesma pessoa e o figurino atual. Mude a pose para uma vista 3/4 lateral, olhando para fora da câmera com expressão pensativa e contemplativa. Coloque-a sobre fundo SÓLIDO CHROMA KEY VERDE (#00B140), iluminado de forma uniforme, sem sombras no fundo. Iluminação de estúdio suave. Enquadramento de meio corpo.",
  "Braços Cruzados — Fundo Verde":
    "MUDANÇA DE POSE E EXPRESSÃO: Mantenha a mesma pessoa e o figurino atual. Mude a pose para braços cruzados na frente do peito, com leve sorriso confiante e corpo angulado ligeiramente para o lado. Coloque-a sobre fundo SÓLIDO CHROMA KEY VERDE (#00B140), iluminado de forma uniforme, sem sombras no fundo. Iluminação de estúdio limpa. Enquadramento de três quartos do corpo.",
  "Sorriso — Ambiente":
    "MUDANÇA DE POSE E EXPRESSÃO: Mantenha a mesma pessoa e o figurino atual. Mude a expressão para um sorriso genuíno e caloroso, olhando para a câmera. Coloque-a em um belo ambiente real (parque iluminado pelo sol, interior moderno de café ou praça urbana) com luz natural suave e fundo desfocado (bokeh) agradável. Enquadramento de meio corpo.",
  "Sério Profissional — Ambiente":
    "MUDANÇA DE POSE E EXPRESSÃO: Mantenha a mesma pessoa e o figurino atual. Mude a expressão para um olhar sério, profissional e confiante. Coloque-a em um escritório moderno ou estúdio com luz natural suave vinda da janela e profundidade de campo rasa. Enquadramento de meio corpo.",
  "Mão no Rosto — Ambiente":
    "MUDANÇA DE POSE E EXPRESSÃO: Mantenha a mesma pessoa e o figurino atual. Mude a pose para uma das mãos tocando levemente o queixo ou a bochecha, com expressão suave e pensativa, e leve sorriso. Coloque-a em um ambiente real acolhedor (café perto da janela, biblioteca ou sala iluminada pelo sol) com iluminação natural cinematográfica e bokeh. Enquadramento de meio corpo.",
  "Olhar Lateral — Ambiente":
    "MUDANÇA DE POSE E EXPRESSÃO: Mantenha a mesma pessoa e o figurino atual. Mude a pose para um ângulo 3/4, olhando para fora da câmera com expressão calma e contemplativa. Coloque-a em um belo ambiente externo real (rua na hora dourada, parque ou rooftop) com iluminação natural cinematográfica e bokeh cremoso. Enquadramento de meio corpo.",
  "Fundo Transparente":
    "REMOÇÃO DE FUNDO: Mantenha a mesma pessoa e o figurino atual, sem alterações. Gere o resultado como recorte limpo sobre fundo TOTALMENTE TRANSPARENTE (PNG com canal alfa = 0 em volta da pessoa). Sem elementos de fundo, sem sombras, sem gradientes — apenas a pessoa sobre pixels transparentes. Preserve bordas nítidas em cabelo e roupa. Iluminação de estúdio neutra e uniforme. Enquadramento de meio corpo.",
};

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
  {
    name: "Fundo Transparente",
    category: "Poses & Expressões",
    description: "Recorte em PNG com fundo transparente",
    prompt:
      "BACKGROUND REMOVAL: Keep the same person and their current outfit unchanged. Output the subject as a clean cut-out on a FULLY TRANSPARENT background (PNG with alpha channel = 0 around the subject). No background elements, no shadows, no gradients — only the person on transparent pixels. Preserve clean, sharp edges around hair and clothing. Even, neutral studio lighting on the subject. Half-body framing.",
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
  const scenePt = STYLE_PROMPTS_PT[styleName] ?? "";
  const params = [
    `Model: ${AI_PARAMETERS.model}`,
    `Modalities: ${AI_PARAMETERS.modalities.join(", ")}`,
    `Reference: ${AI_PARAMETERS.reference}`,
    `Style: ${styleName}`,
  ].join("\n");

  return `# Persona — ${styleName}\n\n## Parâmetros\n${params}\n\n## Identity Lock (EN)\n${IDENTITY_LOCK}\n\n## Trava de Identidade (PT-BR)\n${IDENTITY_LOCK_PT}\n\n## Scene (EN)\n${scene}\n\n## Cena (PT-BR)\n${scenePt}`;
};

export const MAX_STYLES_PER_REQUEST = 3;
