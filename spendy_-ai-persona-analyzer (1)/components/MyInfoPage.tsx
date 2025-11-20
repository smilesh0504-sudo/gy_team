
import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Archive, Eye, Trash2, Camera } from 'lucide-react';
import type { User as UserType, AnalysisVersion } from '../types';
import { PERSONAS } from '../constants/personas';

interface MyInfoPageProps {
    user: UserType | null;
    onLogout: () => void;
    versions: AnalysisVersion[];
    onViewVersion: (id: string) => void;
    onDeleteVersion: (id: string) => void;
}

const PRIMARY_BLUE = '#3182F6';

const MyInfoPage: React.FC<MyInfoPageProps> = ({ user, onLogout, versions, onViewVersion, onDeleteVersion }) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            const savedImage = localStorage.getItem(`spendy_profile_img_${user.id}`);
            if (savedImage) {
                setProfileImage(savedImage);
            } else {
                setProfileImage(null);
            }
        }
    }, [user]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && user) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileImage(base64String);
                localStorage.setItem(`spendy_profile_img_${user.id}`, base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-2xl mx-auto px-6 py-4 text-center">
                     <h1 className="text-xl font-bold" style={{ color: PRIMARY_BLUE }}>내 정보</h1>
                </div>
            </header>
            <main className="flex-grow max-w-2xl mx-auto w-full px-6 py-12 pb-32">
                <div className="bg-white rounded-3xl p-10 shadow-sm text-center flex flex-col items-center border border-gray-100">
                    <div className="relative mb-8 group cursor-pointer" onClick={handleProfileClick}>
                        <div className="w-32 h-32 rounded-full flex items-center justify-center bg-blue-50 overflow-hidden border-[6px] border-blue-50/50 shadow-inner">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={72} className="text-blue-400" />
                            )}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-md border border-gray-100 group-hover:scale-110 transition-transform">
                            <Camera size={20} className="text-gray-600" />
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                        />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2.5">{user?.nickname}님</h2>
                    <p className="text-gray-500 font-medium">Spendy에 오신 것을 환영합니다!</p>
                </div>
                
                <div className="mt-12">
                     <h3 className="text-lg font-bold text-gray-800 mb-6 px-1">분석 기록</h3>
                     {versions.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                            <Archive size={56} className="mx-auto text-gray-300 mb-5" />
                            <h2 className="text-lg font-bold text-gray-600">기록이 없습니다</h2>
                            <p className="text-gray-400 mt-2 text-sm">분석을 완료하면 이곳에 저장됩니다.</p>
                        </div>
                    ) : (
                        <ul className="space-y-5">
                            {versions.map(version => {
                                const personaInfo = version.persona ? PERSONAS[version.persona] : null;
                                const totalSpent = Object.values(version.analysis || {}).reduce((sum: number, val) => sum + (Number(val) || 0), 0);
                                const personaInitial = personaInfo ? personaInfo.name.charAt(0) : '?';

                                return (
                                    <li key={version.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:shadow-md">
                                        <div 
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl shadow-sm"
                                            style={{ backgroundColor: personaInfo?.color || '#A0AEC0' }}
                                        >
                                            <span>{personaInitial}</span>
                                        </div>
                                        <div className="flex-grow min-w-0 py-1">
                                            <p className="font-bold text-gray-900 truncate text-lg mb-1.5">{personaInfo?.name || '알 수 없음'}</p>
                                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 font-medium gap-1 sm:gap-0">
                                                <span>{new Date(version.createdAt).toLocaleDateString()}</span>
                                                <span className="hidden sm:inline mx-2 text-gray-300">|</span>
                                                <span>₩{totalSpent.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => onViewVersion(version.id)} 
                                                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                                                aria-label="View Details"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <button 
                                                onClick={() => onDeleteVersion(version.id)} 
                                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                                aria-label="Delete Entry"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="w-full mt-12 mx-auto">
                     <button
                        onClick={onLogout}
                        className="w-full text-gray-500 font-bold py-4.5 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all bg-transparent border border-gray-200 flex items-center justify-center gap-2 text-base"
                    >
                        <LogOut size={20} />
                        로그아웃
                    </button>
                </div>
            </main>
        </div>
    );
};

export default MyInfoPage;
