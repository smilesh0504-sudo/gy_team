
import React from 'react';
import { Keyboard } from 'lucide-react';

const PRIMARY_BLUE = '#3182F6';

interface TextInputProps {
    onTextSubmit: (data: { item: string, totalSpent: number, category: string }[]) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onTextSubmit }) => {
    const handleTextBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (!text.trim()) return;

        const lines = text.split('\n').filter(line => line.trim() !== '');
        const parsed = lines.map(line => {
            const parts = line.split(/\s+/);
            const amountStr = parts.pop() || '0';
            const amount = Math.abs(parseFloat(amountStr.replace(/,/g, '')));
            const item = parts.join(' ');
            return { item, totalSpent: isNaN(amount) ? 0 : amount, category: '알 수 없음' };
        }).filter(d => d.item && d.totalSpent > 0);

        if (parsed.length > 0) {
            onTextSubmit(parsed);
            e.target.value = '';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-0 border-2 border-gray-200 hover:border-blue-300 transition-colors h-40 overflow-hidden relative group">
             <textarea
                placeholder="직접 입력&#10;예: 커피 4500"
                onBlur={handleTextBlur}
                className="w-full h-full bg-transparent p-4 focus:outline-none focus:bg-blue-50/30 resize-none text-sm text-gray-700 text-center pt-20 z-10 relative leading-relaxed"
            />
             <div className="absolute top-0 left-0 right-0 h-20 flex flex-col items-center justify-center pointer-events-none">
                <Keyboard className="mb-2" style={{ color: PRIMARY_BLUE }} size={32} />
                <span className="text-sm font-bold text-gray-900 block">텍스트</span>
            </div>
        </div>
    );
};

export default TextInput;