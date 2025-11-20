import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, UserPlus, LoaderCircle, CheckCircle, XCircle } from 'lucide-react';
import PasswordInput from './PasswordInput';

interface SignUpPageProps {
    onSignUp: (nickname: string, id: string) => void;
    onGoBack: () => void;
    authLoading: boolean;
}

const PRIMARY_BLUE = '#3182F6';

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onGoBack, authLoading }) => {
    const [nickname, setNickname] = useState('');
    const [id, setId] = useState('');
    const [idConfirm, setIdConfirm] = useState('');
    
    // Validation States
    const [nicknameError, setNicknameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmMessage, setConfirmMessage] = useState<{text: string, isError: boolean} | null>(null);

    // 닉네임 유효성 검사
    useEffect(() => {
        if (nickname.length > 13) {
            setNicknameError('닉네임은 최대 13자까지 가능합니다.');
        } else {
            setNicknameError('');
        }
    }, [nickname]);

    // 비밀번호 유효성 검사
    useEffect(() => {
        if (!id) {
            setPasswordError('');
            return;
        }
        // 4~14자, 영문+숫자 조합
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,14}$/;
        if (!passwordRegex.test(id)) {
            setPasswordError('4~14자, 영문과 숫자를 조합해주세요.');
        } else {
            setPasswordError('');
        }
    }, [id]);

    // 비밀번호 확인 일치 여부 검사
    useEffect(() => {
        if (!id || !idConfirm) {
            setConfirmMessage(null);
            return;
        }
        if (id === idConfirm) {
            setConfirmMessage({ text: '비밀번호가 일치합니다.', isError: false });
        } else {
            setConfirmMessage({ text: '비밀번호가 일치하지 않습니다.', isError: true });
        }
    }, [id, idConfirm]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 최종 제출 전 한 번 더 검증
        if (nickname.length > 13) return;
        if (passwordError) return;
        if (id !== idConfirm) return;

        if (authLoading) return;
        onSignUp(nickname, id);
    };

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    };

    const isFormValid = nickname && id && idConfirm && !nicknameError && !passwordError && confirmMessage && !confirmMessage.isError;

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
                        <h1 className="text-2xl font-bold" style={{ color: PRIMARY_BLUE }}>회원가입</h1>
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
                                onChange={handleNicknameChange}
                                required
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${nicknameError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                                placeholder="닉네임 (최대 13자)"
                            />
                            {nicknameError && <p className="text-xs text-red-500 mt-1 ml-1">{nicknameError}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                            <PasswordInput
                                id="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="4~14자, 영문/숫자 조합"
                                required
                                className={passwordError ? 'border-red-300' : ''}
                            />
                             {passwordError && (
                                <div className="flex items-center gap-1 mt-1 ml-1 text-xs text-red-500">
                                    <XCircle size={12} />
                                    <span>{passwordError}</span>
                                </div>
                             )}
                        </div>

                         <div>
                            <label htmlFor="id-confirm" className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                            <PasswordInput
                                id="id-confirm"
                                value={idConfirm}
                                onChange={(e) => setIdConfirm(e.target.value)}
                                placeholder="비밀번호 재입력"
                                required
                            />
                            {confirmMessage && (
                                <div className={`flex items-center gap-1 mt-1 ml-1 text-xs font-medium ${confirmMessage.isError ? 'text-red-500' : 'text-green-600'}`}>
                                    {confirmMessage.isError ? <XCircle size={12} /> : <CheckCircle size={12} />}
                                    <span>{confirmMessage.text}</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            style={{ backgroundColor: isFormValid && !authLoading ? PRIMARY_BLUE : '#9CA3AF' }}
                            className="w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg cursor-pointer disabled:cursor-not-allowed"
                            disabled={!isFormValid || authLoading}
                        >
                            {authLoading ? <LoaderCircle className="animate-spin" size={24} /> : <><UserPlus size={24} /> 가입하기</>}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default SignUpPage;