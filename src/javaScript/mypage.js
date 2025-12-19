const MypageModule = (function() {
    'use strict';
    
    function getUserData() {
        try {
            const KEYS = AppConstants.STORAGE_KEYS;
            const DEFAULTS = AppConstants.DEFAULTS;
            
            return {
                email: BridgeApp.utils.getStorage(KEYS.USER_EMAIL, DEFAULTS.NO_INFO),
                name: BridgeApp.utils.getStorage(KEYS.USER_NAME),
                phone: BridgeApp.utils.getStorage(KEYS.USER_PHONE),
                type: BridgeApp.utils.getStorage(KEYS.USER_TYPE, DEFAULTS.NO_TYPE)
            };
        } catch (error) {
            console.error('사용자 데이터 로드 실패:', error);
            return {
                email: AppConstants.DEFAULTS.NO_INFO,
                name: null,
                phone: null,
                type: AppConstants.DEFAULTS.NO_TYPE
            };
        }
    }
    
    function updateDisplayElement(id, value, defaultText = AppConstants.DEFAULTS.REGISTER_PLACEHOLDER) {
        try {
            const element = document.getElementById(id);
            
            if (!element) {
                console.warn(`요소를 찾을 수 없습니다: ${id}`);
                return false;
            }
            
            if (value && value !== "null") {
                element.innerText = value;
            } else {
                element.innerText = defaultText;
            }
            
            return true;
        } catch (error) {
            console.error(`요소 업데이트 실패 (${id}):`, error);
            return false;
        }
    }
    
    function loadUserInfo() {
        try {
            const userData = getUserData();
            
            // 이름 및 전화번호 반영
            updateDisplayElement('display-name', userData.name);
            updateDisplayElement('iot-name', userData.name);
            updateDisplayElement('display-phone', userData.phone);
            updateDisplayElement('iot-phone', userData.phone);
            updateDisplayElement('display-email', userData.email, AppConstants.DEFAULTS.LOADING);
            updateDisplayElement('user-type-display', userData.type, AppConstants.DEFAULTS.NO_TYPE_REGISTERED);
            
            // 프로필 아이콘 설정
            BridgeApp.ui.setProfileIcon(userData.type);
            
            console.log('✓ 사용자 정보 로드 완료');
        } catch (error) {
            console.error('사용자 정보 로드 중 에러:', error);
            ModalSystem.error('사용자 정보를 불러오는 중 문제가 발생했습니다.');
        }
    }
    
    function loadToggleStates() {
        try {
            const KEYS = AppConstants.STORAGE_KEYS;
            const toggles = [
                { key: KEYS.TOGGLE_WIFI, id: 'toggle-wifi' },
                { key: KEYS.TOGGLE_BLUETOOTH, id: 'toggle-bluetooth' },
                { key: KEYS.TOGGLE_GPS, id: 'toggle-gps' }
            ];
            let loadedCount = 0;
            
            toggles.forEach(toggle => {
                const state = BridgeApp.utils.getStorage(toggle.key);
                const element = document.getElementById(toggle.id);
                
                if (!element) {
                    console.warn(`토글 요소를 찾을 수 없습니다: ${toggle.id}`);
                    return;
                }
                
                if (state === 'off') {
                    element.classList.add('off');
                }
                loadedCount++;
            });
            
            console.log(`✓ ${loadedCount}개의 토글 상태 로드 완료`);
        } catch (error) {
            console.error('토글 상태 로드 중 에러:', error);
        }
    }
    
    function setupEventListeners() {
        try {
            // 로그아웃 버튼
            const logoutBtn = document.getElementById('logout-btn');
            
            if (logoutBtn) {
                logoutBtn.addEventListener('click', BridgeApp.auth.logout);
                console.log('✓ 로그아웃 버튼 이벤트 등록 완료');
            } else {
                console.error('✗ 로그아웃 버튼을 찾을 수 없습니다');
            }
        } catch (error) {
            console.error('이벤트 리스너 설정 중 에러:', error);
        }
    }
    
    // === Public API ===
    return {
        init: function() {
            try {
                console.log('마이페이지 초기화 시작...');
                loadUserInfo();
                loadToggleStates();
                setupEventListeners();
                console.log('✓ 마이페이지 초기화 완료');
            } catch (error) {
                console.error('마이페이지 초기화 실패:', error);
                ModalSystem.error('페이지 로드 중 문제가 발생했습니다.');
            }
        },
        
        handleToggle: function(type, element) {
            try {
                if (!element) {
                    console.error('토글 요소가 없습니다');
                    return false;
                }
                
                if (!type) {
                    console.error('토글 타입이 지정되지 않았습니다');
                    return false;
                }
                
                element.classList.toggle('off');
                
                const currentState = element.classList.contains('off') ? 'off' : 'on';
                
                const KEYS = AppConstants.STORAGE_KEYS;
                let storageKey;
                
                switch(type) {
                    case 'wifi':
                        storageKey = KEYS.TOGGLE_WIFI;
                        break;
                    case 'bluetooth':
                        storageKey = KEYS.TOGGLE_BLUETOOTH;
                        break;
                    case 'gps':
                        storageKey = KEYS.TOGGLE_GPS;
                        break;
                    default:
                        storageKey = 'toggle-' + type;
                }
                
                const saved = BridgeApp.utils.setStorage(storageKey, currentState);
                
                if (!saved) {
                    console.warn('토글 상태 저장 실패');
                }
                
                return true;
            } catch (error) {
                console.error('토글 처리 중 에러:', error);
                return false;
            }
        },
        
        handleEdit: function() {
            try {
                const displayName = document.getElementById('display-name');
                const displayPhone = document.getElementById('display-phone');
                const PLACEHOLDER = AppConstants.DEFAULTS.REGISTER_PLACEHOLDER;
                
                if (!displayName || !displayPhone) {
                    console.error('필수 요소를 찾을 수 없습니다');
                    ModalSystem.error('페이지 오류가 발생했습니다. 새로고침 해주세요.');
                    return;
                }
                
                const currentName = displayName.innerText || "";
                const currentPhone = displayPhone.innerText || "";
                
                const nameValue = (currentName === PLACEHOLDER) ? "" : currentName;
                const phoneValue = (currentPhone === PLACEHOLDER) ? "" : currentPhone;
                
                const newName = prompt("성명을 입력하세요:", nameValue);
                if (newName === null) return; // 취소
                
                const newPhone = prompt("전화번호를 입력하세요:", phoneValue);
                if (newPhone === null) return; // 취소
                
                // 저장
                const KEYS = AppConstants.STORAGE_KEYS;
                const nameSaved = BridgeApp.utils.setStorage(KEYS.USER_NAME, newName || PLACEHOLDER);
                const phoneSaved = BridgeApp.utils.setStorage(KEYS.USER_PHONE, newPhone || PLACEHOLDER);
                
                if (nameSaved && phoneSaved) {
                    location.reload();
                } else {
                    ModalSystem.error(AppConstants.MESSAGES.SAVE_FAILED);
                }
            } catch (error) {
                console.error('편집 처리 중 에러:', error);
                ModalSystem.error('정보 수정 중 오류가 발생했습니다.');
            }
        }
    };
})();

// 페이지 로드 시 초기화
window.onload = function() {
    try {
        MypageModule.init();
    } catch (error) {
        console.error('페이지 로드 실패:', error);
        ModalSystem.error('페이지를 불러오는 중 오류가 발생했습니다.');
    }
};

// HTML에서 직접 호출하는 함수
function handleToggle(type, element) {
    MypageModule.handleToggle(type, element);
}

function handleEdit() {
    MypageModule.handleEdit();
}