import { createContext, useContext, useState, ReactNode } from "react";

interface GeneratedImage {
  style: string;
  url: string;
}

interface ImageContextType {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  generatedImages: GeneratedImage[];
  setGeneratedImages: (images: GeneratedImage[]) => void;
  favoriteImages: GeneratedImage[];
  toggleFavorite: (image: GeneratedImage) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [favoriteImages, setFavoriteImages] = useState<GeneratedImage[]>([]);

  const toggleFavorite = (image: GeneratedImage) => {
    setFavoriteImages((prev) => {
      const exists = prev.some((fav) => fav.url === image.url);
      if (exists) {
        return prev.filter((fav) => fav.url !== image.url);
      }
      return [...prev, image];
    });
  };

  return (
    <ImageContext.Provider
      value={{
        uploadedImage,
        setUploadedImage,
        generatedImages,
        setGeneratedImages,
        favoriteImages,
        toggleFavorite,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within ImageProvider");
  }
  return context;
};
