import { useState } from "react";
import { Upload as UploadIcon, Heart, Loader2, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useImageContext } from "@/contexts/ImageContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { MULTIPLY_STYLE_NAMES } from "@/lib/stylePrompts";

type UploadMode = "select" | "multiply";

const Upload = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [mode, setMode] = useState<UploadMode>("select");
  const { setUploadedImage, setSelectedStyles } = useImageContext();

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1024;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            const scale = Math.min(maxDim / width, maxDim / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas not supported'));
          ctx.drawImage(img, 0, 0, width, height);
          // JPEG strips metadata (incl. C2PA) and reduces size dramatically
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Arquivo inválido', description: 'Envie uma imagem (JPG ou PNG).', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    try {
      const compressed = await compressImage(file);
      setUploadedImage(compressed);
      if (mode === "multiply") {
        setSelectedStyles(MULTIPLY_STYLE_NAMES);
        navigate('/processing');
      } else {
        navigate('/select-styles');
      }
    } catch (err) {
      console.error('Image processing failed:', err);
      toast({
        title: 'Não foi possível abrir a imagem',
        description: 'Tente outra foto (JPG ou PNG, até 10MB). Imagens HEIC não são suportadas.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleClothingSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClothingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 animate-fade-in">
      <div className="max-w-2xl w-full text-center space-y-8 md:space-y-12">
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-persona-dark tracking-tight">
            Persona
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-persona-medium font-light">
            Sua visão. Nossa arte.
          </p>
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/favorites')}
              className="text-persona-medium hover:text-persona-dark rounded-full"
            >
              <Heart className="w-4 h-4 mr-2" />
              Ver votados
            </Button>
          </div>
        </div>

        {/* Mode toggle: escolher estilos vs. multiplicar em várias fotos */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-persona-subtle/40 p-1 bg-background/50 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setMode("select")}
              disabled={isProcessing}
              className={`px-4 py-2 text-sm rounded-full transition-smooth ${
                mode === "select"
                  ? "bg-persona-dark text-background"
                  : "text-persona-medium hover:text-persona-dark"
              }`}
            >
              Escolher estilos
            </button>
            <button
              type="button"
              onClick={() => setMode("multiply")}
              disabled={isProcessing}
              className={`px-4 py-2 text-sm rounded-full transition-smooth flex items-center gap-1.5 ${
                mode === "multiply"
                  ? "bg-persona-dark text-background"
                  : "text-persona-medium hover:text-persona-dark"
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              Multiplicar em várias fotos
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <label
            htmlFor="file-upload"
            className={`relative cursor-pointer transition-smooth ${
              isDragging ? 'scale-105' : 'hover:scale-102'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div
              className={`w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center space-y-4 transition-smooth shadow-elegant ${
                isDragging
                  ? 'border-accent bg-accent/5'
                  : 'border-persona-subtle hover:border-persona-medium'
              }`}
            >
              <UploadIcon
                className={`w-16 h-16 transition-smooth ${
                  isDragging ? 'text-accent' : 'text-persona-medium'
                } ${isProcessing ? 'opacity-30' : ''}`}
              />
              <div className="text-persona-medium text-base font-light px-4 text-center">
                {isProcessing
                  ? 'Processando imagem...'
                  : mode === "multiply"
                    ? 'Envie 1 foto — geraremos 3 variações'
                    : 'Toque ou arraste sua foto'}
              </div>
              {isProcessing && (
                <Loader2 className="w-8 h-8 text-persona-dark animate-spin absolute" />
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/*"
              onChange={handleFileSelect}
              disabled={isProcessing}
            />
          </label>
        </div>

        <div className="space-y-4">
          <p className="text-sm md:text-base text-persona-subtle font-light">
            Toque para iniciar sua sessão de foto.
          </p>
          
          <div className="border-t border-persona-subtle/20 pt-6">
            <label
              htmlFor="clothing-upload"
              className="cursor-pointer"
            >
              <div className="flex items-center justify-center gap-3 p-4 border border-dashed border-persona-subtle/50 rounded-xl hover:border-persona-medium transition-smooth">
                {clothingImage ? (
                  <div className="flex items-center gap-3">
                    <img src={clothingImage} alt="Roupa" className="w-12 h-12 rounded object-cover" />
                    <span className="text-sm text-persona-medium">Roupa selecionada</span>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-5 h-5 text-persona-medium" />
                    <span className="text-sm text-persona-medium">
                      Adicionar foto de roupa (opcional)
                    </span>
                  </>
                )}
              </div>
              <input
                id="clothing-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleClothingSelect}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
