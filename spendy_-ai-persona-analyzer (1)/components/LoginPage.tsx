
import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, LogIn, LoaderCircle } from 'lucide-react';
import PasswordInput from './PasswordInput';

interface LoginPageProps {
    onLogin: (nickname: string, id: string) => void;
    onGoBack: () => void;
    authLoading: boolean;
}

const PRIMARY_BLUE = '#3182F6';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoBack, authLoading }) => {
    const [nickname, setNickname] = useState('');
    const [id, setId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (authLoading) return;
        onLogin(nickname, id);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-md mx-auto px-5 py-4 flex items-center">
                    <button onClick={onGoBack} className="p-2 -ml-2 text-gray-600 hover:text-blue-600" aria-label="Go back">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex-grow flex items-center justify-center gap-2 pr-8">
                        <div style={{ backgroundColor: PRIMARY_BLUE }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold" style={{ color: PRIMARY_BLUE }}>로그인</h1>
                    </div>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                            <input
                                id="nickname"
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                placeholder="닉네임을 입력하세요"
                            />
                        </div>
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                            <PasswordInput
                                id="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            style={{ backgroundColor: PRIMARY_BLUE }}
                            className="w-full text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 text-lg disabled:bg-gray-400"
                            disabled={!nickname || !id || authLoading}
                        >
                           {authLoading ? <LoaderCircle className="animate-spin" size={24} /> : <><LogIn size={24} /> 로그인하기</>}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;