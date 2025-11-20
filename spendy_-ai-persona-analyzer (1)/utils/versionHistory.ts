
import type { AnalysisVersion } from '../types';

// 사용자별 키 생성을 위한 헬퍼
const getHistoryKey = (userId: string) => `spendy_history_${userId}`;

export const getHistory = (userId: string): AnalysisVersion[] => {
    if (!userId) return [];
    try {
        const historyJson = localStorage.getItem(getHistoryKey(userId));
        if (historyJson) {
            const history = JSON.parse(historyJson) as AnalysisVersion[];
            // Sort by date, newest first
            return history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return [];
    } catch (error) {
        console.error("Error retrieving history from localStorage:", error);
        return [];
    }
};

export const saveToHistory = (userId: string, version: AnalysisVersion): void => {
    if (!userId) return;
    try {
        const history = getHistory(userId);
        // Prepending the new version to the start of the array
        const updatedHistory = [version, ...history.filter(h => h.id !== version.id)];
        localStorage.setItem(getHistoryKey(userId), JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Error saving to history in localStorage:", error);
    }
};

export const deleteFromHistory = (userId: string, versionId: string): void => {
    if (!userId) return;
    try {
        const history = getHistory(userId);
        const updatedHistory = history.filter(v => v.id !== versionId);
        localStorage.setItem(getHistoryKey(userId), JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Error deleting from history in localStorage:", error);
    }
};
