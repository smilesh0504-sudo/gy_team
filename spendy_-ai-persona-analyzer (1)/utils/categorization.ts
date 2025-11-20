import type { Category } from '../types';

const CATEGORY_MAPPING: { [key: string]: Category } = {
    // 식비
    '음식': '식비', '식사': '식비', '식비': '식비', '식료품': '식비', '카페': '식비', '배달': '식비', '디저트': '식비', '간식': '식비',
    'groceries': '식비', 'food': '식비', 'cafe': '식비', 'restaurant': '식비',
    // 주거
    '주거': '주거', '월세': '주거', '관리비': '주거', '전기': '주거', '수도': '주거', '가스': '주거', '인터넷': '주거', '통신': '주거',
    'housing': '주거', 'utilities': '주거', 'rent': '주거',
    // 교통비
    '교통': '교통비', '교통비': '교통비', '택시': '교통비', '버스': '교통비', '지하철': '교통비', '주차': '교통비', '기름': '교통비', '항공': '교통비', 'ktx': '교통비',
    'transportation': '교통비', 'travel': '교통비', 'taxi': '교통비', 'bus': '교통비', 'subway': '교통비',
    // 쇼핑
    '쇼핑': '쇼핑', '의류': '쇼핑', '화장품': '쇼핑', '전자제품': '쇼핑', '선물': '쇼핑', '가구': '쇼핑', '인테리어': '쇼핑', '편의점': '쇼핑', '마트': '쇼핑',
    'shopping': '쇼핑', 'gifts': '쇼핑', 'clothes': '쇼핑', 'cosmetics': '쇼핑',
    // 문화/여가
    '문화': '문화/여가', '여가': '문화/여가', '운동': '문화/여가', '헬스': '문화/여가', '취미': '문화/여가', '영화': '문화/여가', '공연': '문화/여가', '여행': '문화/여가', '구독': '문화/여가',
    'fitness': '문화/여가', 'hobbies': '문화/여가', 'culture': '문화/여가', 'leisure': '문화/여가',
    // 생활비
    '생활': '생활비', '의료': '생활비', '병원': '생활비', '약국': '생활비', '생필품': '생활비', '미용': '생활비', '경조사': '생활비',
    'medical': '생활비', 'dental': '생활비', 'personal hygiene': '생활비',
};

const ITEM_MAPPING: { [key: string]: Category } = {
    // 식비
    '우유': '식비', '빵': '식비', '치킨': '식비', '과자': '식비', '라면': '식비', '커피': '식비', '점심': '식비', '저녁': '식비', '피자': '식비', '햄버거': '식비', '스타벅스': '식비', '배달의민족': '식비', '요기요': '식비', '마켓컬리': '식비',
    'milk': '식비', 'bread': '식비', 'chicken': '식비', 'snacks': '식비', 'coffee': '식비', 'lunch': '식비', 'dinner': '식비', 'pizza': '식비',
    // 주거
    '월세': '주거', '관리비': '주거', '전기세': '주거', '수도세': '주거', '가스비': '주거', '인터넷': '주거', '통신비': '주거', 'kt': '주거', 'skt': '주거', 'lgu+': '주거',
    'rent': '주거', 'electric bill': '주거', 'water bill': '주거', 'gas bill': '주거', 'internet bill': '주거',
    // 교통비
    '택시': '교통비', '버스': '교통비', '지하철': '교통비', '주차': '교통비', '기름': '교통비', '카카오택시': '교통비', '티머니': '교통비', '하이패스': '교통비', 'srt': '교통비',
    'taxi': '교통비', 'bus': '교통비', 'subway': '교통비', 'parking': '교통비', 'gas': '교통비',
    // 쇼핑
    '옷': '쇼핑', '신발': '쇼핑', '가방': '쇼핑', '화장품': '쇼핑', '핸드폰': '쇼핑', '올리브영': '쇼핑', '무신사': '쇼핑', '쿠팡': '쇼핑', '네이버쇼핑': '쇼핑', '이마트': '쇼핑', '홈플러스': '쇼핑', '다이소': '쇼핑', 'cu': '쇼핑', 'gs25': '쇼핑', '세븐일레븐': '쇼핑',
    'clothes': '쇼핑', 'shoes': '쇼핑', 'cosmetics': '쇼핑', 'coupang': '쇼핑', 'book': '쇼핑',
    // 문화/여가
    '영화': '문화/여가', '헬스': '문화/여가', '노래방': '문화/여가', 'pc방': '문화/여가', 'cgv': '문화/여가', '메가박스': '문화/여가', '넷플릭스': '문화/여가', '유튜브': '문화/여가', '멜론': '문화/여가', '교보문고': '문화/여가',
    'movie': '문화/여가', 'gym': '문화/여가', 'netflix': '문화/여가', 'youtube': '문화/여가',
    // 생활비
    '병원': '생활비', '약': '생활비', '샴푸': '생활비', '미용실': '생활비',
    'hospital': '생활비', 'pharmacy': '생활비', 'shampoo': '생활비'
};

export const categorizeTransaction = (item: string, originalCategory: string): Category => {
    if (!item) return '알 수 없음';
    const normalizedItem = item.toLowerCase();
    
    // 1. Check item mapping for exact or partial matches
    for (const [key, category] of Object.entries(ITEM_MAPPING)) {
        if (normalizedItem.includes(key.toLowerCase())) {
            return category;
        }
    }
    
    // 2. Check category mapping with the item name
    for (const [key, category] of Object.entries(CATEGORY_MAPPING)) {
        if (normalizedItem.includes(key.toLowerCase())) {
            return category;
        }
    }
    
    // 3. If originalCategory is valid, use it
    if (['식비', '쇼핑', '주거', '교통비', '문화/여가', '생활비'].includes(originalCategory)) {
        return originalCategory as Category;
    }
    
    // 4. Default to '알 수 없음'
    return '알 수 없음';
};
