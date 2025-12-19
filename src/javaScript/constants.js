// constants.js - 애플리케이션 전역 상수 및 설정

const AppConstants = (function() {
    'use strict';
    
    return {
        // ===== 로컬 스토리지 키 =====
        STORAGE_KEYS: {
            IS_LOGGED_IN: 'isLoggedIn',
            USER_TYPE: 'userType',
            USER_NAME: 'userName',
            USER_PHONE: 'userPhone',
            USER_EMAIL: 'userEmail',
            TOGGLE_WIFI: 'toggle-wifi',
            TOGGLE_BLUETOOTH: 'toggle-bluetooth',
            TOGGLE_GPS: 'toggle-gps'
        },
        
        // ===== 장애 유형 설정 =====
        DISABILITY_TYPES: {
            VISUAL: {
                id: 'visual',
                name: '시각장애인',
                title: '시각장애 지원',
                icon: 'images/visual.png',
                features: ['음성 안내', '고대비 화면', '큰 글씨 출력']
            },
            HEARING: {
                id: 'hearing',
                name: '청각장애인',
                title: '청각장애 지원',
                icon: 'images/hearing.png',
                features: ['자막 지원', '진동 피드백', '시각 알림']
            },
            PHYSICAL: {
                id: 'physical',
                name: '지체장애인',
                title: '지체장애 지원',
                icon: 'images/physical.png',
                features: ['높이 조절', '휠체어 접근', '큰 버튼']
            }
        },
        
        // ===== 페이지 설정 =====
        PAGES: {
            MAIN: 'mainpage.html',
            LOGIN: 'login.html',
            MYPAGE: 'mypage.html',
            FUNC_DETAIL: 'func_detail.html',
            PROTECTED: ['mypage.html', 'func_detail.html']
        },
        
        // ===== 이미지 경로 =====
        IMAGES: {
            LOGO: 'images/logo.png',
            VISUAL: 'images/visual.png',
            HEARING: 'images/hearing.png',
            PHYSICAL: 'images/physical.png',
            MAIN: 'images/mainpage.png'
        },
        
        // ===== 기본 메시지 =====
        MESSAGES: {
            LOGIN_REQUIRED: '로그인이 필요한 서비스입니다.',
            LOGOUT_CONFIRM: '로그아웃 하시겠습니까?',
            LOGOUT_SUCCESS: '로그아웃 되었습니다.',
            LOGOUT_FAILED: '로그아웃 중 문제가 발생했습니다.',
            REGISTER_SUCCESS: '등록이 완료되었습니다.',
            REGISTER_FAILED: '등록 중 문제가 발생했습니다. 다시 시도해주세요.',
            PAGE_LOAD_ERROR: '페이지를 불러오는 중 오류가 발생했습니다.',
            INVALID_ACCESS: '잘못된 접근입니다. 메인 페이지로 이동합니다.',
            SAVE_FAILED: '정보 저장 중 문제가 발생했습니다.'
        },
        
        // ===== 기본 텍스트 =====
        DEFAULTS: {
            NO_INFO: '정보 없음',
            REGISTER_PLACEHOLDER: '등록해주세요',
            LOADING: '불러오는 중...',
            NO_TYPE: '미선택',
            NO_TYPE_REGISTERED: '등록된 유형 없음'
        },
        
        // ===== 유틸리티 함수 =====
        getDisabilityConfig: function(typeId) {
            const types = this.DISABILITY_TYPES;
            for (let key in types) {
                if (types[key].id === typeId) {
                    return types[key];
                }
            }
            return null;
        },
        
        getDisabilityIcon: function(typeName) {
            const types = this.DISABILITY_TYPES;
            for (let key in types) {
                if (types[key].name === typeName) {
                    return types[key].icon;
                }
            }
            return this.IMAGES.LOGO;
        },
        
        getAllowedTypes: function() {
            return Object.values(this.DISABILITY_TYPES).map(type => type.id);
        }
    };
})();

// ES5 호환을 위한 전역 노출
if (typeof window !== 'undefined') {
    window.AppConstants = AppConstants;
}