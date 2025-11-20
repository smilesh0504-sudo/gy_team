
import React from 'react';
import { FileText } from 'lucide-react';

const PRIMARY_BLUE = '#3182F6';

interface FileInputProps {
    onFileSelect: (file: File) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
            // Clear the input value to allow re-uploading the same file
            e.target.value = '';
        }
    };
    
    return (
        <label className="cursor-pointer block h-40">
            <div className="bg-white rounded-2xl p-4 text-center hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-blue-300 flex flex-col items-center justify-center h-full">
                <FileText className="mb-2" style={{ color: PRIMARY_BLUE }} size={32} />
                <span className="text-sm font-bold text-gray-900 block mb-1">파일</span>
                <span className="text-xs text-gray-500">CSV/Excel/TXT</span>
            </div>
            <input type="file" accept=".csv,.xlsx,.xls,.txt" onChange={handleFileChange} className="hidden" />
        </label>
    );
};

export default FileInput;
