
import type { User } from '../types';

// =================================================================
// ✨ SETUP: 여기에 자신의 SheetDB API URL을 붙여넣으세요!
// 1. Google Sheet 생성 -> A1 셀에 'nickname', B1 셀에 'id' 입력
// 2. sheetdb.io에서 API 생성 후 아래 URL을 교체하세요.
// =================================================================
const SHEETDB_URL = 'https://sheetdb.io/api/v1/87rucmaequvul'; 

const CURRENT_USER_KEY = 'spendy_current_user';
const REQUEST_TIMEOUT_MS = 10000; // 10초 타임아웃 설정

// 헬퍼: 타임아웃이 포함된 Fetch 함수
const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

export const signUp = async (nickname: string, id: string): Promise<{ success: boolean, message: string }> => {
    // 입력값 공백 제거 (Sanitization)
    const cleanNickname = nickname.trim();
    const cleanId = id.trim();

    if (!cleanNickname || !cleanId) {
        return { success: false, message: '닉네임과 비밀번호를 모두 입력해주세요.' };
    }

    // 닉네임 길이 제한 (13자)
    if (cleanNickname.length > 13) {
        return { success: false, message: '닉네임은 최대 13자까지만 가능합니다.' };
    }

    // Server-side validation for password policy (Updated v1.17)
    // 4~14자, 영문과 숫자 포함
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,14}$/;
    if (!passwordRegex.test(cleanId)) {
        return { success: false, message: '비밀번호는 4~14자리의 영문과 숫자 조합이어야 합니다.' };
    }

    try {
        // 1. Check if nickname already exists
        // 검색 API 호출
        const searchResponse = await fetchWithTimeout(`${SHEETDB_URL}/search?nickname=${encodeURIComponent(cleanNickname)}`);
        
        if (!searchResponse.ok) {
             // SheetDB Quota 초과 등의 문제일 수 있음
            throw new Error(`서버 연결 상태가 좋지 않습니다. (Code: ${searchResponse.status})`);
        }

        // 응답이 JSON인지 확인
        const contentType = searchResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("서버에서 올바르지 않은 응답이 왔습니다.");
        }

        const existingUsers: User[] = await searchResponse.json();
        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            return { success: false, message: '이미 사용 중인 닉네임입니다.' };
        }

        // 2. Create new user
        const createResponse = await fetchWithTimeout(SHEETDB_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: [{ nickname: cleanNickname, id: cleanId }]
            })
        });

        if (!createResponse.ok) {
             throw new Error('회원가입 정보를 저장하는 도중 문제가 발생했습니다.');
        }

        return { success: true, message: '회원가입이 완료되었습니다! 로그인해주세요.' };

    } catch (error: any) {
        console.error("SignUp Error:", error);
        let errMsg = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
        if (error.name === 'AbortError') {
            errMsg = '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message) {
            errMsg = error.message;
        }
        return { success: false, message: errMsg };
    }
};

export const login = async (nickname: string, id: string): Promise<{ success: boolean, user: User | null, message: string }> => {
    // 입력값 공백 제거
    const cleanNickname = nickname.trim();
    const cleanId = id.trim();

    if (!cleanNickname || !cleanId) {
        return { success: false, user: null, message: '닉네임과 비밀번호를 모두 입력해주세요.' };
    }

    try {
        const response = await fetchWithTimeout(`${SHEETDB_URL}/search?nickname=${encodeURIComponent(cleanNickname)}`);
        
        if (!response.ok) {
            // 402 Payment Required 등 API 제한 상황 고려
            if (response.status === 400 || response.status === 402) {
                throw new Error('서비스 접속량이 많아 일시적으로 이용할 수 없습니다.');
            }
            throw new Error(`서버 연결 오류 (Code: ${response.status})`);
        }

         // 응답이 JSON인지 확인
         const contentType = response.headers.get("content-type");
         if (!contentType || !contentType.includes("application/json")) {
             throw new Error("서버 응답 형식이 잘못되었습니다.");
         }

        const users: User[] = await response.json();
        
        // v1.18 업데이트: 보안 및 사용자 경험을 위해 오류 메시지 통일
        // 배열이 아니거나(API 오류), 비어있거나(유저 없음), 비밀번호 불일치 시
        if (!Array.isArray(users) || users.length === 0) {
            return { success: false, user: null, message: '닉네임이나 비밀번호가 틀렸습니다.' };
        }

        const user = users[0];
        // 대소문자 구분 없이 비교하지 않고, 정확히 일치하는지 확인 (보안 강화)
        if (user.id !== cleanId) {
            return { success: false, user: null, message: '닉네임이나 비밀번호가 틀렸습니다.' };
        }
        
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return { success: true, user, message: '로그인 성공!' };

    } catch (error: any) {
        console.error("Login Error:", error);
        let errMsg = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        
        if (error.name === 'AbortError') {
            errMsg = '서버 응답 시간이 초과되었습니다. 인터넷 연결을 확인하세요.';
        } else if (error.message) {
            errMsg = error.message;
        }
        
        return { success: false, user: null, message: errMsg };
    }
};

export const logout = (): void => {
    try {
        localStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
        console.error("로그아웃 오류:", e);
    }
};

export const getCurrentUser = (): User | null => {
    try {
        const userJson = localStorage.getItem(CURRENT_USER_KEY);
        if (userJson) {
            return JSON.parse(userJson) as User;
        }
        return null;
    } catch (error) {
        console.error("현재 사용자 정보 가져오기 오류:", error);
        return null;
    }
};
