
import React from 'react';

interface AlertModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    onConfirm?: () => void; // Optional: If provided, shows Confirm/Cancel buttons
    confirmText?: string;
    cancelText?: string;
    type?: 'alert' | 'confirm'; // UI style variant
}

const PRIMARY_BLUE = '#3182F6';
const DANGER_RED = '#EF4444';

const AlertModal: React.FC<AlertModalProps> = ({ 
    isOpen, 
    message, 
    onClose, 
    onConfirm,
    confirmText = '확인',
    cancelText = '취소',
    type = 'alert'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 w-full max-w-xs sm:max-w-sm shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200 border border-gray-100">
                <div className="text-center">
                    <h3 className={`text-lg font-bold mb-3 ${type === 'confirm' ? 'text-red-600' : 'text-gray-900'}`}>
                        {type === 'confirm' ? '확인 필요' : '알림'}
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-wrap break-keep">
                        {message}
                    </p>
                    
                    {onConfirm ? (
                        <div className="flex gap-3">
                            <button 
                                onClick={onClose}
                                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-2xl hover:bg-gray-200 transition-all"
                            >
                                {cancelText}
                            </button>
                            <button 
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                style={{ backgroundColor: DANGER_RED }}
                                className="flex-1 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-md active:scale-95"
                            >
                                {confirmText === '확인' ? '삭제' : confirmText}
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={onClose}
                            style={{ backgroundColor: PRIMARY_BLUE }}
                            className="w-full text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-md active:scale-95"
                        >
                            확인
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
