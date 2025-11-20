
import type { Persona } from '../types';

export const PERSONAS: { [key: string]: Persona } = {
    '식비': { 
        name: '미식가', 
        iconPrompt: 'A fork and knife crossed', 
        color: '#FFB800', 
        description: '맛있는 음식을 즐기는 데\n지출이 많으시네요', 
        comment: '다양한 맛을 탐험하는 당신은 진정한 미식가입니다.',
        tips: [
            '일주일치 식단을 미리 계획하여 충동적인 외식과 배달을 줄여보세요.',
            '편의점이나 카페 대신 텀블러와 도시락을 이용하면 큰 금액을 아낄 수 있어요.'
        ]
    },
    '쇼핑': { 
        name: '쇼핑 러버', 
        iconPrompt: 'A shopping bag with a small heart on it', 
        color: '#FF6482', 
        description: '쇼핑을 통해 삶의 만족도를\n높이시는군요', 
        comment: '새로운 것을 찾는 즐거움을 아는 당신, 멋져요!',
        tips: [
            '장바구니에 담아두고 24시간 뒤에 다시 결제 여부를 고민해보세요.',
            '계절이 바뀔 때만 옷을 사는 등 나만의 쇼핑 원칙을 정해보세요.'
        ]
    },
    '주거': { 
        name: '홈 메이커', 
        iconPrompt: 'A simple, modern house icon', 
        color: '#00C471', 
        description: '주거 관련 지출이 소비에서\n큰 비중을 차지하네요', 
        comment: '편안한 공간을 만드는 데 투자하는 현명한 선택입니다.',
        tips: [
            '사용하지 않는 플러그를 뽑아 대기 전력을 차단하여 전기세를 절약하세요.',
            '통신비 제휴 할인이나 알뜰폰 요금제를 활용해 고정 지출을 줄여보세요.'
        ]
    },
    '교통비': { 
        name: '액티브 무버', 
        iconPrompt: 'A modern bus or subway icon', 
        color: '#3182F6', 
        description: '이동이 잦거나 교통 관련\n지출이 많은 편이시네요', 
        comment: '세상을 누비는 활동적인 라이프스타일!',
        tips: [
            '알뜰교통카드나 대중교통 정기권을 사용하여 교통비를 할인받으세요.',
            '가까운 거리는 걷거나 자전거를 이용해 건강과 지갑을 모두 챙기세요.'
        ]
    },
    '문화/여가': { 
        name: '라이프 엔조이어', 
        iconPrompt: 'A movie ticket and a star', 
        color: '#8B5CF6', 
        description: '다양한 문화 및 여가 활동에\n적극적으로 참여하시는군요', 
        comment: '삶을 풍요롭게 만드는 멋진 취미생활을 하고 계세요.',
        tips: [
            '매월 마지막 주 수요일 "문화가 있는 날"의 할인 혜택을 적극 활용하세요.',
            '구독형 서비스 중 자주 이용하지 않는 것은 과감히 해지하세요.'
        ]
    },
    '생활비': { 
        name: '라이프 매니저', 
        iconPrompt: 'A water droplet inside a leaf shape', 
        color: '#14B8A6', 
        description: '필수적인 생활비 지출이\n상대적으로 높게 나타납니다', 
        comment: '건강과 일상을 챙기는 책임감 있는 당신, 응원합니다.',
        tips: [
            '생필품은 대용량으로 구매하거나 할인 행사 기간을 노려 비축해두세요.',
            '지역화폐를 사용하여 결제 시 할인이나 캐시백 혜택을 챙기세요.'
        ]
    },
    '알 수 없음': { 
        name: '미스터리 소비자', 
        iconPrompt: 'A magnifying glass over a question mark', 
        color: '#A0AEC0', 
        description: '분류하기 어려운 소비가\n많이 발견되었습니다', 
        comment: '독특한 소비 패턴을 가진 흥미로운 당신이네요.',
        tips: [
            '지출 내역을 꼼꼼히 기록하여 어디로 돈이 새는지 확인해보세요.',
            '현금보다는 카드를 사용하여 지출 내역을 자동으로 남기는 것이 좋아요.'
        ]
    },
    '생각없는 직진가': { 
        name: '생각없는 직진가', 
        iconPrompt: 'A cartoon rocket ship about to crash into a planet', 
        color: '#F44336', 
        description: '잘못된 데이터를 포함하여\n분석을 요청하셨습니다', 
        comment: '잘못된 데이터는 인식할 수 없어요. 정확한 분석을 위해 올바른 형식의 데이터를 업로드해주세요!',
        tips: [
            '영수증을 챙기는 습관부터 시작해보세요!',
            '정확한 기록이 절약의 첫걸음입니다.'
        ]
    }
};
