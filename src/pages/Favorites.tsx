import { useNavigate } from "react-router-dom";
import ImageCard from "@/components/ImageCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useImageContext } from "@/contexts/ImageContext";

const Favorites = () => {
  const navigate = useNavigate();
  const { favoriteImages } = useImageContext();

  const favorites = favoriteImages.map((img, index) => ({
    id: index + 1,
    url: img.url,
    style: img.style,
  }));

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 md:py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/results')}
            className="text-persona-medium hover:text-persona-dark transition-smooth"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-persona-dark tracking-tight">
              Meu Book de Favoritos
            </h1>
            <p className="text-lg md:text-xl text-persona-medium font-light">
              {favorites.length === 0 
                ? "Nenhuma foto favorita ainda"
                : `${favorites.length} ${favorites.length === 1 ? 'foto' : 'fotos'} salva${favorites.length === 1 ? '' : 's'}`
              }
            </p>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {favorites.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-persona-subtle text-lg">
              Suas fotos favoritas aparecerão aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
