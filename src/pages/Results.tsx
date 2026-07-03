import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageCard from "@/components/ImageCard";
import { Button } from "@/components/ui/button";
import { Download, BookMarked, Camera } from "lucide-react";
import { toast } from "sonner";
import { useImageContext } from "@/contexts/ImageContext";

const Results = () => {
  const navigate = useNavigate();
  const { generatedImages, loadImages } = useImageContext();

  useEffect(() => {
    if (generatedImages.length === 0) {
      loadImages();
    }
  }, [generatedImages.length, loadImages]);

  const handleSaveAll = async () => {
    try {
      for (const result of generatedImages) {
        const link = document.createElement('a');
        link.href = result.generated_image_url;
        link.download = `persona-${result.style_name.toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      toast.success("Todas as imagens foram salvas!");
    } catch (error) {
      toast.error("Erro ao salvar imagens");
    }
  };

  const handleFavorites = () => {
    navigate('/favorites');
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 md:py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-persona-dark tracking-tight">
            Persona
          </h1>
          <p className="text-lg md:text-xl text-persona-medium font-light">
            Sua essência, reinventada.
          </p>
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="rounded-full border-persona-subtle/40 text-persona-dark hover:bg-persona-light"
            >
              <Camera className="w-4 h-4 mr-2" />
              Nova sessão de fotos
            </Button>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {generatedImages.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            onClick={handleSaveAll}
            className="w-full sm:w-auto bg-persona-dark hover:bg-persona-medium text-white font-light px-8 py-6 rounded-full transition-smooth shadow-elegant"
          >
            <Download className="w-5 h-5 mr-2" />
            Salvar Imagens
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            onClick={handleFavorites}
            className="w-full sm:w-auto text-persona-medium hover:text-persona-dark hover:bg-persona-light font-light px-8 py-6 rounded-full transition-smooth"
          >
            <BookMarked className="w-5 h-5 mr-2" />
            Book de Favoritos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
