// componentLoader.js - 공통 컴포넌트 동적 로더

const ComponentLoader = (function() {
    'use strict';
    
    // === 컴포넌트 템플릿 정의 ===
    const components = {
        // 기본 헤더 (로고만)
        'header-simple': function() {
            return `
                <header class="header">
                    <div class="logo" style="cursor: pointer;" onclick="location.href='mainpage.html'">
                        <img src="images/logo.png" alt="BRIDGE 로고" class="logo-image">
                    </div>
                </header>
            `;
        },
        
        // 헤더 with 내 정보 버튼
        'header-myinfo': function() {
            return `
                <header class="header">
                    <div class="logo" style="cursor: pointer;" onclick="location.href='mainpage.html'">
                        <img src="images/logo.png" alt="BRIDGE 로고" class="logo-image">
                    </div>
                    <button class="my-info-btn" onclick="location.href='mypage.html'">내 정보</button>
                </header>
            `;
        },
        
        // 헤더 with 로그아웃 버튼
        'header-logout': function() {
            return `
                <header class="header">
                    <div id="main_logo" class="logo" style="cursor: pointer;" onclick="location.href='mainpage.html'">
                        <img src="images/logo.png" alt="BRIDGE 서비스 로고" class="logo-image">
                    </div>
                    <button class="logout-btn" id="logout-btn">로그아웃</button>
                </header>
            `;
        },
        
        // 메인페이지 헤더 (동적 버튼)
        'header-main': function() {
            return `
                <header class="header">
                    <div id="main_logo" class="logo" onclick="location.href='mainpage.html'">
                        <img src="images/logo.png" alt="BRIDGE 로고" class="logo-image">
                    </div>
                    <div id="auth-area"></div>
                </header>
            `;
        },
        
        // 네비게이션 바 (뒤로가기 + 제목)
        'nav-back': function(title = '페이지') {
            return `
                <nav class="nav-bar">
                    <button class="back-btn" onclick="goBack()">←</button>
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