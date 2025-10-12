import { useState } from "react";
import { Upload as UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store image temporarily (in real app, would upload to server)
      const reader = new FileReader();
      reader.onloadend = () => {
        sessionStorage.setItem('uploadedImage', reader.result as string);
        navigate('/processing');
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
      const reader = new FileReader();
      reader.onloadend = () => {
        sessionStorage.setItem('uploadedImage', reader.result as string);
        navigate('/processing');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-persona-dark tracking-tight">
            Persona
          </h1>
          <p className="text-lg md:text-xl text-persona-medium font-light">
            Sua visão. Nossa arte.
          </p>
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
              className={`w-64 h-64 md:w-80 md:h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center space-y-4 transition-smooth shadow-elegant ${
                isDragging
                  ? 'border-accent bg-accent/5'
                  : 'border-persona-subtle hover:border-persona-medium'
              }`}
            >
              <UploadIcon
                className={`w-16 h-16 transition-smooth ${
                  isDragging ? 'text-accent' : 'text-persona-medium'
                }`}
              />
              <div className="text-persona-medium text-base font-light">
                Toque ou arraste sua foto
              </div>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        <p className="text-sm md:text-base text-persona-subtle font-light">
          Toque para iniciar sua sessão de foto.
        </p>
      </div>
    </div>
  );
};

export default Upload;
