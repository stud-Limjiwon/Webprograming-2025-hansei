// main.js - 모든 페이지에서 실행되는 중앙 초기화 로직

(function() {
    'use strict';
    
    console.log('=== BRIDGE 애플리케이션 초기화 시작 ===');
    
    // === 현재 페이지 정보 ===
    function getCurrentPageInfo() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        const urlParams = new URLSearchParams(window.location.search);
        
        return {
            filename,
            path,
            params: urlParams
        };
    }
    
    // === 페이지별 초기화 ===
    const pageInitializers = {
        'mainpage.html': function() {
            console.log('📄 메인페이지 초기화');
            ComponentLoader.presets.mainpage();
            if (typeof MainpageModule !== 'undefined') {
                MainpageModule.init();
            }
        },
        
        'mypage.html': function() {
            console.log('📄 마이페이지 초기화');
            ComponentLoader.presets.mypage();
            if (typeof MypageModule !== 'undefined') {
                MypageModule.init();
            }
        },
        
        'func_detail.html': function() {
            console.log('📄 기능 상세 페이지 초기화');
            // 초기에는 기본 제목으로 로드, 이후 func.js에서 업데이트
            ComponentLoader.presets.funcDetail('지원 기능');
            if (typeof FuncModule !== 'undefined') {
                FuncModule.init();
            }
        },
        
        'login.html': function() {
            console.log('📄 로그인 페이지 초기화');
            ComponentLoader.presets.login();
        },
        
        'index.html': function() {
            console.log('📄 인덱스 페이지 - 메인으로 리다이렉트');
            window.location.href = 'mainpage.html';
        }
    };
    
    // === 전역 에러 핸들러 ===
    window.addEventListener('error', function(e) {
        console.error('전역 에러:', e.error);
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('처리되지 않은 Promise 거부:', e.reason);
    });
    
    // === 페이지 초기화 실행 ===
    function initializePage() {
        try {
            const pageInfo = getCurrentPageInfo();
            console.log('현재 페이지:', pageInfo.filename);
            
            // 페이지별 초기화 함수 실행
            const initializer = pageInitializers[pageInfo.filename];
            
            if (initializer) {
                initializer();
            } else {
                console.warn(`초기화 함수가 정의되지 않은 페이지: ${pageInfo.filename}`);
            }
            
            console.log('✓ 페이지 초기화 완료');
        } catch (error) {
            console.error('페이지 초기화 실패:', error);
            if (typeof ModalSystem !== 'undefined') {
                ModalSystem.error('페이지 로드 중 오류가 발생했습니다.');
            }
        }
    }
    
    // === DOM 준비 완료 시 실행 ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePage);
    } else {
        initializePage();
    }
    
    console.log('=== BRIDGE 애플리케이션 초기화 완료 ===');
})();