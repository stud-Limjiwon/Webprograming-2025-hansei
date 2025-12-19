const ModalSystem = (function() {
    'use strict';
    
    let currentModal = null;
    let resolveCallback = null;
    
    function forceCleanupModals() {
        const allModals = document.querySelectorAll('[id^="bridge-modal-"]');
        allModals.forEach(modal => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
        currentModal = null;
        resolveCallback = null;
    }
    
    function createModalHTML(options) {
        const {
            title = '',
            message,
            type = 'info', 
            confirmText = '확인',
            cancelText = '취소',
            showCancel = false
        } = options;
        
        const modalId = 'bridge-modal-' + Date.now();
        
        return `
            <div class="modal-overlay" id="${modalId}">
                <div class="modal-container modal-${type}">
                    ${title ? `<div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                    </div>` : ''}
                    <div class="modal-body">
                        <p class="modal-message">${message}</p>
                    </div>
                    <div class="modal-footer">
                        ${showCancel ? `<button class="modal-btn modal-btn-cancel" data-action="cancel">${cancelText}</button>` : ''}
                        <button class="modal-btn modal-btn-confirm" data-action="confirm">${confirmText}</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    function removeModal() {
        if (currentModal) {
            currentModal.classList.remove('modal-show');
            currentModal.classList.add('modal-fade-out');
            
            // 이벤트 리스너 제거
            currentModal.removeEventListener('click', handleModalClick);
            currentModal.removeEventListener('click', handleOverlayClick);
            
            setTimeout(() => {
                if (currentModal && currentModal.parentNode) {
                    currentModal.parentNode.removeChild(currentModal);
                }
                currentModal = null;
            }, 250);
        }
    }
    
    function handleModalClick(e) {
        const action = e.target.dataset.action;
        
        if (action === 'confirm') {
            const callback = resolveCallback;
            resolveCallback = null;
            removeModal();
            if (callback) {
                // 모달 제거 후 콜백 실행
                setTimeout(() => callback(true), 100);
            }
        } else if (action === 'cancel') {
            const callback = resolveCallback;
            resolveCallback = null;
            removeModal();
            if (callback) {
                setTimeout(() => callback(false), 100);
            }
        }
    }
    
    function handleOverlayClick(e) {
        if (e.target.classList.contains('modal-overlay')) {
            const callback = resolveCallback;
            resolveCallback = null;
            removeModal();
            if (callback) {
                setTimeout(() => callback(false), 100);
            }
        }
    }
    
    function showModal(options) {
        return new Promise((resolve) => {
            try {
                // 기존 모달 제거
                forceCleanupModals();
                
                // 새 모달 생성
                const modalHTML = createModalHTML(options);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = modalHTML;
                currentModal = tempDiv.firstElementChild;
                
                // 이벤트 리스너 등록
                resolveCallback = resolve;
                currentModal.addEventListener('click', handleModalClick);
                currentModal.addEventListener('click', handleOverlayClick);
                
                // DOM에 추가
                document.body.appendChild(currentModal);
                
                // 애니메이션을 위한 약간의 딜레이
                setTimeout(() => {
                    if (currentModal) {
                        currentModal.classList.add('modal-show');
                    }
                }, 50); 
                
            } catch (error) {
                console.error('모달 표시 중 에러:', error);
                forceCleanupModals();
                if (resolve) {
                    resolve(false);
                }
            }
        });
    }
    
    // === Public API ===
    return {
        // 일반 알림 모달
        alert: function(message, title = '') {
            return showModal({
                message,
                title,
                type: 'info',
                confirmText: '확인',
                showCancel: false
            });
        },
        
        // 성공 모달
        success: function(message, title = '성공') {
            return showModal({
                message,
                title,
                type: 'success',
                confirmText: '확인',
                showCancel: false
            });
        },
        
        // 경고 모달
        warning: function(message, title = '경고') {
            return showModal({
                message,
                title,
                type: 'warning',
                confirmText: '확인',
                showCancel: false
            });
        },
        
        // 에러 모달
        error: function(message, title = '오류') {
            return showModal({
                message,
                title,
                type: 'error',
                confirmText: '확인',
                showCancel: false
            });
        },
        
        // 확인 모달 (confirm 대체)
        confirm: function(message, title = '확인') {
            return showModal({
                message,
                title,
                type: 'confirm',
                confirmText: '확인',
                cancelText: '취소',
                showCancel: true
            });
        },
        
        // 커스텀 모달
        custom: function(options) {
            return showModal(options);
        },
        
        // 모달 닫기
        close: function() {
            const callback = resolveCallback;
            resolveCallback = null;
            removeModal();
            if (callback) {
                setTimeout(() => callback(false), 100);
            }
        },
        
        // 강제 정리 (디버깅용)
        forceCleanup: function() {
            forceCleanupModals();
        }
    };
})();

// 전역 노출
if (typeof window !== 'undefined') {
    window.ModalSystem = ModalSystem;
    
    // 페이지 로드 시 남아있는 모달 정리
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ModalSystem.forceCleanup();
        });
    }
}