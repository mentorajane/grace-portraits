import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImageContext } from "@/contexts/ImageContext";
import {
  STYLE_DEFINITIONS,
  MAX_STYLES_PER_REQUEST,
  type StyleDefinition,
} from "@/lib/stylePrompts";
import { cn } from "@/lib/utils";

const SelectStyles = () => {
  const navigate = useNavigate();
  const { uploadedImage, setSelectedStyles } = useImageContext();
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    if (!uploadedImage) navigate("/");
  }, [uploadedImage, navigate]);

  const grouped = useMemo(() => {
    const map = new Map<string, StyleDefinition[]>();
    for (const s of STYLE_DEFINITIONS) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return Array.from(map.entries());
  }, []);

  const toggle = (name: string) => {
    setPicked((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= MAX_STYLES_PER_REQUEST) return prev;
      return [...prev, name];
    });
  };

  const handleGenerate = () => {
    if (picked.length === 0) return;
    setSelectedStyles(picked);
    navigate("/processing");
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 md:py-10 pb-28 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="rounded-full text-persona-medium hover:text-persona-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <span className="text-sm text-persona-medium font-light">
            {picked.length}/{MAX_STYLES_PER_REQUEST} selecionados
          </span>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-persona-dark tracking-tight">
            Escolha seus estilos
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-persona-medium font-light">
            Selecione até {MAX_STYLES_PER_REQUEST} para gerar agora.
          </p>
        </div>

        <div className="space-y-10">
          {grouped.map(([category, styles]) => (
            <section key={category} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-serif text-persona-dark">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {styles.map((style) => {
                  const isPicked = picked.includes(style.name);
                  const disabled =
                    !isPicked && picked.length >= MAX_STYLES_PER_REQUEST;
                  return (
                    <button
                      key={style.name}
                      type="button"
                      onClick={() => toggle(style.name)}
                      disabled={disabled}
                      className={cn(
                        "relative text-left p-5 rounded-2xl border transition-smooth shadow-sm",
                        "bg-background hover:shadow-elegant",
                        isPicked
                          ? "border-persona-dark ring-2 ring-persona-dark"
                          : "border-persona-subtle/40",
                        disabled && "opacity-40 cursor-not-allowed",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-medium text-persona-dark">
                            {style.name}
                          </p>
                          <p className="text-sm text-persona-medium font-light">
                            {style.description}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-smooth",
                            isPicked
                              ? "bg-persona-dark border-persona-dark"
                              : "border-persona-subtle",
                          )}
                        >
                          {isPicked && (
                            <Check className="w-4 h-4 text-background" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="sticky bottom-4 flex justify-center pt-4">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={picked.length === 0}
            className="rounded-full shadow-elegant px-8"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Gerar {picked.length > 0 ? `${picked.length} ` : ""}
            {picked.length === 1 ? "imagem" : "imagens"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectStyles;
