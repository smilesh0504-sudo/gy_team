
import React from 'react';
import { LayoutGrid, User } from 'lucide-react';

export type Tab = 'analysis' | 'myinfo';

interface AppLayoutProps {
    children: React.ReactNode;
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const PRIMARY_BLUE = '#3182F6';

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button 
        onClick={onClick} 
        className={`flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className={`text-xs font-semibold ${isActive ? `text-blue-600` : 'text-gray-600'}`}>{label}</span>
    </button>
);

const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="pb-20">
                {children}
            </div>
            <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-50">
                <nav className="max-w-2xl mx-auto flex justify-around">
                    <NavItem
                        icon={<LayoutGrid size={24} />}
                        label="분석"
                        isActive={activeTab === 'analysis'}
                        onClick={() => onTabChange('analysis')}
                    />
                    <NavItem
                        icon={<User size={24} />}
                        label="내 정보"
                        isActive={activeTab === 'myinfo'}
                        onClick={() => onTabChange('myinfo')}
                    />
                </nav>
            </footer>
        </div>
    );
};

export default AppLayout;