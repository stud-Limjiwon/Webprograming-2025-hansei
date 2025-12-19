// mainpage.js - 메인페이지 전용 스크립트 (에러 핸들링 강화)

const MainpageModule = (function() {
    'use strict';
    
    // === Private 함수 ===
    function isLoggedIn() {
        try {
            return BridgeApp.utils.getStorage(AppConstants.STORAGE_KEYS.IS_LOGGED_IN) === 'true';
        } catch (error) {
            console.error('로그인 상태 확인 실패:', error);
            return false;
        }
    }
    
    function createAuthButtons() {
        try {
            if (isLoggedIn()) {
                return `
                    <button onclick="location.href='${AppConstants.PAGES.MYPAGE}'" class="login-btn" style="margin-right:8px;">내 정보</button>
                    <button onclick="BridgeApp.auth.logout()" class="login-btn">로그아웃</button> 
                `;
            } else {
                return `
                    <button class="login-btn" onclick="location.href='${AppConstants.PAGES.LOGIN}'">로그인</button>
                `;
            }
        } catch (error) {
            console.error('인증 버튼 생성 실패:', error);
            return `<button class="login-btn" onclick="location.href='${AppConstants.PAGES.LOGIN}'">로그인</button>`;
        }
    }
    
    function renderAuthButtons() {
        try {
            const authArea = document.getElementById('auth-area');
            
            if (!authArea) {
                console.error('auth-area 요소를 찾을 수 없습니다');
                return false;
            }
            
            authArea.innerHTML = createAuthButtons();
            console.log('✓ 인증 버튼 렌더링 완료');
            return true;
        } catch (error) {
            console.error('인증 버튼 렌더링 중 에러:', error);
            return false;
        }
    }
    
    function handleServiceCardClick(e, card) {
        try {
            if (!isLoggedIn()) {
                e.preventDefault();
                ModalSystem.alert(AppConstants.MESSAGES.LOGIN_REQUIRED).then(() => {
                    location.href = AppConstants.PAGES.LOGIN;
                });
            }
        } catch (error) {
            console.error('서비스 카드 클릭 처리 중 에러:', error);
            e.preventDefault();
        }
    }
    
    function setupServiceCards() {
        try {
            const cards = document.querySelectorAll('.service-card');
            
            if (cards.length === 0) {
                console.warn('서비스 카드를 찾을 수 없습니다');
                return false;
            }
            
            cards.forEach(card => {
                card.addEventListener('click', function(e) {
                    handleServiceCardClick(e, card);
                });
            });
            
            console.log(`✓ ${cards.length}개의 서비스 카드 이벤트 등록 완료`);
            return true;
        } catch (error) {
            console.error('서비스 카드 설정 중 에러:', error);
            return false;
        }
    }
    
    // === Public API ===
    return {
        init: function() {
            try {
                console.log('메인페이지 모듈 초기화 시작...');
                renderAuthButtons();
                setupServiceCards();
                console.log('✓ 메인페이지 모듈 초기화 완료');
            } catch (error) {
                console.error('메인페이지 초기화 실패:', error);
                ModalSystem.error('페이지 로드 중 문제가 발생했습니다.');
            }
        }
    };
})();

// window.onload 제거 - main.js에서 처리