// componentLoader.js - 공통 컴포넌트 동적 로더 (접근성 개선)

const ComponentLoader = (function() {
    'use strict';
    
    // === 컴포넌트 템플릿 정의 ===
    const components = {
        // 기본 헤더 (로고만)
        'header-simple': function() {
            return `
                <header class="header">
                    <a href="mainpage.html" class="logo" aria-label="BRIDGE 메인페이지로 이동">
                        <img src="images/logo.png" alt="BRIDGE 로고" class="logo-image">
                    </a>
                </header>
            `;
        },
        
        // 헤더 with 내 정보 버튼
        'header-myinfo': function() {
            return `
                <header class="header">
                    <a href="mainpage.html" class="logo" aria-label="BRIDGE 메인페이지로 이동">
                        <img src="images/logo.png" alt="BRIDGE 로고" class="logo-image">
                    </a>
                    <button type="button" class="my-info-btn" id="my-info-btn" aria-label="내 정보 페이지로 이동">
                        내 정보
                    </button>
                </header>
            `;
        },
        
        // 헤더 with 로그아웃 버튼
        'header-logout': function() {
            return `
                <header class="header">
                    <a href="mainpage.html" class="logo" id="main_logo" aria-label="BRIDGE 메인페이지로 이동">
                        <img src="images/logo.png" alt="BRIDGE 서비스 로고" class="logo-image">
                    </a>
                    <button type="button" class="logout-btn" id="logout-btn" aria-label="로그아웃">
                        로그아웃
                    </button>
                </header>
            `;
        },
        
        // 메인페이지 헤더 (동적 버튼)
        'header-main': function() {
            return `
                <header class="header">
                    <a href="mainpage.html" class="logo" id="main_logo" aria-label="BRIDGE 메인페이지로 이동">
                        <img src="images/logo.png" alt="BRIDGE 로고" class="logo-image">
                    </a>
                    <div id="auth-area" role="navigation" aria-label="사용자 인증"></div>
                </header>
            `;
        },
        
        // 네비게이션 바 (뒤로가기 + 제목)
        'nav-back': function(title = '페이지') {
            return `
                <nav class="nav-bar" role="navigation" aria-label="페이지 네비게이션">
                    <button type="button" class="back-btn" id="back-btn" aria-label="이전 페이지로 돌아가기">
                        ←
                    </button>
                    <h1 class="page-title" id="page-title">${title}</h1>
                </nav>
            `;
        }
    };
    
    // === Private 함수 ===
    function loadComponent(selector, componentName, ...args) {
        try {
            const container = document.querySelector(selector);
            
            if (!container) {
                console.warn(`컨테이너를 찾을 수 없습니다: ${selector}`);
                return false;
            }
            
            const component = components[componentName];
            
            if (!component) {
                console.error(`컴포넌트를 찾을 수 없습니다: ${componentName}`);
                return false;
            }
            
            // 컴포넌트 HTML 생성 및 삽입
            container.innerHTML = component(...args);
            
            console.log(`✓ 컴포넌트 로드 완료: ${componentName}`);
            return true;
        } catch (error) {
            console.error(`컴포넌트 로드 실패 (${componentName}):`, error);
            return false;
        }
    }
    
    function setupEventListeners(componentName) {
        try {
            // 로그아웃 버튼 이벤트 등록
            if (componentName === 'header-logout') {
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn && typeof BridgeApp !== 'undefined') {
                    logoutBtn.addEventListener('click', BridgeApp.auth.logout);
                    console.log('✓ 로그아웃 버튼 이벤트 등록');
                }
            }
            
            // 내 정보 버튼 이벤트 등록
            if (componentName === 'header-myinfo') {
                const myInfoBtn = document.getElementById('my-info-btn');
                if (myInfoBtn) {
                    myInfoBtn.addEventListener('click', function() {
                        window.location.href = 'mypage.html';
                    });
                    console.log('✓ 내 정보 버튼 이벤트 등록');
                }
            }
            
            // 뒤로가기 버튼 이벤트 등록
            if (componentName === 'nav-back') {
                const backBtn = document.getElementById('back-btn');
                if (backBtn && typeof BridgeApp !== 'undefined') {
                    backBtn.addEventListener('click', BridgeApp.ui.goBack);
                    console.log('✓ 뒤로가기 버튼 이벤트 등록');
                }
            }
        } catch (error) {
            console.error('이벤트 리스너 설정 실패:', error);
        }
    }
    
    // === Public API ===
    return {
        // 단일 컴포넌트 로드
        load: function(selector, componentName, ...args) {
            const success = loadComponent(selector, componentName, ...args);
            if (success) {
                setupEventListeners(componentName);
            }
            return success;
        },
        
        // 여러 컴포넌트 한번에 로드
        loadMultiple: function(configs) {
            const results = [];
            configs.forEach(config => {
                const { selector, component, args = [] } = config;
                const success = this.load(selector, component, ...args);
                results.push({ component, success });
            });
            return results;
        },
        
        // 페이지별 프리셋
        presets: {
            // 메인페이지
            mainpage: function() {
                ComponentLoader.load('#header-container', 'header-main');
            },
            
            // 마이페이지
            mypage: function() {
                ComponentLoader.load('#header-container', 'header-logout');
            },
            
            // 기능 상세 페이지
            funcDetail: function(title = '지원 기능') {
                ComponentLoader.loadMultiple([
                    { selector: '#header-container', component: 'header-myinfo' },
                    { selector: '#nav-container', component: 'nav-back', args: [title] }
                ]);
            },
            
            // 로그인 페이지
            login: function() {
                ComponentLoader.load('#header-container', 'header-simple');
            }
        },
        
        // 커스텀 컴포넌트 등록
        register: function(name, template) {
            if (components[name]) {
                console.warn(`컴포넌트 덮어쓰기: ${name}`);
            }
            components[name] = template;
            console.log(`✓ 컴포넌트 등록: ${name}`);
        },
        
        // 등록된 컴포넌트 목록
        list: function() {
            return Object.keys(components);
        }
    };
})();

// 전역 노출
if (typeof window !== 'undefined') {
    window.ComponentLoader = ComponentLoader;
}