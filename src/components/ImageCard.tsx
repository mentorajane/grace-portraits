import { useState } from "react";
import { Heart, Download, Share2, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useImageContext } from "@/contexts/ImageContext";

interface ImageCardProps {
  image: {
    id: string;
    style_name: string;
    generated_image_url: string;
    is_favorite: boolean;
  };
}

const ImageCard = ({ image }: ImageCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggleFavorite, deleteImage } = useImageContext();

  const handleToggleFavorite = () => {
    toggleFavorite(image.id);
    toast.success(image.is_favorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = image.generated_image_url;
      link.download = `persona-${image.style_name.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Imagem salva!");
    } catch (error) {
      toast.error("Erro ao salvar imagem");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Persona - ${image.style_name}`,
          text: `Confira minha foto Persona no estilo ${image.style_name}!`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      toast.info("Compartilhamento não disponível neste navegador");
    }
  };

  const handleDelete = async () => {
    await deleteImage(image.id);
    setIsExpanded(false);
    toast.success("Imagem excluída com sucesso");
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
        <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Image */}
          <img
            src={image.generated_image_url}
            alt={image.style_name}
            className="w-full h-auto max-h-[70vh] object-contain rounded-xl animate-scale-in"
          />

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 mt-6 animate-fade-in">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-14 h-14"
            >
              <Heart
                className={`w-6 h-6 ${image.is_favorite ? 'fill-current text-red-500' : ''}`}
              />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-14 h-14"
            >
              <Download className="w-6 h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-14 h-14"
            >
              <Share2 className="w-6 h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full w-14 h-14"
            >
              <Trash2 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative cursor-pointer animate-scale-in"
      onClick={() => setIsExpanded(true)}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-elegant hover:shadow-medium transition-smooth bg-persona-light">
        <img
          src={image.generated_image_url}
          alt={image.style_name}
          className="w-full h-auto object-contain transition-smooth group-hover:scale-105"
        />
        
        {/* Persona watermark */}
        <div className="absolute bottom-4 right-4 text-white/60 text-xs font-light tracking-wide">
          PERSONA
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
      </div>
      
      {/* Style label */}
      <p className="mt-4 text-center text-persona-subtle font-light text-sm">
        {image.style_name}
      </p>
    </div>
  );
};

export default ImageCard;
