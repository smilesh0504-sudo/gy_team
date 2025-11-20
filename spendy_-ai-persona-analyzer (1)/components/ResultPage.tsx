
import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, CheckCircle, ArrowLeft, Lightbulb, RefreshCcw, Drama } from 'lucide-react';
import type { Transaction, AnalysisResult, Category } from '../types';
import { PERSONAS } from '../constants/personas';
import { generateIcon } from '../services/geminiService';

interface LiveResultPageProps {
    persona: string | null;
    analysis: AnalysisResult | null;
    data: Transaction[];
    isHistoryView: false;
    onAddData: () => void;
    onFinish: () => void;
    onResetWithoutSave: () => void;
}

interface HistoryResultPageProps {
    persona: string | null;
    analysis: AnalysisResult | null;
    data: Transaction[];
    isHistoryView: true;
    onGoBackToHistory: () => void;
}

type ResultPageProps = LiveResultPageProps | HistoryResultPageProps;


const PRIMARY_BLUE = '#3182F6';
const FINISH_GREEN = '#00C471';
const RESET_GRAY = '#64748B';

const IconPlaceholder: React.FC<{className?: string}> = ({ className }) => (
    <div className={`bg-gray-200 rounded-full animate-pulse ${className}`}></div>
);


const ResultPage: React.FC<ResultPageProps> = (props) => {
    const { persona, analysis, data } = props;
    const [icons, setIcons] = useState<{ [key: string]: string }>({});
    const [excludeUnknown, setExcludeUnknown] = useState(false);

    const { displayedPersona, displayedAnalysis, displayedTotalSpent } = useMemo(() => {
        if (excludeUnknown && analysis) {
            const filteredAnalysis = { ...analysis };
            delete filteredAnalysis['알 수 없음'];

            if (Object.keys(filteredAnalysis).length === 0) {
                 return { displayedPersona: null, displayedAnalysis: {}, displayedTotalSpent: 0 };
            }
            
            const sorted = Object.entries(filteredAnalysis).sort(([, a], [, b]) => (Number(b) || 0) - (Number(a) || 0));
            const topCategory = sorted[0][0];
            const total = Object.values(filteredAnalysis).reduce((sum: number, val) => sum + (Number(val) || 0), 0);
            
            return {
                displayedPersona: topCategory,
                displayedAnalysis: filteredAnalysis,
                displayedTotalSpent: total
            };

        }
        const total = Object.values(analysis || {}).reduce((sum: number, val) => sum + (Number(val) || 0), 0);
        return {
            displayedPersona: persona,
            displayedAnalysis: analysis,
            displayedTotalSpent: total
        };
    }, [excludeUnknown, analysis, persona]);

    const personaInfo = displayedPersona ? PERSONAS[displayedPersona as string] : null;

    useEffect(() => {
        if (!persona || !analysis) return;

        const fetchIconsSequentially = async () => {
             const keysToFetch = Array.from(new Set([
                persona,
                ...Object.keys(analysis),
                ...data.map(d => d.reclassified)
            ].filter(Boolean) as string[]));
            
            for (const key of keysToFetch) {
                if (!icons[key]) {
                    const personaDetails = PERSONAS[key as Category] || personaInfo;
                    if (personaDetails) {
                        const prompt = personaDetails.iconPrompt || key;
                        const color = personaDetails.color;
                        try {
                           const iconUrl = await generateIcon(prompt, color);
                           setIcons(prev => ({ ...prev, [key]: iconUrl }));
                        } catch (e) {
                           console.error(`Failed to fetch icon for ${key}`, e);
                           setIcons(prev => ({ ...prev, [key]: "ERROR" })); // Mark as failed
                        }
                    }
                }
            }
        };

        fetchIconsSequentially();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [persona, analysis, data]);


    if (!personaInfo || !displayedAnalysis) {
        return (
            <div className="flex items-center justify-center min-h-screen text-center p-6 bg-gray-50">
                 <div className="bg-white p-8 rounded-3xl shadow-sm max-w-sm w-full">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">분석 데이터 부족</h2>
                    <p className="text-gray-600 leading-relaxed">'알 수 없는 소비'를 제외하니<br/>표시할 데이터가 없네요!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-center gap-2">
                    <Drama size={24} className="text-blue-600" />
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">분석 결과</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto py-10 px-6 pb-32">
                 <div className="flex justify-end mb-6">
                    <label htmlFor="exclude-toggle" className="flex items-center cursor-pointer group bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm hover:border-blue-200 transition-colors">
                        <span className="mr-3 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">알 수 없는 소비 제외</span>
                        <div className="relative">
                            <input type="checkbox" id="exclude-toggle" className="sr-only peer" checked={excludeUnknown} onChange={() => setExcludeUnknown(!excludeUnknown)} />
                            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 after:shadow-sm"></div>
                        </div>
                    </label>
                </div>

                <div className="space-y-8">
                    {/* Persona Card with Mask Theme */}
                    <div 
                        style={{ backgroundColor: personaInfo.color }} 
                        className="rounded-3xl p-10 shadow-xl shadow-black/5 text-center flex flex-col items-center transform transition-all hover:scale-[1.01] relative overflow-hidden"
                    >
                        {/* Decorative Background Masks */}
                        <Drama className="absolute -top-6 -left-6 text-white opacity-10 rotate-[-15deg]" size={140} />
                        <Drama className="absolute -bottom-6 -right-6 text-white opacity-10 rotate-[15deg]" size={140} />

                        {icons[displayedPersona as string] ?
                            <img src={icons[displayedPersona as string]} alt={`${personaInfo.name} icon`} className="w-40 h-40 object-cover rounded-[40px] mb-8 shadow-lg border-4 border-white/30 relative z-10"/> :
                            <IconPlaceholder className="w-40 h-40 rounded-[40px] mb-8 relative z-10" />
                        }
                        <div className="relative z-10">
                            <span className="inline-block bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/95 text-sm font-semibold mb-3 tracking-wide">나의 소비 가면</span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight shadow-sm">{personaInfo.name}</h2>
                            <p className="text-white text-lg sm:text-xl opacity-95 whitespace-pre-line leading-loose font-medium">{personaInfo.description}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: personaInfo.color }}></div>
                        <p className="text-xl text-gray-800 leading-loose text-center font-medium px-2">"{personaInfo.comment}"</p>
                    </div>
                    
                    {/* Graph Section with Gradients */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2.5">
                            <span className="w-2 h-7 rounded-full bg-gray-800"></span>
                            카테고리별 지출
                        </h3>
                        <div className="space-y-8">
                            {Object.entries(displayedAnalysis)
                                .sort(([, a], [, b]) => (Number(b) || 0) - (Number(a) || 0))
                                .map(([cat, amount]) => {
                                    const percentage = displayedTotalSpent > 0 ? (((Number(amount) || 0) / displayedTotalSpent) * 100) : 0;
                                    const categoryPersona = PERSONAS[cat as Category];
                                    const color = categoryPersona ? categoryPersona.color : '#A0AEC0';
                                    
                                    return (
                                        <div key={cat}>
                                            <div className="flex justify-between items-end mb-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                                                        {icons[cat] ? <img src={icons[cat]} alt={`${cat} icon`} className="w-full h-full object-cover"/> : <IconPlaceholder className="w-full h-full" />}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-medium text-gray-500">{cat}</span>
                                                        <span className="text-xl font-bold text-gray-900">{percentage.toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                                <span className="text-base font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">₩{Number(amount || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden shadow-inner">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out`} 
                                                    style={{ 
                                                        width: `${percentage}%`, 
                                                        background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)` // Gradient Bar
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Saving Tips Section */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-sm border border-orange-100/50">
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <Lightbulb className="text-amber-500 fill-amber-500" size={28} />
                            <h3 className="text-xl font-bold text-gray-800 text-center">맞춤 절약 꿀팁</h3>
                        </div>
                        <ul className="space-y-5">
                            {personaInfo.tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-5 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-orange-100 hover:bg-white transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 font-bold mt-0.5 text-sm">
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-700 text-lg font-medium leading-relaxed">{tip}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                         <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2.5">
                            <span className="w-2 h-7 rounded-full bg-gray-300"></span>
                            전체 거래 내역
                        </h3>
                         <ul className="space-y-4">
                             {data
                                .filter(item => !excludeUnknown || item.reclassified !== '알 수 없음')
                                .map((item, index) => (
                                <li key={index} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200 bg-white">
                                            {icons[item.reclassified] ? <img src={icons[item.reclassified]} alt={`${item.reclassified} icon`} className="w-full h-full object-cover"/> : <IconPlaceholder className="w-full h-full" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-base font-bold text-gray-900 mb-0.5">{item.item}</p>
                                            <p className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded-md inline-block w-fit border border-gray-100">{item.reclassified}</p>
                                        </div>
                                    </div>
                                    <span className="text-base font-bold text-gray-900">- ₩{item.totalSpent.toLocaleString()}</span>
                                </li>
                             ))}
                         </ul>
                    </div>

                    {/* Action Buttons Area */}
                    <div className="mt-12 mb-6">
                        {'onGoBackToHistory' in props ? (
                            <button
                                onClick={props.onGoBackToHistory}
                                style={{ backgroundColor: PRIMARY_BLUE }}
                                className="w-full text-white text-lg font-bold py-4.5 rounded-2xl hover:opacity-95 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <ArrowLeft size={22} />
                                기록으로 돌아가기
                            </button>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <button
                                    onClick={props.onAddData}
                                    style={{ backgroundColor: PRIMARY_BLUE }}
                                    className="w-full text-white text-base font-bold py-4 px-4 rounded-2xl hover:opacity-95 transition-all shadow-md flex flex-col items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <PlusCircle size={24} />
                                    <span>소비 추가</span>
                                </button>
                                <button
                                    onClick={props.onFinish}
                                    style={{ backgroundColor: FINISH_GREEN }}
                                    className="w-full text-white text-base font-bold py-4 px-4 rounded-2xl hover:opacity-95 transition-all shadow-md flex flex-col items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <CheckCircle size={24} />
                                    <span>저장 후 종료</span>
                                </button>
                                <button
                                    onClick={props.onResetWithoutSave}
                                    style={{ backgroundColor: RESET_GRAY }}
                                    className="w-full text-white text-base font-bold py-4 px-4 rounded-2xl hover:opacity-95 transition-all shadow-md flex flex-col items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <RefreshCcw size={24} />
                                    <span>저장 안 함</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResultPage;
