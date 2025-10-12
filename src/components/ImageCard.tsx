import { useState } from "react";
import { Heart, Download, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageCardProps {
  image: {
    id: number;
    url: string;
    style: string;
  };
}

const ImageCard = ({ image }: ImageCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = localStorage.getItem('personaFavorites');
    if (favorites) {
      const favArray = JSON.parse(favorites);
      return favArray.some((fav: any) => fav.id === image.id);
    }
    return false;
  });

  const handleToggleFavorite = () => {
    const favorites = localStorage.getItem('personaFavorites');
    let favArray = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorite) {
      favArray = favArray.filter((fav: any) => fav.id !== image.id);
      toast.success("Removido dos favoritos");
    } else {
      favArray.push(image);
      toast.success("Adicionado aos favoritos");
    }
    
    localStorage.setItem('personaFavorites', JSON.stringify(favArray));
    setIsFavorite(!isFavorite);
  };

  const handleDownload = () => {
    toast.success("Imagem salva!");
    // In production: trigger actual download
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Persona - ${image.style}`,
          text: `Confira minha foto Persona no estilo ${image.style}!`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      toast.info("Compartilhamento não disponível neste navegador");
    }
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
            src={image.url}
            alt={image.style}
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
                className={`w-6 h-6 ${isFavorite ? 'fill-current text-red-500' : ''}`}
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
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-elegant hover:shadow-medium transition-smooth">
        <img
          src={image.url}
          alt={image.style}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
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
        {image.style}
      </p>
    </div>
  );
};

export default ImageCard;
