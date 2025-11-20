
import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';

interface MainPageProps {
    onNavigateToLogin: () => void;
    onNavigateToSignUp: () => void;
}

const PRIMARY_BLUE = '#3182F6';

const MainLogo = () => (
    <svg width="100" height="100" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <rect width="512" height="512" rx="128" fill="url(#paint0_linear)" />
        <rect x="146" y="140" width="50" height="150" rx="8" fill="white" fillOpacity="0.5" />
        <rect x="230" y="90" width="50" height="200" rx="8" fill="white" fillOpacity="0.7" />
        <rect x="314" y="40" width="50" height="250" rx="8" fill="white" fillOpacity="0.9" />
        <path d="M256 320C150 320 70 360 50 400C40 420 60 450 80 460C130 480 200 440 256 440C312 440 382 480 432 460C452 450 472 420 462 400C442 360 362 320 256 320ZM166 370C146 370 130 384 130 400C130 416 146 430 166 430C186 430 202 416 202 400C202 384 186 370 166 370ZM346 370C326 370 310 384 310 400C310 416 326 430 346 430C366 430 382 416 382 400C382 384 366 370 346 370Z" fill="white" />
        <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
        </defs>
    </svg>
);

const MainPage: React.FC<MainPageProps> = ({ onNavigateToLogin, onNavigateToSignUp }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center text-center p-5 font-sans">
            <div className="flex flex-col items-center gap-6 mb-16 transform transition-all hover:scale-105 duration-500">
                <MainLogo />
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tight text-gray-900">
                        Spendy
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">
                        소비 뒤에 숨겨진<br/>나의 <span style={{color: PRIMARY_BLUE}}>페르소나</span>를 찾아보세요
                    </p>
                </div>
            </div>

            <div className="w-full max-w-xs space-y-4">
                <button
                    onClick={onNavigateToLogin}
                    style={{ backgroundColor: PRIMARY_BLUE }}
                    className="w-full text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                >
                    <LogIn size={24} />
                    로그인
                </button>
                <button
                    onClick={onNavigateToSignUp}
                    className="w-full text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all bg-white border-2 border-gray-200 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                >
                    <UserPlus size={24} />
                    회원가입
                </button>
            </div>
        </div>
    );
};

export default MainPage;
