import { useState } from "react";
import { Heart, Download, Copy, FileText, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useImageContext } from "@/contexts/ImageContext";
import { buildFullPrompt } from "@/lib/stylePrompts";

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

  const handleToggleFavorite = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    toggleFavorite(image.id);
    toast.success(image.is_favorite ? "Voto removido" : "Votado!");
  };

  const handleDownloadPNG = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const response = await fetch(image.generated_image_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `persona-${image.style_name.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Imagem baixada em PNG!");
    } catch {
      toast.error("Erro ao baixar imagem");
    }
  };

  const handleCopyImage = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const response = await fetch(image.generated_image_url);
      const blob = await response.blob();
      // Convert to PNG to ensure clipboard compatibility
      const imgBitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = imgBitmap.width;
      canvas.height = imgBitmap.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(imgBitmap, 0, 0);
      const pngBlob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b as Blob), "image/png")
      );
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
      toast.success("Imagem copiada!");
    } catch {
      toast.error("Cópia de imagem não suportada neste navegador");
    }
  };

  const handleCopyPrompt = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const fullPrompt = buildFullPrompt(image.style_name);
      await navigator.clipboard.writeText(fullPrompt);
      toast.success("Prompt profissional copiado!");
    } catch {
      toast.error("Erro ao copiar prompt");
    }
  };

  const handleDelete = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    await deleteImage(image.id);
    setIsExpanded(false);
    toast.success("Imagem excluída com sucesso");
  };

  const ActionButtons = ({ variant }: { variant: "card" | "lightbox" }) => {
    const isLightbox = variant === "lightbox";
    const btnClass = isLightbox
      ? "bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12"
      : "bg-white/90 hover:bg-white text-persona-dark rounded-full w-10 h-10 shadow-elegant";

    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFavorite}
          className={btnClass}
          title="Votar"
        >
          <Heart
            className={`w-5 h-5 ${image.is_favorite ? "fill-current text-red-500" : ""}`}
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyImage}
          className={btnClass}
          title="Copiar imagem"
        >
          <Copy className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadPNG}
          className={btnClass}
          title="Baixar em PNG"
        >
          <Download className="w-5 h-5" />
        </Button>

        {isLightbox && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full w-12 h-12"
            title="Excluir"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
      </>
    );
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
        <div className="relative max-w-4xl w-full flex flex-col my-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>

          <img
            src={image.generated_image_url}
            alt={image.style_name}
            className="w-full h-auto max-h-[70vh] object-contain rounded-xl animate-scale-in"
          />

          <div className="flex items-center justify-center gap-3 mt-6 animate-fade-in flex-wrap">
            <ActionButtons variant="lightbox" />
          </div>

          {/* Prompt caption */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5 text-white/90 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium tracking-wide uppercase text-white/70">
                Prompt profissional — {image.style_name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPrompt}
                className="text-white hover:bg-white/10 rounded-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Copiar prompt
              </Button>
            </div>
            <pre className="whitespace-pre-wrap text-xs md:text-sm font-light leading-relaxed text-white/80 max-h-64 overflow-y-auto">
{buildFullPrompt(image.style_name)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative animate-scale-in">
      <div
        className="relative overflow-hidden rounded-2xl shadow-elegant hover:shadow-medium transition-smooth bg-persona-light cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <img
          src={image.generated_image_url}
          alt={image.style_name}
          className="w-full h-auto object-contain transition-smooth group-hover:scale-105"
        />

        <div className="absolute bottom-4 right-4 text-white/60 text-xs font-light tracking-wide">
          PERSONA
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none" />

        {/* Per-card action bar */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
          <ActionButtons variant="card" />
        </div>
      </div>

      {/* Caption with style + copy prompt */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <p className="text-center text-persona-subtle font-light text-sm">
          {image.style_name}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyPrompt}
          className="h-7 px-2 text-xs text-persona-medium hover:text-persona-dark hover:bg-persona-light rounded-full"
          title="Copiar prompt profissional"
        >
          <FileText className="w-3.5 h-3.5 mr-1" />
          Copiar prompt
        </Button>
      </div>
    </div>
  );
};

export default ImageCard;
