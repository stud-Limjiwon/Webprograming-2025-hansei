// func.js - 장애 유형별 지원 기능 페이지 (에러 핸들링 강화)

const FuncModule = (function() {
    'use strict';
    
    // === Private 변수 (constants.js 사용) ===
    const PAGE_DATA = AppConstants.DISABILITY_TYPES;
    const ALLOWED_TYPES = AppConstants.getAllowedTypes();
    
    // === Private 함수 ===
    function getTypeFromUrl() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const type = urlParams.get('type');
            
            // URL 파라미터 검증
            if (!type) {
                console.error('type 파라미터가 없습니다');
                return null;
            }
            
            if (!ALLOWED_TYPES.includes(type)) {
                console.error('유효하지 않은 type:', type);
                return null;
            }
            
            return type;
        } catch (error) {
            console.error('URL 파라미터 파싱 실패:', error);
            return null;
        }
    }
    
    function updatePageTitle(title) {
        try {
            const element = document.getElementById('page-title');
            
            if (!element) {
                console.error('page-title 요소를 찾을 수 없습니다');
                return false;
            }
            
            element.innerText = title;
            return true;
        } catch (error) {
            console.error('페이지 제목 업데이트 실패:', error);
            return false;
        }
    }
    
    function updateMainIcon(iconSrc) {
        try {
            const element = document.getElementById('main-icon-img');
            
            if (!element) {
                console.error('main-icon-img 요소를 찾을 수 없습니다');
                return false;
            }
            
            // 이미지 로드 실패 대비
            element.onerror = function() {
                console.warn(`이미지 로드 실패: ${iconSrc}`);
                this.src = AppConstants.IMAGES.LOGO;
                this.onerror = null;
            };
            
            element.src = iconSrc;
            return true;
        } catch (error) {
            console.error('아이콘 업데이트 실패:', error);
            return false;
        }
    }
    
    function renderFeatureOptions(options) {
        try {
            const container = document.getElementById('feature-options');
            
            if (!container) {
                console.error('feature-options 컨테이너를 찾을 수 없습니다');
                return false;
            }
            
            if (!Array.isArray(options) || options.length === 0) {
                console.warn('유효하지 않은 옵션 배열:', options);
                return false;
            }
            
            container.innerHTML = "";
            
            options.forEach(opt => {
                const div = document.createElement('div');
                div.className = 'feature-option';
                div.innerHTML = `<span>${opt}</span>`;
                container.appendChild(div);
            });
            
            return true;
        } catch (error) {
            console.error('기능 옵션 렌더링 실패:', error);
            return false;
        }
    }
    
    function setupRegisterButton(typeName) {
        try {
            const button = document.getElementById('register-btn');
            
            if (!button) {
                console.error('register-btn 버튼을 찾을 수 없습니다');
                return false;
            }
            
            button.onclick = function() {
                FuncModule.register(typeName);
            };
            
            return true;
        } catch (error) {
            console.error('등록 버튼 설정 실패:', error);
            return false;
        }
    }
    
    function renderPage(data) {
        try {
            const titleUpdated = updatePageTitle(data.title);
            const iconUpdated = updateMainIcon(data.icon);
            const optionsRendered = renderFeatureOptions(data.features);
            const buttonSetup = setupRegisterButton(data.name);
            
            if (!titleUpdated || !iconUpdated || !optionsRendered || !buttonSetup) {
                console.warn('일부 요소 렌더링 실패');
            }
            
            console.log('✓ 페이지 렌더링 완료');
        } catch (error) {
            console.error('페이지 렌더링 중 에러:', error);
            alert(AppConstants.MESSAGES.PAGE_LOAD_ERROR);
        }
    }
    
    // === Public API ===
    return {
        init: function() {
            try {
                console.log('페이지 초기화 시작...');
                
                const type = getTypeFromUrl();
                
                if (!type) {
                    console.error("유효하지 않은 접근");
                    ModalSystem.alert(AppConstants.MESSAGES.INVALID_ACCESS).then(() => {
                        location.href = AppConstants.PAGES.MAIN;
                    });
                    return;
                }
                
                const data = AppConstants.getDisabilityConfig(type);
                
                if (!data) {
                    console.error("페이지 데이터를 찾을 수 없습니다:", type);
                    ModalSystem.error("페이지 정보를 불러올 수 없습니다.").then(() => {
                        location.href = AppConstants.PAGES.MAIN;
                    });
                    return;
                }
                
                renderPage(data);
                console.log('✓ 페이지 초기화 완료');
            } catch (error) {
                console.error('페이지 초기화 실패:', error);
                ModalSystem.error(AppConstants.MESSAGES.PAGE_LOAD_ERROR).then(() => {
                    location.href = AppConstants.PAGES.MAIN;
                });
            }
        },
        
        register: function(typeName) {
            try {
                if (!typeName) {
                    console.error('typeName이 지정되지 않았습니다');
                    ModalSystem.error('등록 정보가 올바르지 않습니다.');
                    return;
                }
                
                // 1단계: 확인 모달
                ModalSystem.confirm(`${typeName} 지원 기능을 등록하시겠습니까?`, '등록 확인').then((confirmed) => {
                    if (!confirmed) {
                        console.log('사용자가 등록을 취소했습니다');
                        return;
                    }
                    
                    // 2단계: 저장 시도
                    const saved = BridgeApp.utils.setStorage(AppConstants.STORAGE_KEYS.USER_TYPE, typeName);
                    
                    if (saved) {
                        console.log('등록 성공:', typeName);
                        
                        // 3단계: 성공 모달 표시 후 페이지 이동
                        ModalSystem.success('등록이 완료되었습니다!', '등록 완료').then(() => {
                            console.log('마이페이지로 이동합니다');
                            // 모달 애니메이션 후 페이지 이동
                            setTimeout(() => {
                                window.location.href = AppConstants.PAGES.MYPAGE;
                            }, 400);
                        });
                    } else {
                        console.error('저장 실패');
                        ModalSystem.error(AppConstants.MESSAGES.REGISTER_FAILED);
                    }
                }).catch((error) => {
                    console.error('모달 처리 중 에러:', error);
                    ModalSystem.error('등록 중 오류가 발생했습니다.');
                });
            } catch (error) {
                console.error('등록 처리 중 에러:', error);
                ModalSystem.error('등록 중 오류가 발생했습니다.');
            }
        }
    };
})();

// 페이지 로드 시 초기화
window.onload = function() {
    try {
        FuncModule.init();
    } catch (error) {
        console.error('페이지 로드 실패:', error);
        ModalSystem.error('페이지를 불러오는 중 오류가 발생했습니다.');
    }
};

// HTML에서 직접 호출하는 함수 (하위 호환성)
function handleRegister(typeName) {
    FuncModule.register(typeName);
}