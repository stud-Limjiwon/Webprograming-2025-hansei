const BridgeApp = (function() {
    'use strict';
    
    // === Private 변수 (constants.js 사용) ===
    const PROTECTED_PAGES = AppConstants.PAGES.PROTECTED;
    const STORAGE_KEYS = AppConstants.STORAGE_KEYS;
    
    // === Private 함수 ===
    function getCurrentPage() {
        try {
            return window.location.pathname.split('/').pop();
        } catch (error) {
            console.error('현재 페이지 경로를 가져올 수 없습니다:', error);
            return '';
        }
    }
    
    function safeGetLocalStorage(key, defaultValue = null) {
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch (error) {
            console.error(`localStorage 읽기 실패 (key: ${key}):`, error);
            return defaultValue;
        }
    }
    
    function safeSetLocalStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error(`localStorage 쓰기 실패 (key: ${key}):`, error);
            return false;
        }
    }
    
    function safeClearLocalStorage() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('localStorage 초기화 실패:', error);
            return false;
        }
    }
    
    // === Public API ===
    return {
        // [인증 관련]
        auth: {
            checkLogin: function() {
                try {
                    const isLoggedIn = safeGetLocalStorage(STORAGE_KEYS.IS_LOGGED_IN);
                    
                    if (isLoggedIn !== 'true') {
                        ModalSystem.alert(AppConstants.MESSAGES.LOGIN_REQUIRED).then(() => {
                            location.href = AppConstants.PAGES.MAIN;
                        });
                        return false;
                    }
                    return true;
                } catch (error) {
                    console.error('로그인 체크 중 에러:', error);
                    return false;
                }
            },
            
            autoCheckLogin: function() {
                try {
                    const currentPage = getCurrentPage();
                    
                    if (PROTECTED_PAGES.includes(currentPage)) {
                        this.checkLogin();
                    }
                } catch (error) {
                    console.error('자동 로그인 체크 중 에러:', error);
                }
            },
            
            logout: function() {
                try {
                    ModalSystem.confirm('로그아웃 하시겠습니까?', '로그아웃').then((confirmed) => {
                        if (!confirmed) {
                            console.log('로그아웃 취소');
                            return;
                        }
                        
                        console.log('로그아웃 진행 중...');
                        const cleared = safeClearLocalStorage();
                        
                        if (cleared) {
                            console.log('로컬스토리지 정리 완료');
                            // 로그아웃 성공 메시지 없이 바로 메인으로 이동
                            setTimeout(() => {
                                console.log('메인페이지로 이동');
                                window.location.href = AppConstants.PAGES.MAIN;
                            }, 300);
                        } else {
                            console.error('로컬스토리지 정리 실패');
                            ModalSystem.error(AppConstants.MESSAGES.LOGOUT_FAILED);
                        }
                    }).catch((error) => {
                        console.error('로그아웃 모달 에러:', error);
                    });
                } catch (error) {
                    console.error('로그아웃 중 에러:', error);
                    ModalSystem.error('로그아웃 중 오류가 발생했습니다.');
                }
            }
        },
        
        // [UI 관련]
        ui: {
            goBack: function() {
                try {
                    if (window.history.length > 1) {
                        window.history.back();
                    } else {
                        console.warn('이전 페이지가 없습니다. 메인으로 이동합니다.');
                        location.href = AppConstants.PAGES.MAIN;
                    }
                } catch (error) {
                    console.error('뒤로가기 중 에러:', error);
                    location.href = AppConstants.PAGES.MAIN;
                }
            },
            
            setProfileIcon: function(userType, elementId = 'profile-icon') {
                try {
                    const profileIcon = document.getElementById(elementId);
                    
                    if (!profileIcon) {
                        console.warn(`프로필 아이콘 요소를 찾을 수 없습니다: ${elementId}`);
                        return false;
                    }
                    
                    // 이미지 로드 실패 시 기본 이미지로 대체
                    profileIcon.onerror = function() {
                        console.warn(`이미지 로드 실패: ${this.src}`);
                        this.src = AppConstants.IMAGES.LOGO;
                        this.onerror = null; // 무한 루프 방지
                    };
                    
                    const iconSrc = AppConstants.getDisabilityIcon(userType);
                    profileIcon.src = iconSrc;
                    
                    return true;
                } catch (error) {
                    console.error('프로필 아이콘 설정 중 에러:', error);
                    return false;
                }
            }
        },
        
        // [유틸리티]
        utils: {
            getStorage: safeGetLocalStorage,
            setStorage: safeSetLocalStorage,
            clearStorage: safeClearLocalStorage
        }
    };
})();

// 페이지 로드 시 자동 로그인 체크
(function() {
    try {
        BridgeApp.auth.autoCheckLogin();
    } catch (error) {
        console.error('페이지 초기화 중 에러:', error);
    }
})();

// 하위 호환성을 위한 전역 함수
function handleLogout() {
    BridgeApp.auth.logout();
}

function goBack() {
    BridgeApp.ui.goBack();
}

function setProfileIcon(userType, elementId) {
    BridgeApp.ui.setProfileIcon(userType, elementId);
}

