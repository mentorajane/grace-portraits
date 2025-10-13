import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

type GeneratedImage = {
  id: string;
  style_name: string;
  generated_image_url: string;
  is_favorite: boolean;
  created_at: string;
};

type ImageContextType = {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  generatedImages: GeneratedImage[];
  setGeneratedImages: (images: GeneratedImage[]) => void;
  favoriteImages: GeneratedImage[];
  toggleFavorite: (imageId: string) => void;
  loadImages: () => Promise<void>;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [favoriteImages, setFavoriteImages] = useState<GeneratedImage[]>([]);

  const loadImages = async () => {
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading images:', error);
      return;
    }

    if (data) {
      setGeneratedImages(data);
      setFavoriteImages(data.filter(img => img.is_favorite));
    }
  };

  const toggleFavorite = async (imageId: string) => {
    const image = generatedImages.find(img => img.id === imageId);
    if (!image) return;

    const newFavoriteStatus = !image.is_favorite;

    const { error } = await supabase
      .from('generated_images')
      .update({ is_favorite: newFavoriteStatus })
      .eq('id', imageId);

    if (error) {
      console.error('Error updating favorite:', error);
      return;
    }

    // Update local state
    setGeneratedImages(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, is_favorite: newFavoriteStatus } : img
      )
    );

    setFavoriteImages(prev =>
      newFavoriteStatus
        ? [...prev, { ...image, is_favorite: true }]
        : prev.filter(img => img.id !== imageId)
    );
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <ImageContext.Provider
      value={{
        uploadedImage,
        setUploadedImage,
        generatedImages,
        setGeneratedImages,
        favoriteImages,
        toggleFavorite,
        loadImages,
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
