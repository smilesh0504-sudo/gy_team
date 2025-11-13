
import React, { useState, useCallback, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { analyzeTransactionImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { categorizeTransaction } from './utils/categorization';
import type { Transaction, AnalysisResult, AnalysisVersion, User } from './types';
import UploadPage from './components/UploadPage';
import ResultPage from './components/ResultPage';
import AddDataPage from './components/AddDataPage';
import MyInfoPage from './components/MyInfoPage';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import AppLayout from './components/AppLayout';
import type { Tab } from './components/AppLayout';
import { getHistory, saveToHistory, deleteFromHistory } from './utils/versionHistory';
import { login, signUp, logout, getCurrentUser } from './utils/auth';

type AuthPage = 'main' | 'login' | 'signup';
type AnalysisPage = 'upload' | 'result' | 'add';

const App: React.FC = () => {
    // Auth State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authPage, setAuthPage] = useState<AuthPage>('main');
    const [authLoading, setAuthLoading] = useState(false);
    
    // App State (for authenticated users)
    const [activeTab, setActiveTab] = useState<Tab>('analysis');
    const [analysisPage, setAnalysisPage] = useState<AnalysisPage>('upload');
    const [data, setData] = useState<Transaction[]>([]);
    const [persona, setPersona] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [newlyAddedCount, setNewlyAddedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [versions, setVersions] = useState<AnalysisVersion[]>([]);
    const [viewingVersion, setViewingVersion] = useState<AnalysisVersion | null>(null);

    useEffect(() => {
        setCurrentUser(getCurrentUser());
    }, []);

    useEffect(() => {
        if (currentUser) {
            setVersions(getHistory());
        }
    }, [currentUser]);

    const resetAnalysisState = useCallback(() => {
        setData([]);
        setPersona(null);
        setAnalysis(null);
        setNewlyAddedCount(0);
        setViewingVersion(null);
        setAnalysisPage('upload');
    }, []);

    const handleLogin = async (nickname: string, id: string) => {
        setAuthLoading(true);
        try {
            const result = await login(nickname, id);
            if (result.success && result.user) {
                setCurrentUser(result.user);
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('로그인 중 예상치 못한 오류가 발생했습니다.');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleSignUp = async (nickname: string, id: string) => {
        setAuthLoading(true);
        try {
            const result = await signUp(nickname, id);
            alert(result.message);
            if (result.success) {
                setAuthPage('login');
            }
        } catch (error) {
             alert('회원가입 중 예상치 못한 오류가 발생했습니다.');
        } finally {
            setAuthLoading(false);
        }
    };
    
    const handleLogout = () => {
        logout();
        setCurrentUser(null);
        resetAnalysisState();
        setAuthPage('main');
        setActiveTab('analysis');
    };

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        // If switching away from analysis, reset its state if it's not in the middle of viewing history
        if (tab !== 'analysis' && !viewingVersion) {
            resetAnalysisState();
        }
        if (tab === 'analysis' && viewingVersion) {
            setViewingVersion(null); // Clear history view when explicitly clicking analysis tab
        }
    };

    const analyzeData = useCallback((dataToAnalyze: Transaction[]) => {
        if (dataToAnalyze.length === 0) {
            setPersona(null);
            setAnalysis(null);
            return;
        }

        const categoryTotals: AnalysisResult = {};
        dataToAnalyze.forEach(row => {
            const cat = row.reclassified;
            categoryTotals[cat] = (categoryTotals[cat] || 0) + row.totalSpent;
        });

        const sorted = Object.entries(categoryTotals)
            .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));

        if (sorted.length > 0) {
            const topCategory = sorted[0][0];
            setPersona(topCategory);
            setAnalysis(categoryTotals);
        }
    }, []);

    const processAndSetData = useCallback((newTransactions: Omit<Transaction, 'reclassified'>[]) => {
        const processed = newTransactions.map(t => ({
            ...t,
            reclassified: categorizeTransaction(t.item, t.category)
        }));

        setData(prevData => {
            const updatedData = [...prevData, ...processed];
            analyzeData(updatedData);
            return updatedData;
        });
        setNewlyAddedCount(processed.length);
        return processed.length;
    }, [analyzeData]);

    const handleFileUpload = (file: File) => {
        setIsLoading(true);
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        if (fileExtension === 'csv' || fileExtension === 'txt') {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedData = (results.data as any[]).map(row => ({
                        category: row.Category || row.카테고리 || '알 수 없음',
                        item: row.Item || row.항목,
                        totalSpent: Math.abs(parseFloat(row['Total Spent'] || row.금액 || '0'))
                    })).filter(d => d.item && d.totalSpent > 0);
                    processAndSetData(parsedData);
                    setIsLoading(false);
                },
                error: (err) => {
                    console.error("CSV/TXT parsing error:", err);
                    alert('파일을 처리하는 중 오류가 발생했습니다.');
                    setIsLoading(false);
                }
            });
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const workbook = XLSX.read(e.target?.result, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
                    const parsedData = jsonData.map(row => ({
                        category: row.Category || row.카테고리 || '알 수 없음',
                        item: row.Item || row.항목,
                        totalSpent: Math.abs(parseFloat(row['Total Spent'] || row.금액 || '0'))
                    })).filter(d => d.item && d.totalSpent > 0);
                    processAndSetData(parsedData);
                } catch (err) {
                    console.error("Excel parsing error:", err);
                    alert('Excel 파일을 처리하는 중 오류가 발생했습니다.');
                } finally {
                    setIsLoading(false);
                }
            };
            reader.onerror = () => {
                 alert('파일을 읽는 중 오류가 발생했습니다.');
                 setIsLoading(false);
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert(`지원하지 않는 파일 형식입니다: .${fileExtension}\nCSV, Excel, TXT 파일을 업로드해주세요.`);
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (files: File[]) => {
        setIsLoading(true);
        let allNewTransactions: Transaction[] = [];
        let hasInvalidImage = false;

        for (const file of files) {
            const base64Image = await fileToBase64(file);
            const result = await analyzeTransactionImage(base64Image, file.type);
            
            if (!result.isFinancial) {
                hasInvalidImage = true;
                break;
            }
            const transactionsFromImage = result.transactions.map(t => ({
                item: t.item,
                totalSpent: Math.abs(t.amount),
                category: t.category,
                reclassified: t.category
            }));
            allNewTransactions.push(...transactionsFromImage);
        }
        
        setIsLoading(false);

        if (hasInvalidImage) {
            return { valid: false, count: 0 };
        }
        
        setData(prev => {
            const updated = [...prev, ...allNewTransactions];
            analyzeData(updated);
            return updated;
        });
        setNewlyAddedCount(allNewTransactions.length);
        return { valid: true, count: allNewTransactions.length };
    };

    const handleGoToResult = () => {
        if (persona === '생각없는 직진가') {
             setAnalysis({ '알 수 없음': 1 });
        }
        setViewingVersion(null);
        setAnalysisPage('result');
    };

    const handleSetRusherPersona = () => {
        setPersona('생각없는 직진가');
        handleGoToResult();
    };

    const handleSaveAndFinish = () => {
        if (!data || data.length === 0) {
            resetAnalysisState();
            return;
        }
        const newVersion: AnalysisVersion = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            data,
            persona,
            analysis,
        };
        saveToHistory(newVersion);
        setVersions(getHistory());
        resetAnalysisState();
    };

    const handleViewVersion = (id: string) => {
        const versionToView = versions.find(v => v.id === id);
        if (versionToView) {
            setViewingVersion(versionToView);
            setActiveTab('analysis');
            setAnalysisPage('result');
        }
    };
    
    const handleDeleteVersion = (id: string) => {
        deleteFromHistory(id);
        setVersions(getHistory());
    };

    const renderAuthComponent = () => {
        switch (authPage) {
            case 'login':
                return <LoginPage onLogin={handleLogin} onGoBack={() => setAuthPage('main')} authLoading={authLoading} />;
            case 'signup':
                return <SignUpPage onSignUp={handleSignUp} onGoBack={() => setAuthPage('main')} authLoading={authLoading} />;
            case 'main':
            default:
                return <MainPage onNavigateToLogin={() => setAuthPage('login')} onNavigateToSignUp={() => setAuthPage('signup')} />;
        }
    };
    
    const renderAppComponent = () => {
        switch (activeTab) {
            case 'analysis':
                switch (analysisPage) {
                    case 'upload':
                        return <UploadPage 
                                    dataCount={data.length} 
                                    onFileUpload={handleFileUpload} 
                                    onImageUpload={handleImageUpload}
                                    onProcessTextData={processAndSetData}
                                    onGoToResult={handleGoToResult}
                                    onSetRusherPersona={handleSetRusherPersona}
                                    isLoading={isLoading}
                                />;
                    case 'result':
                        const resultProps = viewingVersion
                            ? {
                                persona: viewingVersion.persona,
                                analysis: viewingVersion.analysis,
                                data: viewingVersion.data,
                                isHistoryView: true as const,
                                onGoBackToHistory: () => {
                                    setViewingVersion(null);
                                    setActiveTab('myinfo');
                                }
                              }
                            : {
                                persona: persona,
                                analysis: analysis,
                                data: data,
                                isHistoryView: false as const,
                                onAddData: () => setAnalysisPage('add'),
                                onFinish: handleSaveAndFinish,
                              };
                        return <ResultPage {...resultProps} />;
                    case 'add':
                         return <AddDataPage
                                    dataCount={data.length}
                                    newlyAddedCount={newlyAddedCount}
                                    onFileUpload={handleFileUpload}
                                    onImageUpload={handleImageUpload}
                                    onProcessTextData={processAndSetData}
                                    onGoToResult={() => setAnalysisPage('result')}
                                    isLoading={isLoading}
                                />;
                }
            case 'myinfo':
                return <MyInfoPage 
                            user={currentUser} 
                            onLogout={handleLogout} 
                            versions={versions}
                            onViewVersion={handleViewVersion}
                            onDeleteVersion={handleDeleteVersion}
                        />;
            default:
                return <div>Page not found</div>;
        }
    };

    if (!currentUser) {
        return <div className="min-h-screen bg-gray-50 font-sans">{renderAuthComponent()}</div>;
    }

    return (
        <AppLayout activeTab={activeTab} onTabChange={handleTabChange}>
            {renderAppComponent()}
        </AppLayout>
    );
};

export default App;