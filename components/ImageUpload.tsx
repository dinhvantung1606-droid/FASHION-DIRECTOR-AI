import React from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  id: string;
  label: string;
  required?: boolean;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  label,
  required = false,
  previewUrl,
  onFileSelect,
  onRemove,
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-3 group">
      <div className="flex justify-between items-end">
        <label className="text-sm font-medium text-zinc-800 tracking-wide uppercase">
          {label}
        </label>
        {required ? (
          <span className="text-[10px] font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">Bắt buộc</span>
        ) : (
          <span className="text-[10px] font-medium text-zinc-300 italic">Tuỳ chọn</span>
        )}
      </div>
      
      <div className="relative w-full aspect-[3/4] transition-all duration-300 ease-in-out">
        {previewUrl ? (
          <div className="relative h-full w-full rounded-sm overflow-hidden border border-zinc-200 shadow-sm group-hover:shadow-md transition-shadow bg-white">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
            
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 bg-white/90 text-zinc-900 p-1.5 rounded-full shadow-sm hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            >
              <X size={14} />
            </button>
            
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Uploaded
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="h-full w-full border border-dashed border-zinc-300 rounded-sm flex flex-col items-center justify-center bg-zinc-50 hover:bg-white hover:border-zinc-400 transition-all cursor-pointer relative group-hover:shadow-sm"
          >
            <input
              id={id}
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleChange}
            />
            <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center mb-3 text-zinc-400 group-hover:text-zinc-800 group-hover:border-zinc-400 transition-colors">
               <Upload size={18} strokeWidth={1.5} />
            </div>
            <p className="text-xs text-zinc-500 font-medium text-center px-4 mb-1 group-hover:text-zinc-800 transition-colors">
              Click hoặc Kéo thả
            </p>
            <p className="text-[10px] text-zinc-400 text-center">
              JPG, PNG
            </p>
          </div>
        )}
      </div>
    </div>
  );
};