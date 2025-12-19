# Webprograming-2025-hansei
# 🌉 BRIDGE : IoT 기반 장애인 접근성 자동화 웹 서비스
모든 사용자가 기술로부터 동등한 접근성을 누리도록 지원하는 사용자 맞춤형 정보 등록이 가능한 웹서비스

## 💡 프로젝트 개요 (Overview)
**목표:** 모든 사용자가 기술로부터 동등한 접근성을 누리도록 지원. <br>

**현재 문제점**<br>
기존 키오스크는 장애인 및 고령자에게 높은 진입장벽이 됩니다. BRIDGE는 사용자의 장애 유형(시각, 지체 등)을 미리 등록하고, 해당 정보에 따라 키오스크의 UI를 최적으로 자동 변경해주기 위한 정보등록 웹사이트입니다.


## 🚀 주요 구현 기능 (Key Features)
1. 사용자 맞춤형 UI 자동 전환 <br>
**시각 장애 모드**: 고대비 테마, 텍스트 확대, 큰 글씨 제공.<br>
**청각 장애 모드**: 자막 지원, 진동 피드백, 시각 알림.<br>
**지체 장애 모드**: 높이 조절, 휠체어 접근, 큰 버튼.<br>

2. 반응형 디자인 <br>
모바일 및 태블릿 환경에서도 깨지지 않는 Grid/Flex 레이아웃 구현.

3. 로그인 정보 저장 <br>
수정된 정보를 저장.

## 🔗 핵심 링크 및 자료
자세한 기획 의도와 기능 정의, 시연은 아래 링크를 참고해 주십시오.

### 1. 📋 [상세 기획안 (GitHub Wiki)](https://github.com/stud-Limjiwon/Webprograming-2025-hansei/wiki)
* 프로젝트 배경, 문제 정의, 시스템 아키텍처, 상세 기능 정의 등 **전체 기획 문서**가 포함되어 있습니다.

### 2. 🎨 [프로토타입 (Figma Prototype)](https://www.figma.com/design/X7RrlDysDkstcRikAA0ipO/web-programming?node-id=0-1&t=zCVct50kyhQUIszu-1)
* **내용:** 사용자 설정 등록 과정, 키오스크 맞춤 모드 시연 등의 인터랙티브 흐름을 확인하실 수 있습니다.

---

## 🛠️ 프론트엔드 구현 특징

* **HTML:** WAI-ARIA 및 의미론적 마크업 준수
* **CSS:** 고대비/대형 폰트 등 접근성 테마 지원 및 반응형 디자인 적용
* **JavaScript:** 개인 설정 저장/로드 로직 및 IoT 통신(가정) 기반 UI 전환 로직 구현
---

## 📁 main 브랜치 파일 구조
```
bridge-project/
│
├── mainpage.html           # 메인 서비스 선택 화면
├── login.html              # 로그인 화면
├── mypage.html             # 사용자 프로필 및 IoT 설정 화면
├── func_detail.html        # 장애 유형별 상세 기능 화면
│
├── css/                    # 스타일시트 자산
│   ├── global.css          # 공통 리셋 및 변수
│   ├── accessibility.css   # 고대비, 포커스 등 접근성 전용 레이어
│   ├── components.css      # 헤더, 버튼, 카드 등 공통 컴포넌트
│   ├── modal.css           # 커스텀 모달 시스템 스타일
│   ├── login.css           # 로그인 페이지 전용
│   ├── mainpage.css        # 메인 페이지 전용
│   └── mypage.css          # 마이페이지 전용
│
├── javaScript/             # 비즈니스 로직 및 스크립트
│   ├── constants.js        # [Core] 앱 전체 상수 및 DB 스키마 대용
│   ├── common.js           # [Core] BridgeApp 네임스페이스 및 인증/유틸리티
│   ├── componentLoader.js  # [Core] 동적 HTML 컴포넌트 렌더링 엔진
│   ├── modal.js            # [UI] 공통 모달 시스템 로직
│   ├── main.js             # [Init] 페이지별 초기화 및 라우팅 제어
│   ├── mainpage.js         # [Module] 메인페이지 전용 비즈니스 로직
│   ├── mypage.js           # [Module] 사용자 데이터 수정 및 IoT 토글 제어
│   └── func.js             # [Module] 장애 지원 등록 및 상세 페이지 제어
│
├── images/                 # 이미지 및 아이콘 자산
│   ├── mainpage.png        # 메인페이지 배너
│   ├── logo.png            # 서비스 로고
│   ├── visual.png          # 시각장애 아이콘
│   ├── hearing.png         # 청각장애 아이콘
│   └── physical.png        # 지체장애 아이콘
│
├── README.md           
└── API_Design.md      
```




