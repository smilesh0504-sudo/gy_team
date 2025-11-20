
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, TrendingUp, LoaderCircle, CheckCircle } from 'lucide-react';
import FileInput from './FileInput';
import ImageInput from './ImageInput';
import TextInput from './TextInput';

interface AddDataPageProps {
    dataCount: number;
    newlyAddedCount: number;
    onFileUpload: (file: File) => void;
    onImageUpload: (files: File[]) => Promise<{ valid: boolean; count: number }>;
    onProcessTextData: (data: { item: string, totalSpent: number, category: string }[]) => void;
    onGoToResult: () => void;
    isLoading: boolean;
}

const PRIMARY_BLUE = '#3182F6';

const AddDataPage: React.FC<AddDataPageProps> = ({ dataCount, newlyAddedCount, onFileUpload, onImageUpload, onProcessTextData, onGoToResult, isLoading }) => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Handle Image Selection
    const handleImagesChange = (newFiles: File[]) => {
        const updatedFiles = [...imageFiles, ...newFiles];
        setImageFiles(updatedFiles);
        
        // Create object URLs for previews
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    // Handle Image Removal
    const removeImage = useCallback((index: number) => {
        URL.revokeObjectURL(previewUrls[index]); // Memory cleanup
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    }, [previewUrls]);

    // Cleanup URLs on unmount
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGoToResultClick = async () => {
        let shouldProceed = true;
        if (imageFiles.length > 0) {
            const result = await onImageUpload(imageFiles);
            // Clear images after processing if successful or handled
            setImageFiles([]);
            setPreviewUrls(prev => {
                prev.forEach(url => URL.revokeObjectURL(url));
                return [];
            });

            if(!result.valid) {
                 alert(`⚠️ 잘못된 이미지가 감지되었습니다! 금융 거래 내역 이미지를 업로드해주세요.`);
                 shouldProceed = false;
            } else {
                 alert(`✅ ${imageFiles.length}장의 이미지에서 ${result.count}개의 데이터를 추가했습니다!`);
            }
        }
        
        if (shouldProceed) {
            onGoToResult();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-center gap-2">
                    <div style={{ backgroundColor: PRIMARY_BLUE }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold" style={{ color: PRIMARY_BLUE }}>소비 데이터 추가</h1>
                </div>
            </header>

            <main className="flex-grow">
                <div className="max-w-2xl mx-auto px-5 py-8">
                     <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                            추가 데이터를<br />입력해주세요
                        </h2>
                        <p className="text-gray-600 text-base">더 정확한 분석을 위해 데이터를 추가하세요</p>
                    </div>

                    {newlyAddedCount > 0 && !isLoading && (
                        <div className="bg-green-50 text-green-800 rounded-2xl p-4 mb-4 text-center border-2 border-green-200 flex items-center justify-center gap-2">
                            <CheckCircle size={20} />
                            <p className="font-semibold">
                                 {newlyAddedCount}개의 데이터가 추가되었습니다!
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 mb-8 items-start">
                       <div className="w-full">
                            <FileInput onFileSelect={onFileUpload} />
                       </div>
                       <div className="w-full">
                           <ImageInput 
                                onImagesChange={handleImagesChange} 
                                previewUrls={previewUrls}
                                onRemoveImage={removeImage}
                           />
                       </div>
                       <div className="w-full">
                           <TextInput onTextSubmit={onProcessTextData} />
                       </div>
                    </div>
                </div>
            </main>
            
            <footer className="sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-blue-100 rounded-xl p-3 mb-4 text-center border border-blue-200">
                        <p className="font-semibold" style={{ color: '#1E40AF' }}>
                            현재 총 <span className="text-2xl font-bold" style={{color: PRIMARY_BLUE}}>{dataCount + imageFiles.length}</span>개의 소비 데이터
                        </p>
                    </div>
                    <button
                        onClick={handleGoToResultClick}
                        disabled={isLoading}
                        style={{ backgroundColor: !isLoading ? PRIMARY_BLUE : '' }}
                        className="w-full text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 text-lg disabled:bg-gray-400"
                    >
                        {isLoading ? <LoaderCircle className="animate-spin" size={24} /> : <>분석 결과 보기 <ArrowRight size={24} /></>}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default AddDataPage;
