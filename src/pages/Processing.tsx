import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useImageContext } from "@/contexts/ImageContext";

const messages = [
  "A arte está tomando forma...",
  "Refinando a luz, capturando a essência...",
  "Sua melhor versão, quase pronta...",
];

const Processing = () => {
  const navigate = useNavigate();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const { uploadedImage, setGeneratedImages } = useImageContext();

  useEffect(() => {
    if (!uploadedImage) {
      navigate('/');
      return;
    }

    // Rotate messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2800);

    // Call AI generation function
    const generateImages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-persona`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData: uploadedImage }),
          }
        );

        const responseText = await response.text();
        let data: { images?: unknown; error?: string } = {};

        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch {
          data = {};
        }

        if (!response.ok) {
          if (response.status === 402) {
            throw new Error('Créditos de IA esgotados no workspace. Adicione créditos para continuar.');
          }
          if (response.status === 429) {
            throw new Error('Muitas tentativas em sequência. Aguarde alguns segundos e tente novamente.');
          }
          throw new Error(data.error || 'Falha ao gerar imagens');
        }
        
        // Store generated images in context
        setGeneratedImages(data.images);
        
        // Navigate to results
        navigate('/results');
      } catch (error) {
        console.error('Error generating images:', error);
        toast.error(error instanceof Error ? error.message : 'Erro ao processar imagem');
        navigate('/');
      }
    };

    generateImages();

    return () => {
      clearInterval(messageInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background image with blur */}
      {uploadedImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${uploadedImage})`,
            filter: 'blur(12px) grayscale(100%)',
          }}
        />
      )}

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-persona-dark tracking-tight">
          Persona
        </h1>

        <div className="flex flex-col items-center space-y-8">
          {/* Animated loader */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse-glow" />
            <Loader2 className="w-20 h-20 text-accent animate-spin relative z-10" />
          </div>

          {/* Dynamic message */}
          <div className="h-20 flex items-center justify-center">
            <p
              key={currentMessageIndex}
              className="text-xl md:text-2xl text-persona-medium font-light animate-fade-in"
            >
              {messages[currentMessageIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Processing;
