
import React from 'react';
import { Image as ImageIcon, X, Plus } from 'lucide-react';

const PRIMARY_BLUE = '#3182F6';

interface ImageInputProps {
    onImagesChange: (files: File[]) => void;
    previewUrls?: string[];
    onRemoveImage?: (index: number) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImagesChange, previewUrls = [], onRemoveImage }) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files: File[] = Array.from(e.target.files);
            if (files.length === 0) return;
            
            onImagesChange(files);
            // Clear the input value to allow re-uploading the same file
            e.target.value = '';
        }
    };

    const handleRemove = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (onRemoveImage) {
            onRemoveImage(index);
        }
    };
    
    const hasImages = previewUrls.length > 0;

    return (
        <label className={`cursor-pointer block relative group ${hasImages ? 'h-auto' : 'h-40'}`}>
            <div className={`bg-white rounded-2xl transition-all border-2 border-gray-200 hover:border-blue-300 flex flex-col items-center justify-center w-full ${hasImages ? 'p-3 min-h-40' : 'h-full p-4'}`}>
                 {!hasImages ? (
                     <>
                        <ImageIcon className="mb-2" style={{ color: PRIMARY_BLUE }} size={32} />
                        <span className="text-sm font-bold text-gray-900 block mb-1">이미지</span>
                        <span className="text-xs text-gray-500 break-keep text-center">거래내역/영수증</span>
                     </>
                 ) : (
                     <div className="w-full grid grid-cols-2 gap-2">
                         {previewUrls.map((url, index) => (
                             <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group/image">
                                 <img src={url} alt={`preview-${index}`} className="w-full h-full object-cover" />
                                 {onRemoveImage && (
                                     <button 
                                         onClick={(e) => handleRemove(e, index)}
                                         className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-1 transition-colors backdrop-blur-sm"
                                     >
                                         <X size={12} />
                                     </button>
                                 )}
                             </div>
                         ))}
                         <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-300 transition-colors bg-gray-50">
                             <Plus size={24} />
                             <span className="text-[10px] font-medium mt-1">추가</span>
                         </div>
                     </div>
                 )}
            </div>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
        </label>
    );
};

export default ImageInput;
