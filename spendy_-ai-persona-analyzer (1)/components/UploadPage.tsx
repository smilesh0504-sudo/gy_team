
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, TrendingUp, AlertCircle, LoaderCircle } from 'lucide-react';
import FileInput from './FileInput';
import ImageInput from './ImageInput';
import TextInput from './TextInput';

interface UploadPageProps {
    dataCount: number;
    onFileUpload: (file: File) => void;
    onImageUpload: (files: File[]) => Promise<{ valid: boolean; count: number }>;
    onProcessTextData: (data: { item: string, totalSpent: number, category: string }[]) => void;
    onGoToResult: () => void;
    onSetRusherPersona: () => void;
    isLoading: boolean;
}

const PRIMARY_BLUE = '#3182F6';

const UploadPage: React.FC<UploadPageProps> = ({ dataCount, onFileUpload, onImageUpload, onProcessTextData, onGoToResult, onSetRusherPersona, isLoading }) => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [invalidImageWarning, setInvalidImageWarning] = useState(false);
    const [analyzeButtonClickCount, setAnalyzeButtonClickCount] = useState(0);

    // Generate preview URLs when new files are selected
    const handleImagesChange = (newFiles: File[]) => {
        const updatedFiles = [...imageFiles, ...newFiles];
        setImageFiles(updatedFiles);
        
        // Create object URLs for previews
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);

        if (invalidImageWarning) {
            setInvalidImageWarning(false);
            setAnalyzeButtonClickCount(0);
        }
    };

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
    
    const handleAnalyzeClick = async () => {
        if (imageFiles.length > 0 && !invalidImageWarning) {
            const result = await onImageUpload(imageFiles);
            if (!result.valid) {
                setInvalidImageWarning(true);
                alert("잘못된 이미지가 포함되어 있습니다. 제거하거나, 다시 한 번 버튼을 누르면 특별 페르소나로 분석이 진행됩니다.");
                return;
            }
        }
        
        if (invalidImageWarning) {
            if (analyzeButtonClickCount === 0) {
                setAnalyzeButtonClickCount(1);
                return;
            } else {
                onSetRusherPersona();
                return;
            }
        }

        onGoToResult();
    };

    const canProceed = (dataCount > 0 || imageFiles.length > 0) && !isLoading;

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col font-sans">
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
            <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div style={{ backgroundColor: PRIMARY_BLUE }} className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md">
                        <TrendingUp size={22} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: PRIMARY_BLUE }}>Spendy</h1>
                </div>
            </div>
        </header>

        <main className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 pb-32">
            <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    소비 데이터를<br />업로드해주세요
                </h2>
                <p className="text-gray-500 text-lg">당신의 소비 패턴을 AI가 똑똑하게 분석해드립니다</p>
            </div>

            {invalidImageWarning && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex items-start gap-4 shadow-sm">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                    <div>
                        <h3 className="font-bold text-red-900 mb-1 text-lg">⚠️ 잘못된 이미지 감지</h3>
                        <p className="text-sm text-red-700 leading-relaxed">
                            금융 관련 이미지(영수증, 내역 등)만 업로드 가능합니다.<br/>
                            무시하고 진행 시 '생각없는 직진가' 페르소나가 부여됩니다.
                        </p>
                    </div>
                </div>
            )}
            
            {/* 입력 방식 그리드 (간격 확장 및 깔끔한 배치) */}
            <div className="grid grid-cols-3 gap-5 mb-12 items-start">
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

            {/* 분석 버튼 */}
            <div className="mt-auto space-y-5">
                {(dataCount > 0 || imageFiles.length > 0) && (
                    <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                        <p className="font-medium text-gray-700">
                            총 <span className="text-2xl font-bold mx-1" style={{color: PRIMARY_BLUE}}>{dataCount + imageFiles.length}</span>개의 데이터가 준비되었습니다.
                        </p>
                    </div>
                )}
                <button
                    onClick={handleAnalyzeClick}
                    disabled={!canProceed}
                    style={{ backgroundColor: canProceed ? PRIMARY_BLUE : '' }}
                    className="w-full text-white text-lg font-bold py-4.5 rounded-2xl hover:opacity-95 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                    {isLoading ? <LoaderCircle className="animate-spin" size={26} /> : <>분석 결과 보기 <ArrowRight size={24} /></>}
                </button>
            </div>
        </main>
      </div>
    );
};

export default UploadPage;
