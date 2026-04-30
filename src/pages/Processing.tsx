import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useImageContext } from "@/contexts/ImageContext";

const messages = [
  "A arte está tomando forma...",
  "Refinando a luz, capturando a essência...",
  "Sua melhor versão, quase pronta...",
];

const Processing = () => {
  const navigate = useNavigate();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const { uploadedImage, selectedStyles, setGeneratedImages } = useImageContext();

  useEffect(() => {
    if (!uploadedImage) {
      navigate('/');
      return;
    }
    if (!selectedStyles || selectedStyles.length === 0) {
      navigate('/select-styles');
      return;
    }

    setErrorMessage(null);

    const abortController = new AbortController();

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
            signal: abortController.signal,
            body: JSON.stringify({ imageData: uploadedImage, styles: selectedStyles }),
          }
        );

        const responseText = await response.text();
        let data: { images?: unknown; error?: string; warning?: string } = {};

        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch {
          data = {};
        }

        if (!response.ok) {
          if (response.status === 402) {
            throw new Error('Os créditos de IA acabaram no workspace. Adicione saldo para continuar.');
          }
          if (response.status === 429) {
            throw new Error('Muitas tentativas em sequência. Aguarde alguns segundos e tente novamente.');
          }
          throw new Error(data.error || 'Falha ao gerar imagens');
        }
        
        if (!Array.isArray(data.images)) {
          throw new Error('Resposta inválida ao gerar imagens');
        }

        // Store generated images in context
        setGeneratedImages(data.images as Parameters<typeof setGeneratedImages>[0]);

        if (data.warning) {
          toast.warning(data.warning);
        }
        
        // Navigate to results
        navigate('/results');
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        console.error('Error generating images:', error);
        const message = error instanceof Error ? error.message : 'Erro ao processar imagem';
        setErrorMessage(message);
        toast.error(message);
      }
    };

    generateImages();

    return () => {
      abortController.abort();
      clearInterval(messageInterval);
    };
  }, [navigate, retryKey, uploadedImage, selectedStyles, setGeneratedImages]);

  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
  };

  const handleBack = () => {
    navigate('/');
  };

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

        {errorMessage ? (
          <div className="rounded-3xl border border-border bg-background/90 px-6 py-8 shadow-xl backdrop-blur-sm">
            <div className="space-y-4">
              <p className="text-2xl font-semibold text-foreground">Não foi possível gerar agora</p>
              <p className="text-base text-muted-foreground">{errorMessage}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={handleRetry} className="rounded-full">
                  Tentar novamente
                </Button>
                <Button variant="outline" onClick={handleBack} className="rounded-full">
                  Voltar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse-glow" />
              <Loader2 className="w-20 h-20 text-accent animate-spin relative z-10" />
            </div>

            <div className="h-20 flex items-center justify-center">
              <p
                key={currentMessageIndex}
                className="text-xl md:text-2xl text-persona-medium font-light animate-fade-in"
              >
                {messages[currentMessageIndex]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Processing;
